const { academicSHA256, fingerprint } = require("../hashing/academicHasher");

const BLOCK_SIZE = 64;

const stringToBytes = (str) => {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
};

const bytesToString = (bytes) => {
  return String.fromCharCode.apply(null, bytes);
};

const sign = (message, privateKey) => {
  let keyStr = privateKey.key || "";
  
  if (keyStr.length > BLOCK_SIZE) {
    keyStr = academicSHA256(keyStr);
  }
  
  let keyBytes = stringToBytes(keyStr);
  while (keyBytes.length < BLOCK_SIZE) {
    keyBytes.push(0);
  }

  const o_key_pad = new Array(BLOCK_SIZE);
  const i_key_pad = new Array(BLOCK_SIZE);
  
  for (let i = 0; i < BLOCK_SIZE; i++) {
    o_key_pad[i] = keyBytes[i] ^ 0x5c;
    i_key_pad[i] = keyBytes[i] ^ 0x36;
  }

  const innerStr = bytesToString(i_key_pad) + String(message);
  const innerHashHex = academicSHA256(innerStr);
  
  const outerStr = bytesToString(o_key_pad) + innerHashHex;
  const outerHashHex = academicSHA256(outerStr);
  
  return outerHashHex;
};

const verify = (message, signature, privateKey) => {
  const expected = sign(message, privateKey);
  return expected === signature;
};

const generateKeyPair = () => {
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let key = "";
  for (let i = 0; i < 32; i++) {
    key += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return {
    publicKey: {},
    privateKey: { key: key },
    fingerprint: fingerprint(`hmac:${key}`)
  };
};

module.exports = {
  sign,
  verify,
  generateKeyPair
};
