import type { BaseType, OperationType, OperationStep } from "../types/operation";

export function computeStep(
  index: number,
  base: BaseType,
  digitA: string,
  digitB: string,
  carryIn: number,
  operation: OperationType
): OperationStep {
  const a = parseInt(digitA, base);
  const b = parseInt(digitB, base);

  let sum = 0;
  let carryOut = 0;
  let resultDigit = "";
  let borrow = 0;
  let explanation = "";

  if (operation === "addition") {
    sum = a + b + carryIn;
    carryOut = Math.floor(sum / base);
    resultDigit = (sum % base).toString(base).toUpperCase();
    explanation = `${digitA} + ${digitB}${carryIn ? ` + retenue ${carryIn}` : ""} = ${sum} → on écrit ${resultDigit}, on retient ${carryOut}`;
  }

  else if (operation === "soustraction") {
    let adjustedA = a - carryIn;
    if (adjustedA < b) {
      adjustedA += base;
      borrow = 1;
    }
    sum = adjustedA - b;
    resultDigit = sum.toString(base).toUpperCase();
    explanation = `${digitA} - ${digitB}${carryIn ? ` - retenue ${carryIn}` : ""}${borrow ? ` + emprunt ${base}` : ""} = ${sum} → on écrit ${resultDigit}`;
  }

  else if (operation === "multiplication") {
    sum = a * b + carryIn;
    carryOut = Math.floor(sum / base);
    resultDigit = (sum % base).toString(base).toUpperCase();
    explanation = `${digitA} × ${digitB}${carryIn ? ` + retenue ${carryIn}` : ""} = ${sum} → on écrit ${resultDigit}, on retient ${carryOut}`;
  }

  return {
    index,
    digitA,
    digitB,
    carryIn,
    sum,
    resultDigit,
    carryOut,
    borrow,
    explanation,
  };
}
