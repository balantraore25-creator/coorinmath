export function mod(a: number, n: number) {
  const r = a % n;
  return r < 0 ? r + Math.abs(n) : r;
}

export function egcd(a: number, b: number): [number, number, number] {
  if (b === 0) return [a, 1, 0];
  const [g, x1, y1] = egcd(b, a % b);
  return [g, y1, x1 - Math.floor(a / b) * y1];
}

export function modInverse(a: number, n: number) {
  const [g, x] = egcd(a, n);
  if (g !== 1) return undefined;
  return mod(x, n);
}
