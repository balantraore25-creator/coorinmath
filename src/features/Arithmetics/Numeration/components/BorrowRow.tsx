"use client";

import {
  Box,
  HStack,
  Text,
  Tooltip,
  Portal,
} from "@chakra-ui/react";

export type BorrowRowProps = {
  label: string;
  borrows: number[];
  highlightIndex?: number;
};

export const BorrowRow: React.FC<BorrowRowProps> = ({
  label,
  borrows,
  highlightIndex,
}) => {
  const reversedBorrows = [...borrows].reverse();

  return (
    <Box>
      <Text fontWeight="bold" mb={2}>{label}</Text>

      <HStack gap={2} flexDirection="row-reverse">
        {reversedBorrows.map((borrow, index) => {
          const logicalIndex = borrows.length - 1 - index;
          const isHighlighted = logicalIndex === highlightIndex;
          const isNonZero = borrow !== 0;

          return (
            <Tooltip.Root key={logicalIndex}>
              <Tooltip.Trigger>
                <Box
                  px={2}
                  py={1}
                  borderRadius="md"
                  bg={isHighlighted ? "red.500" : "gray.50"}
                  color={isHighlighted ? "white" : "black"}
                  border="1px solid"
                  borderColor={isNonZero ? "red.300" : "gray.200"}
                  fontWeight="medium"
                  fontSize="md"
                  minW="32px"
                  textAlign="center"
                  transition="all 0.3s ease"
                >
                  {borrow}
                </Box>
              </Tooltip.Trigger>

              <Portal>
                <Tooltip.Positioner>
                  <Tooltip.Content>
                    Emprunt à la position {logicalIndex} : {borrow}
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
