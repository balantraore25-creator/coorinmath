// 🔢 Bases supportées
export const baseOptions = [2, 8, 10, 16] as const;
export type BaseType = typeof baseOptions[number];

// ➕ Types d'opérations disponibles
export const operationOptions = ["addition", "soustraction", "multiplication"] as const;
export type OperationType = typeof operationOptions[number];



export interface OperationStep {
  index: number;
  digitA: string;
  digitB: string;
  carryIn: number;
  sum: number;
  resultDigit: string;
  carryOut: number;
  explanation: string; // ✅ Ajout nécessaire
   borrow?: number; // ✅ Ajouté pour la soustraction
   isValid?: boolean; // ✅ Ajouté ici
}

export type Step = {
  a?: string;            // chiffre de A à cette position
  b?: string;            // chiffre de B à cette position
  carryIn?: number;      // retenue entrante
  sum: number;           // somme calculée
  resultDigit: string;   // chiffre écrit dans le résultat
  carryOut?: number;     // retenue sortante
  explanation: string;   // explication textuelle
};



