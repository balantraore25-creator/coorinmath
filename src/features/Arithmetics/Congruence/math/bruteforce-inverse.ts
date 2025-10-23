// math/bruteforce-inverse.ts
import { mod } from "./number";

export const bruteForceInverse = (a: number, n: number): { inverse: number | null; tries: number[] } => {
  const tries: number[] = [];
  for (let x = 0; x < n; x++) {
    tries.push(x);
    if (mod(a * x, n) === 1) return { inverse: x, tries };
  }
  return { inverse: null, tries };
};
