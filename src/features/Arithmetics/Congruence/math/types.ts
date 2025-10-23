// src/features/Arithmetics/Congruence/math/types.ts

export type MethodKey = "euclid" | "bruteforce";
export type SolveStatus = "ok" | "no-solution" | "invalid-input";

export type EuclidRow = {
  q: number;
  r0: number; r1: number; rNext: number;
  s0: number; s1: number; sNext: number;
  t0: number; t1: number; tNext: number;
};

export type EuclidResult = {
  gcd: number;
  s: number;
  t: number;
  steps: EuclidRow[];
  inverse: number | null;
};

/** Étape brute force : essai d'une valeur x */
export type BruteForceStep = {
  x: number;
  axModN: number;
  match: boolean;
};

export type SolveArgs = {
  a: number;
  b: number;
  n: number;
  method: MethodKey;
};

export type SolveResult = {
  status: SolveStatus;
  gcd: number;
  solution: number | null;
  euclid?: EuclidResult;
  bruteForceSteps?: BruteForceStep[];
};


export type Attempt = {
  a: number;
  b: number;
  n: number;
  method: MethodKey;
  status: SolveStatus;
  solution: number | null;
  gcd: number;
  steps?: EuclidRow[] | BruteForceStep[];
  at: string;
  result: number; // ou le type exact attendu par AttemptHistory
};

