import { computeStep } from "./computeStep";
import type { BaseType, OperationType, OperationStep } from "../types/operation";

export function computeSteps(
  base: BaseType,
  digitsA: string[] = [],
  digitsB: string[] = [],
  operation: OperationType
): OperationStep[] {
  const maxLength = Math.max(digitsA.length, digitsB.length);
  const steps: OperationStep[] = [];
  let carryIn = 0;

  for (let i = 0; i < maxLength; i++) {
    const indexA = digitsA.length - 1 - i;
    const indexB = digitsB.length - 1 - i;

    const digitA = digitsA[indexA] ?? "0";
    const digitB = digitsB[indexB] ?? "0";

    const step = computeStep(i, base, digitA, digitB, carryIn, operation);
    const expectedDigit = (step.sum % base).toString(base).toUpperCase();
    step.isValid = step.resultDigit === expectedDigit;

    steps.push(step); // ✅ Ajout logique : unités à droite
    carryIn = step.carryOut;
  }

  if (carryIn > 0 && operation === "addition") {
    steps.push({
      index: maxLength,
      digitA: "0",
      digitB: "0",
      carryIn,
      sum: carryIn,
      resultDigit: carryIn.toString(base).toUpperCase(),
      carryOut: 0,
      explanation: `Retenue finale propagée : ${carryIn}`,
      isValid: true,
      borrow: 0,
    });
  }

  return steps;
}
