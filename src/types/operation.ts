export type BaseType = 2 | 8 | 10 | 16;

export interface OperationStep {
  index: number;
  digitA: string;
  digitB: string;
  carryIn: number;
  sum: number;
  resultDigit: string;
  carryOut: number;
}
