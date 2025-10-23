import { Box, HStack, Text } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { useColorModeValue } from "@/components/ui/color-mode";
import type { FC } from "react";

interface BaseDigitRowProps {
  label: string;
  values: string[] | number[];
  highlightIndex?: number;
  validation?: boolean[];
  colorScheme?: string;
  tooltipPrefix?: string;
  isFinalCarry?: boolean; // ✅ ajouté
}

export const BaseDigitRow: FC<BaseDigitRowProps> = ({
  label,
  values,
  highlightIndex,
  validation,
  colorScheme = "gray",
  tooltipPrefix,
}) => {
  const bgValid = useColorModeValue("green.100", "green.700");
  const bgInvalid = useColorModeValue("red.100", "red.700");
  const bgHighlight = useColorModeValue("yellow.100", "yellow.700");

  return (
    <HStack gap={2} align="center">
      <Text fontWeight="bold" minW="80px">
        {label}
      </Text>
      {values.map((val, i) => {
        const isHighlighted = highlightIndex === i;
        const isValid = validation?.[i];
        const bg =
          isHighlighted
            ? bgHighlight
            : validation
            ? isValid
              ? bgValid
              : bgInvalid
            : undefined;

        return (
          <Tooltip
            key={i}
            content={`${tooltipPrefix ?? label} ${values.length - 1 - i}`}
          >
            <Box
              px={3}
              py={2}
              borderRadius="md"
              bg={bg}
              borderWidth={1}
              borderColor={`${colorScheme}.400`}
              fontWeight="semibold"
              minW="32px"
              textAlign="center"
            >
              {val}
            </Box>
          </Tooltip>
        );
      })}
    </HStack>
  );
};
