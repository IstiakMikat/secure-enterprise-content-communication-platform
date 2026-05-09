const { fingerprint } = require("../hashing/academicHasher");
const { academicSHA256 } = require("../hashing/academicHasher");

const curve = {
  p: 97n,
  a: 2n,
  b: 3n,
  g: { x: 3n, y: 6n },
};

const mod = (value, divisor) => ((value % divisor) + divisor) % divisor;

const modInverse = (a, p) => {
  let [oldR, r] = [mod(a, p), p];
  let [oldS, s] = [1n, 0n];

  while (r !== 0n) {
    const quotient = oldR / r;
    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
  }

  return mod(oldS, p);
};

const pointAdd = (p1, p2) => {
  if (!p1) return p2;
  if (!p2) return p1;

  if (p1.x === p2.x && mod(p1.y + p2.y, curve.p) === 0n) {
    return null;
  }

  const slope =
    p1.x === p2.x && p1.y === p2.y
      ? mod(
          (3n * p1.x * p1.x + curve.a) * modInverse(2n * p1.y, curve.p),
          curve.p
        )
      : mod(
          (p2.y - p1.y) * modInverse(p2.x - p1.x, curve.p),
          curve.p
        );

  const x = mod(slope * slope - p1.x - p2.x, curve.p);
  const y = mod(slope * (p1.x - x) - p1.y, curve.p);
  return { x, y };
};

const scalarMultiply = (multiplier, point) => {
  let result = null;
  let addend = point;
  let k = BigInt(multiplier);

  while (k > 0n) {
    if (k & 1n) {
      result = pointAdd(result, addend);
    }
    addend = pointAdd(addend, addend);
    k >>= 1n;
  }

  return result;
};

const textToScalar = (text) => {
  let accumulator = 0n;
  for (const char of String(text ?? "")) {
    accumulator += BigInt(char.charCodeAt(0));
  }
  return mod(accumulator || 1n, curve.p);
};

const scalarToText = (scalar) => `ECC:${scalar.toString()}`;

const generateKeyPair = () => {
  let privateScalar = 2n;
  let publicPoint = null;

  while (!publicPoint) {
    privateScalar = BigInt(Math.floor(Math.random() * 40) + 2);
    publicPoint = scalarMultiply(privateScalar, curve.g);
  }

  return {
    publicKey: {
      curve: "secp256k1-demo",
      x: publicPoint.x.toString(),
      y: publicPoint.y.toString(),
    },
    privateKey: {
      scalar: privateScalar.toString(),
    },
    fingerprint: fingerprint(
      `${privateScalar}:${publicPoint.x}:${publicPoint.y}:ecc`
    ),
  };
};

const encrypt = (plainText, publicKey) => {
  const scalar = textToScalar(plainText);
  const publicPoint = {
    x: BigInt(publicKey.x),
    y: BigInt(publicKey.y),
  };
  let ephemeral = 2n;
  let shared = null;
  let hint = null;

  while (!shared || !hint) {
    ephemeral = BigInt(Math.floor(Math.random() * 30) + 2);
    shared = scalarMultiply(ephemeral, publicPoint);
    hint = scalarMultiply(ephemeral, curve.g);
  }

  const payload = mod(scalar + shared.x, curve.p);

  return JSON.stringify({
    hx: hint.x.toString(),
    hy: hint.y.toString(),
    payload: payload.toString(),
  });
};

const decrypt = (cipherText, privateKey) => {
  const { hx, hy, payload } = JSON.parse(cipherText);
  const shared = scalarMultiply(
    BigInt(privateKey.scalar),
    { x: BigInt(hx), y: BigInt(hy) }
  );
  const scalar = mod(BigInt(payload) - (shared?.x || 1n), curve.p);
  return scalarToText(scalar);
};

const messageScalar = (message) =>
  mod(BigInt(`0x${academicSHA256(String(message ?? ""))}`), curve.p);

const pointEqual = (left, right) => {
  if (!left && !right) return true;
  if (!left || !right) return false;
  return left.x === right.x && left.y === right.y;
};

const sign = (message, privateKey) => {
  const h = messageScalar(message);
  const scalar = h + BigInt(privateKey.scalar);
  return scalar.toString();
};

const verify = (message, signature, publicKey) => {
  const h = messageScalar(message);
  const signaturePoint = scalarMultiply(BigInt(signature), curve.g);
  const hashPoint = scalarMultiply(h, curve.g);
  const publicPoint = { x: BigInt(publicKey.x), y: BigInt(publicKey.y) };
  const expected = pointAdd(hashPoint, publicPoint);
  return pointEqual(signaturePoint, expected);
};

module.exports = {
  generateKeyPair,
  encrypt,
  decrypt,
  sign,
  verify,
};
