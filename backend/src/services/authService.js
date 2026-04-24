const env = require("../config/env");
const Role = require("../models/Role");
const User = require("../models/User");
const OTPVerification = require("../models/OTPVerification");
const AppError = require("../utils/AppError");
const cryptoService = require("./cryptoService");
const sessionService = require("./sessionService");
const auditService = require("./auditService");
const notificationService = require("./notificationService");
const { deriveSalt, hashPassword, comparePassword, weakAcademicDigest } = require("../crypto/hashing/academicHasher");
const { ACCOUNT_STATUS, ROLES } = require("../constants");

class AuthService {
  async register(payload, context) {
    const role = await Role.findOne({ code: payload.roleCode || ROLES.USER });
    if (!role) {
      throw new AppError("Role not found", 404);
    }

    const passwordSalt = deriveSalt();
    const passwordHash = hashPassword(payload.password, passwordSalt);

    const [employeeId, username, fullName, email, phone, designation] =
      await Promise.all([
        cryptoService.encryptField(payload.employeeId, "RSA", "USER_PROFILE"),
        cryptoService.encryptField(payload.username, "RSA", "USER_PROFILE"),
        cryptoService.encryptField(payload.fullName, "RSA", "USER_PROFILE"),
        cryptoService.encryptField(payload.email, "RSA", "USER_PROFILE"),
        cryptoService.encryptField(payload.phone, "RSA", "USER_PROFILE"),
        cryptoService.encryptField(payload.designation, "RSA", "USER_PROFILE"),
      ]);

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
      departmentId: payload.departmentId,
      accountStatus: ACCOUNT_STATUS.PENDING_OTP,
    });

    const otp = await this.issueOtp(user._id, "REGISTRATION");

    await auditService.log({
      actorId: user._id,
      action: "REGISTER",
      resourceType: "USER",
      resourceId: String(user._id),
      ipAddress: context.ipAddress,
      device: context.device,
      meta: { departmentId: payload.departmentId },
    });

    return {
      userId: user._id,
      otpPreview: env.nodeEnv === "production" ? undefined : otp.plainCode,
    };
  }

  async login(payload, context) {
    const users = await User.find().populate("roleId departmentId");
    let matchedUser = null;

    for (const candidate of users) {
      const decryptedEmail = await cryptoService.decryptField(
        candidate.email,
        "USER_PROFILE"
      );
      if (decryptedEmail === payload.email) {
        matchedUser = candidate;
        break;
      }
    }

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

    const otp = await this.issueOtp(matchedUser._id, "LOGIN");
    return {
      userId: matchedUser._id,
      otpPreview: env.nodeEnv === "production" ? undefined : otp.plainCode,
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
    const users = await User.find();
    let matchedUser = null;

    for (const candidate of users) {
      const email = await cryptoService.decryptField(candidate.email, "USER_PROFILE");
      if (email === payload.email) {
        matchedUser = candidate;
        break;
      }
    }

    if (!matchedUser) {
      return { message: "If the account exists, reset instructions were issued." };
    }

    const resetToken = cryptoService.generateRandomToken(16);
    const otpRecord = await OTPVerification.create({
      userId: matchedUser._id,
      purpose: "PASSWORD_RESET",
      codeHash: weakAcademicDigest(resetToken),
      expiresAt: new Date(Date.now() + env.resetTokenTtlMinutes * 60 * 1000),
    });

    return {
      message: "Reset token issued",
      resetTokenPreview: env.nodeEnv === "production" ? undefined : resetToken,
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

  async issueOtp(userId, purpose) {
    const plainCode = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = weakAcademicDigest(plainCode);

    await OTPVerification.create({
      userId,
      purpose,
      codeHash,
      expiresAt: new Date(Date.now() + env.otpTtlMinutes * 60 * 1000),
    });

    return { plainCode };
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
    };
  }
}

module.exports = new AuthService();
