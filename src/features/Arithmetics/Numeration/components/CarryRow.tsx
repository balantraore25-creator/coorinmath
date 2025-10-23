"use client";

import {
  Box,
  HStack,
  Text,
  Tooltip,
  Portal,
} from "@chakra-ui/react";

export type CarryRowProps = {
  label: string;
  carries: number[];
  highlightIndex?: number;
};

export const CarryRow: React.FC<CarryRowProps> = ({
  label,
  carries,
  highlightIndex,
}) => {
  const reversedCarries = [...carries].reverse();

  return (
    <Box>
      <Text fontWeight="bold" mb={2}>{label}</Text>

      <HStack gap={2} flexDirection="row-reverse">
        {reversedCarries.map((carry, index) => {
          const logicalIndex = carries.length - 1 - index;
          const isHighlighted = logicalIndex === highlightIndex;
          const isNonZero = carry !== 0;

          return (
            <Tooltip.Root key={logicalIndex}>
              <Tooltip.Trigger>
                <Box
                  px={2}
                  py={1}
                  borderRadius="md"
                  bg={isHighlighted ? "purple.500" : "gray.50"}
                  color={isHighlighted ? "white" : "black"}
                  border="1px solid"
                  borderColor={isNonZero ? "purple.300" : "gray.200"}
                  fontWeight="medium"
                  fontSize="md"
                  minW="32px"
                  textAlign="center"
                  transition="all 0.3s ease"
                >
                  {carry}
                </Box>
              </Tooltip.Trigger>

              <Portal>
                <Tooltip.Positioner>
                  <Tooltip.Content>
                    Retenue à la colonne {logicalIndex} : {carry}
                    <Tooltip.Arrow />
                  </Tooltip.Content>
                </Tooltip.Positioner>
              </Portal>
            </Tooltip.Root>
          );
        })}
      </HStack>
    </Box>
  );
};
