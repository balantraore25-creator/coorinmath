// src/features/Arithmetics/Numeration/components/ResultInput.tsx
"use client";

import { HStack, Input } from "@chakra-ui/react";
import type { FC, ChangeEvent } from "react";

interface ResultInputProps {
  expected: string[];                 // target digits
  proposed: string[];                 // learner input digits
  onChange: (val: string[]) => void;  // update handler
  validDigits: string[];              // allowed digits for the target base
}

export const ResultInput: FC<ResultInputProps> = ({
  expected,
  proposed,
  onChange,
  validDigits,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const char = e.target.value.toUpperCase();
    if (char === "" || validDigits.includes(char)) {
      const updated = [...proposed];
      updated[index] = char;
      onChange(updated);
    }
  };

  return (
    <HStack gap={2}>
      {expected.map((target, i) => {
        const val = proposed[i] ?? "";
        const isCorrect = val !== "" && val === target;
        const isWrong = val !== "" && val !== target;

        return (
          <Input
            key={i}
            value={val}
            onChange={(e) => handleChange(e, i)}
            maxLength={1}
            textAlign="center"
            width="40px"
            borderColor={isCorrect ? "green.500" : isWrong ? "red.500" : "gray.300"}
            bg={isCorrect ? "green.50" : isWrong ? "red.50" : "white"}
          />
        );
      })}
    </HStack>
  );
};
