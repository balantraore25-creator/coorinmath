import type { PartialEquation } from "../../../../../types/PartialEquation";
import type { EuclideStep } from "../../../../../types/EuclideStep";

export function buildPartialBacktrack(steps: EuclideStep[]): PartialEquation[] {
  const result: PartialEquation[] = [];

  // Initialisation des coefficients
  let xPrev = 1, yPrev = 0;
  let xCurr = 0, yCurr = 1;

  for (let i = 0; i < steps.length; i++) {
    const { quotient, divisor, remainder } = steps[i];

    const xNext = xPrev - quotient * xCurr;
    const yNext = yPrev - quotient * yCurr;

    const resultValue = steps[i + 1]?.divisor ?? steps.at(-1)?.divisor ?? 1;

    result.push({
      a: divisor,
      b: remainder,
      xCoeff: xCurr,
      yCoeff: yNext,
      result: resultValue,
    });

    xPrev = xCurr;
    yPrev = yCurr;
    xCurr = xNext;
    yCurr = yNext;
  }

  return result;
}
