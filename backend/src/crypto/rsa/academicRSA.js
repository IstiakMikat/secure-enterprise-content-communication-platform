const { fingerprint } = require("../hashing/academicHasher");

const smallPrimes = [
  101n, 103n, 107n, 109n, 113n, 127n, 131n, 137n, 139n, 149n, 151n, 157n,
  163n, 167n, 173n, 179n, 181n, 191n, 193n, 197n, 199n, 211n, 223n, 227n,
];

const gcd = (a, b) => (b === 0n ? a : gcd(b, a % b));

const modPow = (base, exponent, modulus) => {
  let result = 1n;
  let currentBase = base % modulus;
  let currentExponent = exponent;

  while (currentExponent > 0n) {
    if (currentExponent % 2n === 1n) {
      result = (result * currentBase) % modulus;
    }
    currentExponent /= 2n;
    currentBase = (currentBase * currentBase) % modulus;
  }

  return result;
};

const modInverse = (a, m) => {
  let [oldR, r] = [a, m];
  let [oldS, s] = [1n, 0n];

  while (r !== 0n) {
    const quotient = oldR / r;
    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
  }

  return ((oldS % m) + m) % m;
};

const encodeTextToBigInt = (text) =>
  BigInt(
    `0x${Buffer.from(String(text ?? ""), "utf8").toString("hex") || "00"}`
  );

const decodeBigIntToText = (value) => {
  let hex = value.toString(16);
  if (hex.length % 2) {
    hex = `0${hex}`;
  }
  return Buffer.from(hex, "hex").toString("utf8").replace(/\0+$/g, "");
};

const generateKeyPair = () => {
  const p = smallPrimes[Math.floor(Math.random() * smallPrimes.length)];
  let q = smallPrimes[Math.floor(Math.random() * smallPrimes.length)];

  while (q === p) {
    q = smallPrimes[Math.floor(Math.random() * smallPrimes.length)];
  }

  const n = p * q;
  const phi = (p - 1n) * (q - 1n);
  let e = 65537n;

  if (gcd(e, phi) !== 1n) {
    e = 17n;
  }

  const d = modInverse(e, phi);

  return {
    publicKey: { e: e.toString(), n: n.toString() },
    privateKey: { d: d.toString(), n: n.toString() },
    fingerprint: fingerprint(`${e}:${d}:${n}`),
  };
};

const encrypt = (plainText, publicKey) => {
  const message = encodeTextToBigInt(plainText);
  const n = BigInt(publicKey.n);
  const e = BigInt(publicKey.e);
  const encrypted = modPow(message % n, e, n);
  return encrypted.toString();
};

const decrypt = (cipherText, privateKey) => {
  const encrypted = BigInt(cipherText);
  const n = BigInt(privateKey.n);
  const d = BigInt(privateKey.d);
  return decodeBigIntToText(modPow(encrypted, d, n));
};

module.exports = {
  generateKeyPair,
  encrypt,
  decrypt,
};

