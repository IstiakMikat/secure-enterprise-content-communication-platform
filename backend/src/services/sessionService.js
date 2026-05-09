const env = require("../config/env");
const Session = require("../models/Session");
const { academicSHA256 } = require("../crypto/hashing/academicHasher");
const cryptoService = require("./cryptoService");

class SessionService {
  async createSession({ userId, device, ipAddress, userAgent, isSuspicious }) {
    const rawToken = cryptoService.generateRandomToken(24);
    const tokenHash = academicSHA256(rawToken);
    const expiresAt = new Date(
      Date.now() + env.sessionTokenTtlHours * 60 * 60 * 1000
    );

    const session = await Session.create({
      userId,
      tokenHash,
      device,
      ipAddress,
      userAgent,
      isSuspicious,
      expiresAt,
      lastSeenAt: new Date(),
    });

    return {
      token: rawToken,
      session,
    };
  }

  async getSessionByToken(rawToken) {
    return Session.findOne({
      tokenHash: academicSHA256(rawToken),
      revokedAt: { $exists: false },
      expiresAt: { $gt: new Date() },
    }).populate({
      path: "userId",
      populate: [{ path: "roleId" }, { path: "departmentId" }],
    });
  }

  async revokeSession(rawToken) {
    return Session.findOneAndUpdate(
      { tokenHash: academicSHA256(rawToken) },
      { revokedAt: new Date() },
      { new: true }
    );
  }

  async revokeAllSessions(userId) {
    return Session.updateMany(
      { userId, revokedAt: { $exists: false } },
      { revokedAt: new Date() }
    );
  }

  async listSessions(userId) {
    return Session.find({ userId }).sort({ createdAt: -1 });
  }
}

module.exports = new SessionService();
