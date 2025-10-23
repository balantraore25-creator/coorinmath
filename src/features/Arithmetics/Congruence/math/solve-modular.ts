// src/features/Arithmetics/Congruence/math/solve-modular.ts
import { gcd, mod, normalizeMod } from "./number";
import { extendedEuclid } from "./extended-euclid";
// ✅ Import nettoyé : plus de MethodKey ici
import type { EuclidResult, SolveArgs, SolveResult } from "./types";

export const solveModular = ({ a, b, n, method }: SolveArgs): SolveResult => {
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(n) || n <= 1) {
    return { status: "invalid-input", gcd: NaN, solution: null };
  }

  const g = gcd(a, n);
  const B = normalizeMod(b, n);

  if (B % g !== 0) {
    return { status: "no-solution", gcd: g, solution: null };
  }

  const a1 = Math.trunc(a / g);
  const n1 = Math.trunc(n / g);
  const b1 = Math.trunc(B / g);

  if (method === "bruteforce") {
    const steps = [];
    let found: number | null = null;

    for (let x = 0; x < n1; x++) {
      const ax = mod(a1 * x, n1);
      const match = ax === b1;
      steps.push({ x, axModN: ax, match });
      if (match && found === null) {
        found = x;
      }
    }

    return {
      status: found !== null ? "ok" : "no-solution",
      gcd: g,
      solution: found,
      bruteForceSteps: steps,
    };
  }

  const euclid: EuclidResult = extendedEuclid(a1, n1);
  if (euclid.gcd !== 1 || euclid.inverse === null) {
    return { status: "no-solution", gcd: g, solution: null };
  }

  const x0 = mod(euclid.inverse * b1, n1);
  return { status: "ok", gcd: g, solution: x0, euclid };
};
