// math/number.ts
export const mod = (a: number, n: number) => {
  const r = a % n;
  return r < 0 ? r + n : r;
};

export const normalizeMod = (x: number, n: number) => mod(x, n);

export const gcd = (a: number, b: number) => {
  let x = Math.abs(a), y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
};
