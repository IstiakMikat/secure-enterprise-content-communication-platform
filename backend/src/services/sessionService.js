const env = require("../config/env");
const Session = require("../models/Session");
const { weakAcademicDigest } = require("../crypto/hashing/academicHasher");
const cryptoService = require("./cryptoService");

class SessionService {
  async createSession({ userId, device, ipAddress, userAgent, isSuspicious }) {
    const rawToken = cryptoService.generateRandomToken(24);
    const tokenHash = weakAcademicDigest(rawToken);
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
      tokenHash: weakAcademicDigest(rawToken),
      revokedAt: { $exists: false },
      expiresAt: { $gt: new Date() },
    }).populate({
      path: "userId",
      populate: [{ path: "roleId" }, { path: "departmentId" }],
    });
  }

  async revokeSession(rawToken) {
    return Session.findOneAndUpdate(
      { tokenHash: weakAcademicDigest(rawToken) },
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
}

module.exports = new SessionService();
