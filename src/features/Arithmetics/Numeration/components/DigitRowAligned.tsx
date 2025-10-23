import { HStack, VStack, Text, Box } from "@chakra-ui/react";
import type { FC } from "react";

interface DigitRowAlignedProps {
  label: string;
  values: (string | number)[];
  validation?: boolean[];
  colorScheme?: string;
  showPositions?: boolean;
  align?: "left" | "right";
}

const positionLabels = ["Unité", "Dizaine", "Centaine", "Millier", "Dizaine de mille", "Centaine de mille"];

export const DigitRowAligned: FC<DigitRowAlignedProps> = ({
  label,
  values,
  validation,
  colorScheme = "gray",
  showPositions = false,
  align = "right",
}) => {
  const ordered = align === "right" ? [...values].reverse().map(String) : [...values].map(String);

  return (
    <VStack align="start" gap={1}>
      <Text fontWeight="bold">{label}</Text>
      <HStack gap={2} justify="end">
        {ordered.map((val, i) => {
          const logicalIndex = align === "right" ? values.length - 1 - i : i;
          const isValid = validation?.[logicalIndex];
          const borderColor = isValid === true ? "green.400" : isValid === false ? "red.400" : `${colorScheme}.300`;
          const bgColor = isValid === true ? "green.50" : isValid === false ? "red.50" : "white";

          return (
            <VStack key={i} gap={0}>
              <Box
                px={2}
                py={1}
                borderWidth={1}
                borderRadius="md"
                borderColor={borderColor}
                bg={bgColor}
                minW="40px"
                textAlign="center"
              >
                <Text>{val}</Text>
              </Box>
              {showPositions && (
                <Text fontSize="xs" color="gray.500">
                  {positionLabels[i] ?? `Col ${i + 1}`}
                </Text>
              )}
            </VStack>
          );
        })}
      </HStack>
    </VStack>
  );
};
