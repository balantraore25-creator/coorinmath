import type { Base } from "./baseConversion";
import {
  parseInBase,
  toBaseFromDecimal,
  fractionalToBaseFromDecimal,
  binToOct,
  binToHex,
  octToBin,
  hexToBin,
} from "./baseConversion";

export type ConversionMethod =
  | "polynomial"
  | "division"
  | "multiplication"
  | "grouping";

export interface ConversionStep {
  label: string;
  detail: string;
  value?: string | number;
}

export interface ConversionResult {
  output: string;
  steps: ConversionStep[];
}

export function convertWithSteps(
  input: string,
  baseFrom: Base,
  baseTo: Base,
  method: ConversionMethod,
  fracLimit = 12
): ConversionResult {
  const steps: ConversionStep[] = [];
  const s = input.trim().toUpperCase();

  steps.push({
    label: "Normalisation",
    detail: `On met en majuscules et on supprime les espaces : "${s}"`,
  });

  const [intPart, fracPartRaw] = s.split(".");
  const hasFrac = typeof fracPartRaw === "string";

  // --- MÉTHODE POLYNOMIALE ---
  if (method === "polynomial") {
    let decimalInt = parseInBase(intPart, baseFrom);
    for (let i = 0; i < intPart.length; i++) {
      const ch = intPart[i];
      const digit = "0123456789ABCDEF".indexOf(ch);
      const power = intPart.length - 1 - i;
      steps.push({
        label: `Chiffre ${ch}`,
        detail: `${ch} × (${baseFrom}^${power}) ajouté au total`,
        value: digit * Math.pow(baseFrom, power),
      });
    }
    steps.push({
      label: "Partie entière en base 10",
      detail: `Valeur entière convertie : ${decimalInt}`,
      value: decimalInt,
    });

    let decimalFrac = 0;
    if (hasFrac) {
      for (let i = 0; i < fracPartRaw.length; i++) {
        const ch = fracPartRaw[i];
        const digit = "0123456789ABCDEF".indexOf(ch);
        const pos = i + 1;
        decimalFrac += digit / Math.pow(baseFrom, pos);
        steps.push({
          label: `Fraction ${ch}`,
          detail: `${ch} × ${baseFrom}^-${pos} ajouté au total`,
          value: digit / Math.pow(baseFrom, pos),
        });
      }
      steps.push({
        label: "Partie fractionnaire en base 10",
        detail: `Valeur fractionnaire convertie : ${decimalFrac}`,
        value: decimalFrac,
      });
    }

    const decimalValue = decimalInt + decimalFrac;
    steps.push({
      label: "Valeur décimale totale",
      detail: `Nombre en base 10 : ${decimalValue}`,
      value: decimalValue,
    });

    const outInt = toBaseFromDecimal(decimalInt, baseTo);
    const outFrac = hasFrac
      ? fractionalToBaseFromDecimal(decimalFrac, baseTo, fracLimit)
      : "";
    const output = hasFrac ? `${outInt}.${outFrac}` : outInt;

    steps.push({
      label: "Résultat final",
      detail: `Nombre en base ${baseTo} : ${output}`,
      value: output,
    });

    return { output, steps };
  }

  // --- MÉTHODE DIVISION (entiers uniquement) ---
  if (method === "division") {
    const decimalInt = parseInBase(intPart, baseFrom);
    const outInt = toBaseFromDecimal(decimalInt, baseTo);
    steps.push({
      label: "Divisions successives",
      detail: `Partie entière convertie en base ${baseTo} : ${outInt}`,
      value: outInt,
    });
    return { output: outInt, steps };
  }

  // --- MÉTHODE MULTIPLICATION (fractions uniquement) ---
  if (method === "multiplication" && hasFrac) {
    let decimalFrac = 0;
    for (let i = 0; i < fracPartRaw.length; i++) {
      const ch = fracPartRaw[i];
      const digit = "0123456789ABCDEF".indexOf(ch);
      decimalFrac += digit / Math.pow(baseFrom, i + 1);
    }
    const outFrac = fractionalToBaseFromDecimal(decimalFrac, baseTo, fracLimit);
    steps.push({
      label: "Multiplications successives",
      detail: `Fraction convertie en base ${baseTo} : ${outFrac}`,
      value: outFrac,
    });
    return { output: `0.${outFrac}`, steps };
  }

  // --- MÉTHODE GROUPING (binaire ↔ octal/hexadécimal) ---
  if (method === "grouping") {
    let output = "";
    if (baseFrom === 2 && baseTo === 8) output = binToOct(intPart);
    else if (baseFrom === 2 && baseTo === 16) output = binToHex(intPart);
    else if (baseFrom === 8 && baseTo === 2) output = octToBin(intPart);
    else if (baseFrom === 16 && baseTo === 2) output = hexToBin(intPart);
    else {
      return {
        output: "Méthode non applicable",
        steps: [
          {
            label: "Erreur",
            detail:
              "Le regroupement de bits ne fonctionne qu'entre binaire, octal et hexadécimal.",
          },
        ],
      };
    }

    steps.push({
      label: "Regroupement de bits",
      detail: `Conversion directe par regroupement : ${output}`,
      value: output,
    });
    return { output, steps };
  }

  return {
    output: "Méthode non applicable",
    steps: [
      {
        label: "Erreur",
        detail: "La méthode choisie n'est pas adaptée à ce type de conversion.",
      },
    ],
  };
}
