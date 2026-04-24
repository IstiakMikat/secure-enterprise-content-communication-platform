const env = require("../../config/env");
const rsa = require("../rsa/academicRSA");
const ecc = require("../ecc/academicECC");
const { createMac, verifyMac } = require("../mac/hmac");
const { fingerprint } = require("../hashing/academicHasher");

class AcademicCryptoProvider {
  generateKeyPair(algorithm) {
    if (algorithm === "RSA") {
      return rsa.generateKeyPair(env.defaultRsaKeySize);
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

  protectIntegrity(message) {
    return createMac(message, env.academicMacSecret);
  }

  verifyIntegrity(message, mac) {
    return verifyMac(message, env.academicMacSecret, mac);
  }

  keyFingerprint(value) {
    return fingerprint(JSON.stringify(value));
  }
}

module.exports = new AcademicCryptoProvider();

