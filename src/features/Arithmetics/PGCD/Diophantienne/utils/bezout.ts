// src/features/Arithmetics/PGCD/Diophantienne/utils/bezout.ts

export interface EuclideStep {
  dividend: number;   // dividende courant
  divisor: number;    // diviseur courant
  quotient: number;   // quotient de la division
  remainder: number;  // reste
}

export function computeEuclideanTrail(a: number, b: number): EuclideStep[] {
  const steps: EuclideStep[] = [];
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    const q = Math.floor(x / y);
    const r = x % y;
    steps.push({ dividend: x, divisor: y, quotient: q, remainder: r });
    x = y;
    y = r;
  }
  return steps;
}

export interface BezoutStep {
  a: number;       // valeur courante de a
  b: number;       // valeur courante de b
  u: number;       // coefficient pour a
  v: number;       // coefficient pour b
  division?: string; // ex: "7 = 5×1 + 2"
  matrix?: string;   // ex: "[[0,1],[1,-1]]"
  product?: string;  // produit cumulatif des matrices
  remontee?: string; // coefficients intermédiaires
}

export interface BezoutResult {
  u: number;          // coefficient final pour a
  v: number;          // coefficient final pour b
  d: number;          // pgcd(a,b)
  steps: BezoutStep[]; // trace complète
}

/**
 * Algorithme d’Euclide étendu enrichi.
 * Renvoie (u,v) tels que a*u + b*v = gcd(a,b),
 * avec trace complète (division, matrices, produit cumulatif, remontée).
 */
export function bezoutCoefficients(a: number, b: number): BezoutResult {
  let old_r = Math.abs(a), r = Math.abs(b);
  let old_s = 1, s = 0;
  let old_t = 0, t = 1;

  const steps: BezoutStep[] = [];
  const matrices: string[] = [];

  while (r !== 0) {
    const q = Math.floor(old_r / r);
    const remainder = old_r - q * r;

    // Matrice élémentaire
    const matrix = `[[0,1],[1,-${q}]]`;
    matrices.push(matrix);
    const product = matrices.join(" · ");

    steps.push({
      a: old_r,
      b: r,
      u: old_s,
      v: old_t,
      division: `${old_r} = ${r}×${q} + ${remainder}`,
      matrix,
      product,
      remontee: `x=${old_s}, y=${old_t}`,
    });

    // Mise à jour
    const tmp_r = remainder;
    old_r = r;
    r = tmp_r;

    const tmp_s = old_s - q * s;
    old_s = s;
    s = tmp_s;

    const tmp_t = old_t - q * t;
    old_t = t;
    t = tmp_t;
  }

  // pgcd
  const d = old_r;

  // Ajustement des signes
  const u = a >= 0 ? old_s : -old_s;
  const v = b >= 0 ? old_t : -old_t;

  // Étape finale avec remontée complète
  steps.push({
    a: old_r,
    b: r,
    u,
    v,
    division: `${old_r} = ${r}×0 + 0`,
    matrix: "—",
    product: matrices.join(" · "),
    remontee: `x₀=${u}, y₀=${v}`,
  });

  return { u, v, d, steps };
}
