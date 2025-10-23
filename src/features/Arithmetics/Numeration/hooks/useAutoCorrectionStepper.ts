// src/features/Arithmetics/Numeration/hooks/useAutoCorrectionStepper.ts

import { useState } from 'react';
import type { OperationStep } from '../types/operation';

export function useAutoCorrectionStepper(steps: OperationStep[]) {
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(steps.length).fill(''));
  const [attempts, setAttempts] = useState<number[]>(Array(steps.length).fill(0));

  const setAnswer = (index: number, value: string) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = value.toUpperCase();
    setUserAnswers(updatedAnswers);

    const isCorrect = value.toUpperCase() === steps[index].resultDigit;
    if (!isCorrect) {
      const updatedAttempts = [...attempts];
      updatedAttempts[index] += 1;
      setAttempts(updatedAttempts);
    }
  };

  const validateStep = (index: number): boolean =>
    userAnswers[index]?.toUpperCase() === steps[index].resultDigit;

  const showCorrection = (index: number): boolean =>
    attempts[index] >= 3 && !validateStep(index);

  const getDisplayDigit = (index: number): string =>
    validateStep(index)
      ? userAnswers[index]
      : showCorrection(index)
        ? steps[index].resultDigit
        : '•';

  const getValidationState = (index: number): 'valid' | 'invalid' | 'corrected' | null => {
    if (validateStep(index)) return 'valid';
    if (showCorrection(index)) return 'corrected';
    if (userAnswers[index]) return 'invalid';
    return null;
  };

  return {
    userAnswers,
    attempts,
    setAnswer,
    validateStep,
    showCorrection,
    getDisplayDigit,
    getValidationState,
  };
}
