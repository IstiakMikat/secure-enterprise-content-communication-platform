const CryptoKey = require("../../models/CryptoKey");
const KeyRotationLog = require("../../models/KeyRotationLog");
const { KEY_STATUS } = require("../../constants");

class AcademicKeyManager {
  constructor(provider) {
    this.provider = provider;
  }

  async generateKeyRecord({ name, algorithm, purpose, assignedUserId, expiresAt }) {
    const keyPair = this.provider.generateKeyPair(algorithm);
    return CryptoKey.create({
      name,
      algorithm,
      purpose,
      publicKeyData: keyPair.publicKey,
      encryptedPrivateKeyData: keyPair.privateKey,
      keyFingerprint: keyPair.fingerprint,
      assignedUserId,
      expiresAt,
      status: KEY_STATUS.ACTIVE,
    });
  }

  async rotateKey({ keyId, actionBy, reason }) {
    const existingKey = await CryptoKey.findById(keyId);
    const rotatedKey = await this.generateKeyRecord({
      name: `${existingKey.name}-rotated`,
      algorithm: existingKey.algorithm,
      purpose: existingKey.purpose,
      assignedUserId: existingKey.assignedUserId,
      expiresAt: existingKey.expiresAt,
    });

    existingKey.status = KEY_STATUS.ROTATED;
    existingKey.rotatedAt = new Date();
    await existingKey.save();

    await KeyRotationLog.create({
      keyId: rotatedKey._id,
      previousKeyId: existingKey._id,
      actionBy,
      reason,
    });

    return rotatedKey;
  }

  async revokeKey({ keyId }) {
    return CryptoKey.findByIdAndUpdate(
      keyId,
      { status: KEY_STATUS.REVOKED, revokedAt: new Date() },
      { new: true }
    );
  }
}

module.exports = AcademicKeyManager;

