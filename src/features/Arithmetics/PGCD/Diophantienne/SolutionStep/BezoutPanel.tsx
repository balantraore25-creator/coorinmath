// src/features/Arithmetics/PGCD/Diophantienne/SolutionStep/BezoutPanel.tsx
import { VStack, Text, Code } from "@chakra-ui/react";
import { bezoutCoefficients } from "../utils/bezout";

interface BezoutPanelProps {
  a1: number; // coefficients simplifiés
  b1: number;
}

export const BezoutPanel = ({ a1, b1 }: BezoutPanelProps) => {
  const { u, v, d } = bezoutCoefficients(a1, b1);

  return (
    <VStack align="stretch" gap={3}>
      <Text fontWeight="bold">Théorème de Bézout (forme normalisée)</Text>
      <Text>
        Comme pgcd({a1}, {b1}) = <Code>{d}</Code> et {a1}, {b1} sont premiers entre eux, on a d = 1 et il existe
        des entiers u, v tels que <Code>{a1}·u + {b1}·v = 1</Code>.
      </Text>
      <Text>
        Un couple possible est <Code>(u, v) = ({u}, {v})</Code>, vérifiant
        <Code> {a1}·{u} + {b1}·{v} = 1</Code>.
      </Text>
    </VStack>
  );
};
