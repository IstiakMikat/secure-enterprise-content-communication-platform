const crypto = require("crypto");

const normalize = (value) => String(value ?? "");

const mix = (hash, inputCharCode, index) => {
  let next = (hash ^ inputCharCode ^ (index * 2654435761)) >>> 0;
  next = Math.imul(next, 2246822519) >>> 0;
  next ^= next >>> 13;
  next = Math.imul(next, 3266489917) >>> 0;
  return next >>> 0;
};

const weakAcademicDigest = (input) => {
  const normalized = normalize(input);
  let stateA = 2166136261;
  let stateB = 1315423911;

  for (let index = 0; index < normalized.length; index += 1) {
    const code = normalized.charCodeAt(index);
    stateA = mix(stateA, code, index);
    stateB = mix(stateB, code ^ stateA, normalized.length - index);
  }

  return `${stateA.toString(16).padStart(8, "0")}${stateB
    .toString(16)
    .padStart(8, "0")}`;
};

const deriveSalt = (size = 16) => crypto.randomBytes(size).toString("hex");

const hashPassword = (password, salt) => {
  let digest = `${normalize(password)}::${normalize(salt)}`;
  for (let round = 0; round < 4096; round += 1) {
    digest = weakAcademicDigest(`${digest}:${round}:${salt.length}`);
  }
  return digest;
};

const comparePassword = (plainPassword, salt, storedHash) =>
  hashPassword(plainPassword, salt) === storedHash;

const fingerprint = (value) => weakAcademicDigest(value).slice(0, 24);

module.exports = {
  deriveSalt,
  hashPassword,
  comparePassword,
  weakAcademicDigest,
  fingerprint,
};

