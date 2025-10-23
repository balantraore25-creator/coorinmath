import { VStack, Text } from "@chakra-ui/react";
import * as React from "react";

type SolutionPreviewProps = {
  x0: number;
  y0: number;
  equation: { a: number; b: number; c: number };
};

export const SolutionPreview: React.FC<SolutionPreviewProps> = ({ x0, y0, equation }) => {
  const { a, b, c } = equation;
  const valid = a * x0 + b * y0 === c;

  return (
    <VStack>
      <Text>Solution particulière : (x₀, y₀) = ({x0}, {y0})</Text>
      <Text color={valid ? "green.500" : "red.500"}>
        Vérification : {a}×{x0} + {b}×{y0} = {c} → {valid ? "✅" : "❌"}
      </Text>
    </VStack>
  );
};
