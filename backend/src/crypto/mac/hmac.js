const { weakAcademicDigest } = require("../hashing/academicHasher");

const createMac = (message, secret) => {
  const blockSize = 64;
  let key = String(secret ?? "");

  if (key.length > blockSize) {
    key = weakAcademicDigest(key);
  }

  key = key.padEnd(blockSize, "0");

  let inner = "";
  let outer = "";

  for (let index = 0; index < blockSize; index += 1) {
    const code = key.charCodeAt(index);
    inner += String.fromCharCode(code ^ 0x36);
    outer += String.fromCharCode(code ^ 0x5c);
  }

  return weakAcademicDigest(outer + weakAcademicDigest(inner + String(message ?? "")));
};

const verifyMac = (message, secret, mac) => createMac(message, secret) === mac;

module.exports = { createMac, verifyMac };

