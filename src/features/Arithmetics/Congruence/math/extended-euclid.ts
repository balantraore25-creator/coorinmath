// src/features/Arithmetics/Congruence/math/extended-euclid.ts

export type EuclidRow = {
  q: number;
  r0: number;
  r1: number;
  rNext: number;
  s0: number;
  s1: number;
  sNext: number;
  t0: number;
  t1: number;
  tNext: number;
};

export type EuclidResult = {
  steps: EuclidRow[];
  gcd: number;
  s: number;
  t: number;
  inverse: number | null;
};

// ✅ Définition locale de mod
const mod = (a: number, n: number) => {
  const r = a % n;
  return r < 0 ? r + n : r;
};

export const extendedEuclid = (a: number, n: number): EuclidResult => {
  let r0 = n, r1 = a;
  let s0 = 1, s1 = 0;
  let t0 = 0, t1 = 1;
  const steps: EuclidRow[] = [];

  while (r1 !== 0) {
    const q = Math.trunc(r0 / r1);
    const rNext = r0 - q * r1;
    const sNext = s0 - q * s1;
    const tNext = t0 - q * t1;

    steps.push({ q, r0, r1, rNext, s0, s1, sNext, t0, t1, tNext });

    r0 = r1; r1 = rNext;
    s0 = s1; s1 = sNext;
    t0 = t1; t1 = tNext;
  }

  const d = r0;
  const inv = d === 1 ? mod(t0, n) : null;
  return { steps, gcd: d, s: s0, t: t0, inverse: inv };
};
