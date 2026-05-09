const ecc = require('./src/crypto/ecc/academicECC');
// I need to copy scalarMultiply and pointAdd to see their outputs
const curve = { p: 97n, a: 2n, b: 3n, g: { x: 3n, y: 6n } };
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
  if (p1.x === p2.x && mod(p1.y + p2.y, curve.p) === 0n) return null;
  const slope = p1.x === p2.x && p1.y === p2.y
    ? mod((3n * p1.x * p1.x + curve.a) * modInverse(2n * p1.y, curve.p), curve.p)
    : mod((p2.y - p1.y) * modInverse(p2.x - p1.x, curve.p), curve.p);
  const x = mod(slope * slope - p1.x - p2.x, curve.p);
  const y = mod(slope * (p1.x - x) - p1.y, curve.p);
  return { x, y };
};
const scalarMultiply = (multiplier, point) => {
  let result = null; let addend = point; let k = BigInt(multiplier);
  while (k > 0n) {
    if (k & 1n) result = pointAdd(result, addend);
    addend = pointAdd(addend, addend);
    k >>= 1n;
  }
  return result;
};

const h = 46n;
const d = 14n;
const sig = 60n; // 46 + 14
const sigPoint = scalarMultiply(sig, curve.g);
const hPoint = scalarMultiply(h, curve.g);
const pubPoint = scalarMultiply(d, curve.g);
const expected = pointAdd(hPoint, pubPoint);

console.log("sigPoint:", sigPoint);
console.log("expected:", expected);
