import { HStack, Text } from "@chakra-ui/react";
import type { PartialEquation } from "../types/PartialEquation";

export const PartialEquationRenderer = ({
  a,
  b,
  xCoeff,
  yCoeff,
  result,
}: PartialEquation) => (
  <HStack gap={2}>
    <Text>{xCoeff} × {a}</Text>
    <Text>+</Text>
    <Text>{yCoeff} × {b}</Text>
    <Text>=</Text>
    <Text>{result}</Text>
  </HStack>
);
