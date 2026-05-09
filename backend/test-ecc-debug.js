const ecc = require('./src/crypto/ecc/academicECC');

for (let i = 0; i < 100; i++) {
  const keyPair = ecc.generateKeyPair();
  
  const m1 = "test ciphertext payload";
  const s1 = ecc.sign(m1, keyPair.privateKey);
  const v1 = ecc.verify(m1, s1, keyPair.publicKey);
  
  const m2 = '{"ciphertext":"xyz"}';
  const s2 = ecc.sign(m2, keyPair.privateKey);
  const v2 = ecc.verify(m2, s2, keyPair.publicKey);
  
  if (!v1 || !v2) {
    console.log(`Failed! v1: ${v1}, v2: ${v2}, privateKey: ${keyPair.privateKey.scalar}`);
  }
}
console.log("Done");
