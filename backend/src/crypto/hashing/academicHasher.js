const normalize = (value) => String(value ?? "");
const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

const H = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
];

const rotr = (n, x) => (x >>> n) | (x << (32 - n));
const ch = (x, y, z) => (x & y) ^ (~x & z);
const maj = (x, y, z) => (x & y) ^ (x & z) ^ (y & z);
const sigma0 = (x) => rotr(2, x) ^ rotr(13, x) ^ rotr(22, x);
const sigma1 = (x) => rotr(6, x) ^ rotr(11, x) ^ rotr(25, x);
const gamma0 = (x) => rotr(7, x) ^ rotr(18, x) ^ (x >>> 3);
const gamma1 = (x) => rotr(17, x) ^ rotr(19, x) ^ (x >>> 10);

const academicSHA256 = (message) => {
    let msg = String(message ?? "");
    let bytes = [];
    for (let i = 0; i < msg.length; i++) {
        let code = msg.charCodeAt(i);
        if (code < 0x80) bytes.push(code);
        else if (code < 0x800) {
            bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
        } else if (code < 0xd800 || code >= 0xe000) {
            bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
        } else {
            i++;
            code = 0x10000 + (((code & 0x3ff) << 10) | (msg.charCodeAt(i) & 0x3ff));
            bytes.push(0xf0 | (code >> 18), 0x80 | ((code >> 12) & 0x3f), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
        }
    }
    
    let bitLen = bytes.length * 8;
    bytes.push(0x80);
    while ((bytes.length % 64) !== 56) bytes.push(0);
    
    bytes.push(0, 0, 0, 0); // 32-bit safety
    bytes.push((bitLen >>> 24) & 0xff, (bitLen >>> 16) & 0xff, (bitLen >>> 8) & 0xff, bitLen & 0xff);
    
    let h = [...H];
    for (let i = 0; i < bytes.length; i += 64) {
        let w = new Array(64);
        for (let j = 0; j < 16; j++) {
            w[j] = (bytes[i + j * 4] << 24) | (bytes[i + j * 4 + 1] << 16) | (bytes[i + j * 4 + 2] << 8) | bytes[i + j * 4 + 3];
        }
        for (let j = 16; j < 64; j++) {
            w[j] = (gamma1(w[j - 2]) + w[j - 7] + gamma0(w[j - 15]) + w[j - 16]) >>> 0;
        }
        
        let [a, b, c, d, e, f, g, hh] = h;
        for (let j = 0; j < 64; j++) {
            let t1 = (hh + sigma1(e) + ch(e, f, g) + K[j] + w[j]) >>> 0;
            let t2 = (sigma0(a) + maj(a, b, c)) >>> 0;
            hh = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
        }
        
        h[0] = (h[0] + a) >>> 0; h[1] = (h[1] + b) >>> 0; h[2] = (h[2] + c) >>> 0; h[3] = (h[3] + d) >>> 0;
        h[4] = (h[4] + e) >>> 0; h[5] = (h[5] + f) >>> 0; h[6] = (h[6] + g) >>> 0; h[7] = (h[7] + hh) >>> 0;
    }
    
    return h.map(x => x.toString(16).padStart(8, '0')).join('');
};

const pseudoRandomHex = (size = 16) => {
  const alphabet = "0123456789abcdef";
  let output = "";
  for (let index = 0; index < size * 2; index += 1) {
    output += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return output;
};

const deriveSalt = (size = 16) => pseudoRandomHex(size);

const hashPassword = (password, salt) => {
  let digest = `${normalize(password)}::${normalize(salt)}`;
  for (let round = 0; round < 4096; round += 1) {
    digest = academicSHA256(`${digest}:${round}:${salt.length}`);
  }
  return digest;
};

const comparePassword = (plainPassword, salt, storedHash) =>
  hashPassword(plainPassword, salt) === storedHash;

const fingerprint = (value) => academicSHA256(value).slice(0, 24);

module.exports = {
  deriveSalt,
  hashPassword,
  comparePassword,
  academicSHA256,
  fingerprint,
};

