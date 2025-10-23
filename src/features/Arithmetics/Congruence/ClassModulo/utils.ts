// utils.ts

/**
 * Reste positif de a mod n
 */
export function mod(a: number, n: number): number {
  const r = a % n;
  return r < 0 ? r + Math.abs(n) : r;
}

/**
 * Génère un tableau de valeurs aléatoires à classer
 * @param count nombre de valeurs à générer
 * @param min valeur minimale possible
 * @param max valeur maximale possible
 */
export function generateRandomValues(
  count = 5,
  min = -50,
  max = 50
) {
  return Array.from({ length: count }, () => ({
    value: Math.floor(Math.random() * (max - min + 1)) + min,
    assignedClass: '',
  }));
}
