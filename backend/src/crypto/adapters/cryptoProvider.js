const env = require("../../config/env");
const rsa = require("../rsa/academicRSA");
const ecc = require("../ecc/academicECC");
const hmac = require("../hmac/academicHMAC");
const { fingerprint } = require("../hashing/academicHasher");

class AcademicCryptoProvider {
  generateKeyPair(algorithm) {
    if (algorithm === "RSA") {
      return rsa.generateKeyPair(env.defaultRsaKeySize);
    }
    if (algorithm === "HMAC") {
      return hmac.generateKeyPair();
    }
    return ecc.generateKeyPair(env.defaultEccCurve);
  }

  encrypt(algorithm, plainText, publicKey) {
    return algorithm === "RSA"
      ? rsa.encrypt(plainText, publicKey)
      : ecc.encrypt(plainText, publicKey);
  }

  decrypt(algorithm, cipherText, privateKey) {
    return algorithm === "RSA"
      ? rsa.decrypt(cipherText, privateKey)
      : ecc.decrypt(cipherText, privateKey);
  }

  protectIntegrity(message, algorithm, privateKey) {
    if (algorithm === "HMAC") {
      return hmac.sign(message, privateKey);
    }
    return algorithm === "RSA"
      ? rsa.sign(message, privateKey)
      : ecc.sign(message, privateKey);
  }

  verifyIntegrity(message, mac, algorithm, keyData) {
    if (algorithm === "HMAC") {
      return hmac.verify(message, mac, keyData);
    }
    return algorithm === "RSA"
      ? rsa.verify(message, mac, keyData)
      : ecc.verify(message, mac, keyData);
  }

  keyFingerprint(value) {
    return fingerprint(JSON.stringify(value));
  }
}

module.exports = new AcademicCryptoProvider();

