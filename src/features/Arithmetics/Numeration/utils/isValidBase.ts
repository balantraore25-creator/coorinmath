import { baseOptions } from "./../types/operation";
import type { BaseType } from "./../types/operation";

/**
 * Vérifie si une valeur est un BaseType valide.
 * @param val - valeur à tester
 * @returns true si val est un BaseType
 */
export function isValidBase(val: number): val is BaseType {
  return baseOptions.includes(val as BaseType);
}
