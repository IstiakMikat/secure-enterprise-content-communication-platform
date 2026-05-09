const provider = require('./src/crypto/adapters/cryptoProvider');
const ecc = require('./src/crypto/ecc/academicECC');

const keyPair = provider.generateKeyPair('ECC');
const message = "test ciphertext payload";

const mac = provider.protectIntegrity(message, 'ECC', keyPair.privateKey);
console.log("MAC:", mac);

const isValid = provider.verifyIntegrity(message, mac, 'ECC', keyPair.publicKey);
console.log("isValid:", isValid);

// What if message is object?
const obj = JSON.stringify({ ciphertext: "xyz" });
const mac2 = provider.protectIntegrity(obj, 'ECC', keyPair.privateKey);
const isValid2 = provider.verifyIntegrity(obj, mac2, 'ECC', keyPair.publicKey);
console.log("isValid2:", isValid2);
