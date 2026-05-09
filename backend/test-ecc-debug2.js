const ecc = require('./src/crypto/ecc/academicECC');

const m2 = '{"ciphertext":"xyz"}';
const h2 = ecc.messageScalar(m2); // Wait, messageScalar isn't exported? Let's just re-implement it.
const { academicSHA256 } = require("./src/crypto/hashing/academicHasher");
const h = (BigInt(`0x${academicSHA256(String(m2 ?? ""))}`) % 97n + 97n) % 97n;
console.log("h for m2:", h);

