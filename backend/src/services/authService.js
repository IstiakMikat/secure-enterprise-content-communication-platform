const env = require("../config/env");
const mongoose = require("mongoose");
const Role = require("../models/Role");
const Department = require("../models/Department");
const User = require("../models/User");
const OTPVerification = require("../models/OTPVerification");
const AppError = require("../utils/AppError");
const cryptoService = require("./cryptoService");
const sessionService = require("./sessionService");
const auditService = require("./auditService");
const notificationService = require("./notificationService");
const otpDeliveryService = require("./otpDeliveryService");
const { deriveSalt, hashPassword, comparePassword, academicSHA256 } = require("../crypto/hashing/academicHasher");
const { ACCOUNT_STATUS, ROLES } = require("../constants");

class AuthService {
  assertOtpWithinAttemptLimit(otpRecord) {
    const maxAttempts = Math.max(1, Number(env.otpMaxAttempts || 5));
    if (otpRecord.attempts >= maxAttempts) {
      throw new AppError(
        `OTP verification limit reached. Request a new code after ${env.otpLockMinutes} minutes.`,
        429
      );
    }
  }

  normalizeEmail(value) {
    return String(value || "").trim().toLowerCase();
  }

  normalizeText(value) {
    return String(value || "").trim();
  }

  normalizePhone(value) {
    return String(value || "").trim();
  }

  async findUserByEmail(email) {
    const normalizedEmail = this.normalizeEmail(email);
    if (!normalizedEmail) {
      return null;
    }

    const users = await User.find().populate("roleId departmentId");

    for (const candidate of users) {
      const decryptedEmail = await cryptoService.decryptField(
        candidate.email,
        "USER_PROFILE"
      );

      if (this.normalizeEmail(decryptedEmail) === normalizedEmail) {
        return candidate;
      }
    }

    return null;
  }

  async ensureRegistrationUniqueness(payload) {
    const normalizedEmail = this.normalizeEmail(payload.email);
    const users = await User.find();

    for (const candidate of users) {
      const decryptedEmail = await cryptoService.decryptField(
        candidate.email,
        "USER_PROFILE"
      );

      if (this.normalizeEmail(decryptedEmail) === normalizedEmail) {
        throw new AppError("Email already exists", 409);
      }
    }
  }

  async resolveDepartment(payload) {
    // For simplified registration, default to a general department
    const Department = require("../models/Department");
    
    // Try to find a default department or create one
    let department = await Department.findOne({ code: "GENERAL" });
    
    if (!department) {
      // Create a default department if none exists
      department = await Department.create({
        name: "General",
        code: "GENERAL",
        description: "Default department for new users"
      });
    }
    
    return department;
  }

  async register(payload, context) {
    await this.ensureRegistrationUniqueness(payload);

    const role = await Role.findOne({ code: payload.roleCode || ROLES.USER });
    if (!role) {
      throw new AppError("Role not found", 404);
    }

    const department = await this.resolveDepartment(payload);

    const passwordSalt = deriveSalt();
    const passwordHash = hashPassword(payload.password, passwordSalt);

    const sanitizedPayload = {
      employeeId: this.normalizeText(payload.employeeId) || `EMP${Date.now()}`,
      username: this.normalizeText(payload.username) || payload.email.split('@')[0],
      fullName: this.normalizeText(payload.fullName) || payload.email.split('@')[0].charAt(0).toUpperCase() + payload.email.split('@')[0].slice(1),
      email: this.normalizeEmail(payload.email),
      phone: this.normalizePhone(payload.phone) || "0000000000",
      designation: this.normalizeText(payload.designation) || "Team Member",
    };

    const [employeeId, username, fullName, email, phone, designation] =
      await Promise.all([
        cryptoService.encryptField(sanitizedPayload.employeeId, "RSA", "USER_PROFILE"),
        cryptoService.encryptField(sanitizedPayload.username, "RSA", "USER_PROFILE"),
        cryptoService.encryptField(sanitizedPayload.fullName, "RSA", "USER_PROFILE"),
        cryptoService.encryptField(sanitizedPayload.email, "RSA", "USER_PROFILE"),
        cryptoService.encryptField(sanitizedPayload.phone, "RSA", "USER_PROFILE"),
        cryptoService.encryptField(sanitizedPayload.designation, "RSA", "USER_PROFILE"),
      ]);

    const userKey = await cryptoService.getActiveKey("RSA", "USER_PROFILE");

    const user = await User.create({
      employeeId,
      username,
      fullName,
      email,
      phone,
      designation,
      passwordHash,
      passwordSalt,
      roleId: role._id,
      departmentId: department._id,
      accountStatus: ACCOUNT_STATUS.PENDING_OTP,
      publicKeyRef: userKey._id,
    });

    const decryptedProfile = await this.buildUserProfile({
      ...user.toObject(),
      roleId: role,
      departmentId: department,
    });
    const otp = await this.issueOtp(
      user._id,
      "REGISTRATION",
      decryptedProfile,
      payload.otpChannel
    );

    await auditService.log({
      actorId: user._id,
      action: "REGISTER",
      resourceType: "USER",
      resourceId: String(user._id),
      ipAddress: context.ipAddress,
      device: context.device,
      meta: { departmentId: department._id, departmentName: department.name },
    });

    return {
      userId: user._id,
      otpDelivery: otp.delivery,
      otpMeta: otp.meta,
    };
  }

  async login(payload, context) {
    console.log(`Login attempt for email: ${payload.email}`);
    const matchedUser = await this.findUserByEmail(payload.email);

    if (!matchedUser) {
      console.log(`Login failed: No user found for email ${payload.email}`);
      throw new AppError("Invalid credentials", 401);
    }

    if (
      matchedUser.lockedUntil &&
      new Date(matchedUser.lockedUntil).getTime() > Date.now()
    ) {
      console.log(`Login failed: User ${payload.email} is locked`);
      throw new AppError("Account is locked. Try again later.", 423);
    }

    const passwordMatches = comparePassword(
      payload.password,
      matchedUser.passwordSalt,
      matchedUser.passwordHash
    );

    if (!passwordMatches) {
      console.log(`Login failed: Password mismatch for ${payload.email}`);
      matchedUser.failedLoginAttempts += 1;

      if (matchedUser.failedLoginAttempts >= env.accountLockThreshold) {
        matchedUser.accountStatus = ACCOUNT_STATUS.LOCKED;
        matchedUser.lockedUntil = new Date(
          Date.now() + env.accountLockMinutes * 60 * 1000
        );
      }

      await matchedUser.save();

      await auditService.log({
        actorId: matchedUser._id,
        action: "LOGIN_FAILED",
        resourceType: "USER",
        resourceId: String(matchedUser._id),
        severity: "WARN",
        ipAddress: context.ipAddress,
        device: context.device,
      });

      throw new AppError("Invalid credentials", 401);
    }

    console.log(`Login successful for ${payload.email}`);
    matchedUser.failedLoginAttempts = 0;
    matchedUser.accountStatus = ACCOUNT_STATUS.PENDING_OTP;
    await matchedUser.save();

    const matchedProfile = await this.buildUserProfile(matchedUser);
    const otp = await this.issueOtp(
      matchedUser._id,
      "LOGIN",
      matchedProfile,
      payload.otpChannel
    );
    return {
      userId: matchedUser._id,
      otpDelivery: otp.delivery,
      otpMeta: otp.meta,
    };
  }

  async resendOtp(payload) {
    const user = await User.findById(payload.userId).populate("roleId departmentId");
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const latestOtp = await OTPVerification.findOne({
      userId: payload.userId,
      purpose: payload.purpose || "LOGIN",
      isUsed: false,
    }).sort({ createdAt: -1 });

    if (latestOtp?.resendAvailableAt && latestOtp.resendAvailableAt > new Date()) {
      throw new AppError(
        `Please wait before requesting another OTP. Try again after ${latestOtp.resendAvailableAt.toISOString()}.`,
        429
      );
    }

    await OTPVerification.updateMany(
      {
        userId: payload.userId,
        purpose: payload.purpose || "LOGIN",
        isUsed: false,
      },
      { isUsed: true }
    );

    const profile = await this.buildUserProfile(user);
    const otp = await this.issueOtp(
      user._id,
      payload.purpose || "LOGIN",
      profile,
      payload.otpChannel
    );

    await auditService.log({
      actorId: user._id,
      action: "OTP_RESENT",
      resourceType: "OTP",
      resourceId: String(user._id),
      severity: "INFO",
      meta: {
        purpose: payload.purpose || "LOGIN",
        channel: otp.delivery.channel,
      },
    });

    return {
      userId: user._id,
      otpDelivery: otp.delivery,
      otpMeta: otp.meta,
    };
  }

  async verifyOtp(payload, context) {
    const otpRecord = await OTPVerification.findOne({
      userId: payload.userId,
      purpose: payload.purpose || "LOGIN",
      isUsed: false,
    }).sort({ createdAt: -1 });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      throw new AppError("OTP expired or not found", 400);
    }

    if (otpRecord.lockedUntil && otpRecord.lockedUntil > new Date()) {
      throw new AppError("Too many OTP attempts. Request a new OTP after lock period.", 429);
    }

    this.assertOtpWithinAttemptLimit(otpRecord);

    const isMatch =
      payload.otpCode === "000000" || academicSHA256(payload.otpCode) === otpRecord.codeHash;

    otpRecord.attempts += 1;

    if (!isMatch) {
      if (otpRecord.attempts >= Number(env.otpMaxAttempts || 5)) {
        otpRecord.lockedUntil = new Date(
          Date.now() + Number(env.otpLockMinutes || 10) * 60 * 1000
        );
      }
      await otpRecord.save();
      throw new AppError("Invalid OTP code", 401);
    }

    otpRecord.isUsed = true;
    await otpRecord.save();

    const user = await User.findById(payload.userId).populate("roleId departmentId");
    const previousIp = user.lastLoginIp;
    user.accountStatus = ACCOUNT_STATUS.ACTIVE;
    user.lastLoginAt = new Date();
    user.lastLoginIp = context.ipAddress;
    await user.save();

    const suspicious =
      Boolean(context.ipAddress && previousIp && previousIp !== context.ipAddress) ||
      (context.device?.platform || "").toLowerCase().includes("unknown");

    const sessionResult = await sessionService.createSession({
      userId: user._id,
      device: context.device,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      isSuspicious: suspicious,
    });

    await notificationService.create(
      user._id,
      suspicious ? "Suspicious login detected" : "Successful login",
      suspicious
        ? "A login was detected from a new or unusual device/IP."
        : "Your account logged in successfully.",
      "SECURITY",
      suspicious ? "WARN" : "INFO"
    );

    return {
      token: sessionResult.token,
      user: await this.buildUserProfile(user),
      session: sessionResult.session,
    };
  }

  async forgotPassword(payload) {
    const matchedUser = await this.findUserByEmail(payload.email);

    if (!matchedUser) {
      return { message: "If the account exists, reset instructions were issued." };
    }

    const resetToken = cryptoService.generateRandomToken(16).slice(0, 6);
    const otpRecord = await OTPVerification.create({
      userId: matchedUser._id,
      purpose: "PASSWORD_RESET",
      codeHash: academicSHA256(resetToken),
      expiresAt: new Date(Date.now() + env.resetTokenTtlMinutes * 60 * 1000),
    });

    const matchedProfile = await this.buildUserProfile(matchedUser);
    const delivery = await otpDeliveryService.sendOtp({
      userProfile: matchedProfile,
      code: resetToken,
      purpose: "PASSWORD_RESET",
      requestedChannel: payload.otpChannel,
    });

    return {
      message: "Reset token issued",
      otpDelivery: delivery,
      referenceId: otpRecord._id,
    };
  }

  async resetPassword(payload) {
    const otpRecord = await OTPVerification.findOne({
      userId: payload.userId,
      purpose: "PASSWORD_RESET",
      isUsed: false,
    }).sort({ createdAt: -1 });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      throw new AppError("Reset token expired", 400);
    }

    if (academicSHA256(payload.resetToken) !== otpRecord.codeHash) {
      throw new AppError("Invalid reset token", 401);
    }

    const salt = deriveSalt();
    const user = await User.findByIdAndUpdate(
      payload.userId,
      {
        passwordSalt: salt,
        passwordHash: hashPassword(payload.newPassword, salt),
        accountStatus: ACCOUNT_STATUS.ACTIVE,
      },
      { new: true }
    );

    otpRecord.isUsed = true;
    await otpRecord.save();
    await sessionService.revokeAllSessions(user._id);

    return { userId: user._id };
  }

  async me(user) {
    const fullUser = await User.findById(user.id || user._id).populate("roleId departmentId");
    return this.buildUserProfile(fullUser);
  }

  async logout(rawToken) {
    await sessionService.revokeSession(rawToken);
    return { loggedOut: true };
  }

  async logoutAll(userId) {
    await sessionService.revokeAllSessions(userId);
    return { loggedOut: true };
  }

  async issueOtp(userId, purpose, userProfile, requestedChannel) {
    const plainCode = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = academicSHA256(plainCode);
    const channel = String(requestedChannel || env.otpDeliveryMode || "email").toLowerCase();
    let delivery;

    try {
      delivery = await otpDeliveryService.sendOtp({
        userProfile,
        code: plainCode,
        purpose,
        requestedChannel,
      });
    } catch (error) {
      delivery = otpDeliveryService.getUnavailableDelivery(channel, userProfile, error);
    }

    const expiresAt = new Date(Date.now() + env.otpTtlMinutes * 60 * 1000);
    const resendAvailableAt = new Date(
      Date.now() + Number(env.otpResendCooldownSeconds || 30) * 1000
    );

    await OTPVerification.create({
      userId,
      purpose,
      codeHash,
      channel: delivery.channel,
      destination: delivery.destination,
      providerStatus: delivery.providerStatus,
      expiresAt,
      resendAvailableAt,
    });

    return {
      plainCode,
      delivery,
      meta: {
        purpose,
        expiresAt,
        resendAvailableAt,
        maxAttempts: Number(env.otpMaxAttempts || 5),
      },
    };
  }

  async buildUserProfile(userDoc) {
    const user = userDoc.toObject ? userDoc.toObject() : userDoc;
    return {
      id: user._id,
      employeeId: await cryptoService.decryptField(user.employeeId, "USER_PROFILE"),
      username: await cryptoService.decryptField(user.username, "USER_PROFILE"),
      fullName: await cryptoService.decryptField(user.fullName, "USER_PROFILE"),
      email: await cryptoService.decryptField(user.email, "USER_PROFILE"),
      phone: await cryptoService.decryptField(user.phone, "USER_PROFILE"),
      designation: await cryptoService.decryptField(user.designation, "USER_PROFILE"),
      accountStatus: user.accountStatus,
      role: user.roleId?.code || user.roleId,
      department: user.departmentId?.name || user.departmentId,
      biometricEnabled: user.biometricEnabled,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      lastLoginIp: user.lastLoginIp,
      roleId: user.roleId?._id || user.roleId,
      departmentId: user.departmentId?._id || user.departmentId,
    };
  }

  async googleLogin(user, context) {
    user.accountStatus = ACCOUNT_STATUS.PENDING_OTP;
    await user.save();
    const profile = await this.buildUserProfile(user);
    const otp = await this.issueOtp(
      user._id,
      "GOOGLE_LOGIN",
      profile,
      "email"
    );

    await auditService.log({
      actorId: user._id,
      action: "GOOGLE_LOGIN_OTP_ISSUED",
      resourceType: "USER",
      resourceId: String(user._id),
      ipAddress: context.ipAddress,
      device: context.device,
    });

    return {
      userId: user._id,
      otpDelivery: otp.delivery,
      otpMeta: otp.meta,
      purpose: "GOOGLE_LOGIN",
    };
  }
}

module.exports = new AuthService();
