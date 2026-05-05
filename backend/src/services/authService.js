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
const { deriveSalt, hashPassword, comparePassword, weakAcademicDigest } = require("../crypto/hashing/academicHasher");
const { ACCOUNT_STATUS, ROLES } = require("../constants");

class AuthService {
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
    const normalizedEmployeeId = this.normalizeText(payload.employeeId);
    const normalizedUsername = this.normalizeText(payload.username).toLowerCase();
    const normalizedEmail = this.normalizeEmail(payload.email);
    const normalizedPhone = this.normalizePhone(payload.phone);
    const users = await User.find();

    for (const candidate of users) {
      const [employeeId, username, email, phone] = await Promise.all([
        cryptoService.decryptField(candidate.employeeId, "USER_PROFILE"),
        cryptoService.decryptField(candidate.username, "USER_PROFILE"),
        cryptoService.decryptField(candidate.email, "USER_PROFILE"),
        cryptoService.decryptField(candidate.phone, "USER_PROFILE"),
      ]);

      if (this.normalizeText(employeeId) === normalizedEmployeeId) {
        throw new AppError("Employee ID already exists", 409);
      }

      if (this.normalizeText(username).toLowerCase() === normalizedUsername) {
        throw new AppError("Username already exists", 409);
      }

      if (this.normalizeEmail(email) === normalizedEmail) {
        throw new AppError("Email already exists", 409);
      }

      if (this.normalizePhone(phone) === normalizedPhone) {
        throw new AppError("Phone number already exists", 409);
      }
    }
  }

  async resolveDepartment(payload) {
    if (payload.departmentId && mongoose.Types.ObjectId.isValid(payload.departmentId)) {
      const department = await Department.findById(payload.departmentId);
      if (department) {
        return department;
      }
    }

    const departmentLookup = payload.department || payload.departmentId;
    if (!departmentLookup) {
      throw new AppError("Department is required", 422);
    }

    const department = await Department.findOne({
      $or: [
        { name: departmentLookup },
        { code: String(departmentLookup).toUpperCase().replace(/\s+/g, "_") },
      ],
    });

    if (!department) {
      throw new AppError("Department not found", 404);
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
      employeeId: this.normalizeText(payload.employeeId),
      username: this.normalizeText(payload.username),
      fullName: this.normalizeText(payload.fullName),
      email: this.normalizeEmail(payload.email),
      phone: this.normalizePhone(payload.phone),
      designation: this.normalizeText(payload.designation),
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
    };
  }

  async login(payload, context) {
    const matchedUser = await this.findUserByEmail(payload.email);

    if (!matchedUser) {
      throw new AppError("Invalid credentials", 401);
    }

    if (
      matchedUser.lockedUntil &&
      new Date(matchedUser.lockedUntil).getTime() > Date.now()
    ) {
      throw new AppError("Account is locked. Try again later.", 423);
    }

    const passwordMatches = comparePassword(
      payload.password,
      matchedUser.passwordSalt,
      matchedUser.passwordHash
    );

    if (!passwordMatches) {
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
    };
  }

  async resendOtp(payload) {
    const user = await User.findById(payload.userId).populate("roleId departmentId");
    if (!user) {
      throw new AppError("User not found", 404);
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

    const isMatch =
      weakAcademicDigest(payload.otpCode) === otpRecord.codeHash;

    otpRecord.attempts += 1;

    if (!isMatch) {
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
      codeHash: weakAcademicDigest(resetToken),
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

    if (weakAcademicDigest(payload.resetToken) !== otpRecord.codeHash) {
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
    const codeHash = weakAcademicDigest(plainCode);
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

    await OTPVerification.create({
      userId,
      purpose,
      codeHash,
      channel: delivery.channel,
      destination: delivery.destination,
      providerStatus: delivery.providerStatus,
      expiresAt: new Date(Date.now() + env.otpTtlMinutes * 60 * 1000),
    });

    return { plainCode, delivery };
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
    // Update last login
    user.lastLoginAt = new Date();
    user.lastLoginIp = context.ipAddress;
    user.accountStatus = ACCOUNT_STATUS.ACTIVE; // Ensure active for Google users
    await user.save();

    const suspicious = false; // For simplicity, assume not suspicious for Google login

    const sessionResult = await sessionService.createSession({
      userId: user._id,
      device: context.device,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      isSuspicious: suspicious,
    });

    await auditService.log({
      actorId: user._id,
      action: "GOOGLE_LOGIN",
      resourceType: "USER",
      resourceId: String(user._id),
      ipAddress: context.ipAddress,
      device: context.device,
    });

    return {
      token: sessionResult.token,
      user: await this.buildUserProfile(user),
      session: sessionResult.session,
    };
  }
}

module.exports = new AuthService();
