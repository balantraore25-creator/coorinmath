"use client";

import {
  Box,
  HStack,
  Text,
} from "@chakra-ui/react";

export type DigitRowProps = {
  label: string;
  digits: string[];
  highlightIndex?: number;
  validation?: boolean[];
};

export const DigitRow: React.FC<DigitRowProps> = ({
  label,
  digits,
  highlightIndex,
  validation = [],
}) => {
  const reversedDigits = [...digits].reverse();
  const reversedValidation = [...validation].reverse();

  return (
    <Box>
      <Text fontWeight="bold" mb={2}>{label}</Text>

      <HStack gap={2} flexDirection="row-reverse">
        {reversedDigits.map((digit, index) => {
          const logicalIndex = digits.length - 1 - index;
          const isHighlighted = logicalIndex === highlightIndex;
          const isValid = reversedValidation[index] ?? true;

          const isFinalCarry =
            label === "Résultat" &&
            logicalIndex === digits.length &&
            digits.length > validation.length;

          return (
            <Box
              key={logicalIndex}
              px={2}
              py={1}
              borderRadius="md"
              bg={
                isFinalCarry
                  ? "green.500"
                  : isHighlighted
                  ? "blue.500"
                  : "gray.100"
              }
              color={
                isFinalCarry || isHighlighted ? "white" : "black"
              }
              border={isValid ? "1px solid" : "2px dashed"}
              borderColor={isValid ? "gray.300" : "red.400"}
              fontWeight="medium"
              fontSize="lg"
              minW="32px"
              textAlign="center"
              transition="all 0.3s ease"
            >
              {digit}
            </Box>
          );
        })}
      </HStack>
    </Box>
  );
};
