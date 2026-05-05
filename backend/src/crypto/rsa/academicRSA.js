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

const generateKeyPair = () => {
  const p = smallPrimes[Math.floor(Math.random() * smallPrimes.length)];
  let q = smallPrimes[Math.floor(Math.random() * smallPrimes.length)];

  while (q === p) {
    q = smallPrimes[Math.floor(Math.random() * smallPrimes.length)];
  }

  const n = p * q;
  const phi = (p - 1n) * (q - 1n);
  const candidateExponents = [65537n, 257n, 17n, 5n, 3n];
  const e = candidateExponents.find((candidate) => gcd(candidate, phi) === 1n);

  if (!e) {
    throw new Error("Unable to generate a valid RSA exponent");
  }

  const d = modInverse(e, phi);

  return {
    publicKey: { e: e.toString(), n: n.toString() },
    privateKey: { d: d.toString(), n: n.toString() },
    fingerprint: fingerprint(`${e}:${d}:${n}`),
  };
};

const encrypt = (plainText, publicKey) => {
  const n = BigInt(publicKey.n);
  const e = BigInt(publicKey.e);
  const bytes = Buffer.from(String(plainText ?? ""), "utf8");

  return Array.from(bytes, (byte) => modPow(BigInt(byte), e, n).toString())
    .join(".");
};

const decrypt = (cipherText, privateKey) => {
  const n = BigInt(privateKey.n);
  const d = BigInt(privateKey.d);
  const segments = String(cipherText || "")
    .split(".")
    .filter(Boolean);

  const bytes = segments.map((segment) =>
    Number(modPow(BigInt(segment), d, n))
  );

  return Buffer.from(bytes).toString("utf8");
};

module.exports = {
  generateKeyPair,
  encrypt,
  decrypt,
};
