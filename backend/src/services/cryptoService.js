const crypto = require("crypto");
const provider = require("../crypto/adapters/cryptoProvider");
const CryptoKey = require("../models/CryptoKey");
const AcademicKeyManager = require("../crypto/keyManagement/academicKeyManager");
const AppError = require("../utils/AppError");
const { createMac } = require("../crypto/mac/hmac");
const { fingerprint } = require("../crypto/hashing/academicHasher");

class CryptoService {
  constructor() {
    this.keyManager = new AcademicKeyManager(provider);
  }

  async getActiveKey(algorithm, purpose = "APPLICATION") {
    let key = await CryptoKey.findOne({
      algorithm,
      purpose,
      status: "ACTIVE",
    }).sort({ createdAt: -1 });

    if (!key) {
      key = await this.keyManager.generateKeyRecord({
        name: `${purpose}-${algorithm}-primary`,
        algorithm,
        purpose,
      });
    }

    return key;
  }

  async encryptField(plainText, algorithm, purpose) {
    const key = await this.getActiveKey(algorithm, purpose);
    const ciphertext = provider.encrypt(algorithm, plainText, key.publicKeyData);
    const mac = provider.protectIntegrity(ciphertext);

    return {
      algorithm,
      ciphertext,
      mac,
      keyFingerprint: key.keyFingerprint,
    };
  }

  async decryptField(encryptedField, purpose) {
    if (!encryptedField?.ciphertext) {
      return "";
    }

    const key = await CryptoKey.findOne({
      keyFingerprint: encryptedField.keyFingerprint,
      purpose,
    });

    if (!key) {
      throw new AppError("Encryption key not found", 500);
    }

    const isValid = provider.verifyIntegrity(
      encryptedField.ciphertext,
      encryptedField.mac
    );

    if (!isValid) {
      throw new AppError("Integrity validation failed", 409);
    }

    return provider.decrypt(
      encryptedField.algorithm,
      encryptedField.ciphertext,
      key.encryptedPrivateKeyData
    );
  }

  createRecordMac(payload) {
    return createMac(JSON.stringify(payload), "record-mac");
  }

  verifyRecordMac(payload, mac) {
    return createMac(JSON.stringify(payload), "record-mac") === mac;
  }

  generateRandomToken(size = 32) {
    return crypto.randomBytes(size).toString("hex");
  }

  fingerprint(value) {
    return fingerprint(value);
  }
}

module.exports = new CryptoService();

