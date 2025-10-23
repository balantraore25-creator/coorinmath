"use client";

import { HStack, Input, Box } from "@chakra-ui/react";
import type { FC, ChangeEvent } from "react";

interface ResultInputProps {
  expected: string[];                  // Résultat attendu
  proposed: string[];                  // Saisie élève
  onChange: (val: string[]) => void;   // Callback
  base: 2 | 8 | 10 | 16;               // Base numérique
  reverse?: boolean;                   // Affichage droite → gauche
}

export const ResultInput: FC<ResultInputProps> = ({
  expected,
  proposed,
  onChange,
  base,
  reverse = false,
}) => {
  const validDigits = [...Array(base).keys()].map((n) =>
    n.toString(base).toUpperCase()
  );

  // Affichage visuel : inversé si reverse
  const displayedIndices = reverse
    ? [...expected.keys()].reverse()
    : [...expected.keys()];

  const handleChange = (e: ChangeEvent<HTMLInputElement>, logicalIndex: number) => {
    const char = e.target.value.toUpperCase();
    if (char === "" || validDigits.includes(char)) {
      const updated = [...proposed];
      updated[logicalIndex] = char;
      onChange(updated);
    }
  };

  return (
    <HStack gap={2} justify="end">
      {displayedIndices.map((logicalIndex) => {
        const val = proposed[logicalIndex] ?? "";
        const expectedVal = expected[logicalIndex];
        const isCorrect = val !== "" && val === expectedVal;
        const isWrong = val !== "" && val !== expectedVal;

        return (
          <Box key={logicalIndex}>
            <Input
              value={val}
              onChange={(e) => handleChange(e, logicalIndex)}
              maxLength={1}
              textAlign="center"
              width="40px"
              borderColor={
                isCorrect ? "green.400" : isWrong ? "red.400" : "gray.300"
              }
              bg={isCorrect ? "green.50" : isWrong ? "red.50" : "white"}
            />
          </Box>
        );
      })}
    </HStack>
  );
};
