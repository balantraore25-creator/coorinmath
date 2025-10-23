// EquationProps.ts
export interface ClassModuloValue {
  value: number;          // La valeur proposée à classer
  assignedClass: string;  // La classe choisie par l'élève (vide si non encore choisie)
}

export interface ClassModuloProps {
  modulo: number;                               // n du modulo
  values: ClassModuloValue[];                   // Liste des valeurs à classer
  setValues: (vals: ClassModuloValue[]) => void; // Setter pour mettre à jour les affectations
}
