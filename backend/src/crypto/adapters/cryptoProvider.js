const env = require("../../config/env");
const rsa = require("../rsa/academicRSA");
const ecc = require("../ecc/academicECC");
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

  protectIntegrity(message, algorithm, privateKey) {
    return algorithm === "RSA"
      ? rsa.sign(message, privateKey)
      : ecc.sign(message, privateKey);
  }

  verifyIntegrity(message, mac, algorithm, publicKey) {
    return algorithm === "RSA"
      ? rsa.verify(message, mac, publicKey)
      : ecc.verify(message, mac, publicKey);
  }

  keyFingerprint(value) {
    return fingerprint(JSON.stringify(value));
  }
}

module.exports = new AcademicCryptoProvider();

