const provider = require("../crypto/adapters/cryptoProvider");
const CryptoKey = require("../models/CryptoKey");
const AcademicKeyManager = require("../crypto/keyManagement/academicKeyManager");
const AppError = require("../utils/AppError");
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
    const mac = provider.protectIntegrity(
      ciphertext,
      algorithm,
      key.encryptedPrivateKeyData
    );

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
      encryptedField.mac,
      encryptedField.algorithm,
      key.publicKeyData
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

  async createRecordMac(payload) {
    const key = await this.getActiveKey("HMAC", "POST_INTEGRITY");
    return provider.protectIntegrity(
      JSON.stringify(payload),
      "HMAC",
      key.encryptedPrivateKeyData
    );
  }

  async verifyRecordMac(payload, mac) {
    const key = await this.getActiveKey("HMAC", "POST_INTEGRITY");
    return provider.verifyIntegrity(
      JSON.stringify(payload),
      mac,
      "HMAC",
      key.encryptedPrivateKeyData
    );
  }

  generateRandomToken(size = 32) {
    const alphabet = "0123456789abcdef";
    let token = "";
    for (let index = 0; index < size * 2; index += 1) {
      token += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return token;
  }

  fingerprint(value) {
    return fingerprint(value);
  }
}

module.exports = new CryptoService();

