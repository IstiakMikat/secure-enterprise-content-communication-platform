const User = require("../models/User");
const UserProfileHistory = require("../models/UserProfileHistory");
const authService = require("./authService");
const cryptoService = require("./cryptoService");
const notificationService = require("./notificationService");
const sessionService = require("./sessionService");
const { deriveSalt, hashPassword, comparePassword } = require("../crypto/hashing/academicHasher");
const AppError = require("../utils/AppError");

class UserService {
  async getProfile(userId) {
    const user = await User.findById(userId).populate("roleId departmentId");
    return authService.buildUserProfile(user);
  }

  async updateProfile(userId, payload, actorId) {
    const user = await User.findById(userId).populate("roleId departmentId");
    const beforeSnapshot = await authService.buildUserProfile(user);

    const updates = {};
    const encryptedFields = ["fullName", "phone", "designation"];

    for (const field of encryptedFields) {
      if (payload[field]) {
        updates[field] = await cryptoService.encryptField(
          payload[field],
          "RSA",
          "USER_PROFILE"
        );
      }
    }

    const updated = await User.findByIdAndUpdate(userId, updates, { new: true }).populate(
      "roleId departmentId"
    );

    const afterSnapshot = await authService.buildUserProfile(updated);

    await UserProfileHistory.create({
      userId,
      changedBy: actorId,
      beforeSnapshot,
      afterSnapshot,
      reason: payload.reason || "Profile updated",
    });

    return afterSnapshot;
  }

  async changePassword(userId, payload) {
    const user = await User.findById(userId);
    const matches = comparePassword(
      payload.currentPassword,
      user.passwordSalt,
      user.passwordHash
    );

    if (!matches) {
      throw new AppError("Current password is invalid", 401);
    }

    const salt = deriveSalt();
    user.passwordSalt = salt;
    user.passwordHash = hashPassword(payload.newPassword, salt);
    await user.save();

    return { changed: true };
  }

  getNotifications(userId) {
    return notificationService.list(userId);
  }

  markNotificationRead(userId, notificationId) {
    return notificationService.markRead(userId, notificationId);
  }

  async getSessions(userId) {
    return sessionService.listSessions(userId);
  }
}

module.exports = new UserService();
