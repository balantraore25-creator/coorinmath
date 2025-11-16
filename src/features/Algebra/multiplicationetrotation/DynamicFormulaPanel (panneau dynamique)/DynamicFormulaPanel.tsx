import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { AnimatedFormula } from "./AnimatedFormula";

type Point = { x: number; y: number };

type DynamicFormulaPanelProps = {
  z: Point;
  placed: Record<number, boolean>;
};

export const DynamicFormulaPanel: React.FC<DynamicFormulaPanelProps> = ({ z, placed }) => {
  const formulas = [
    { idx: 0, steps: [`z·i^0 = (${z.x} + i${z.y})·1`, `= ${z.x} + i${z.y}`] },
    { idx: 1, steps: [`z·i^1 = (${z.x} + i${z.y})·i`, `= ${z.x}·i + i${z.y}·i`, `= ${z.x}·i - ${z.y}`, `= -${z.y} + i${z.x}`] },
    { idx: 2, steps: [`z·i^2 = (${z.x} + i${z.y})·(-1)`, `= -${z.x} - i${z.y}`] },
    { idx: 3, steps: [`z·i^3 = (${z.x} + i${z.y})·(-i)`, `= -${z.x}·i - i${z.y}·i`, `= -${z.x}·i + ${z.y}`, `= ${z.y} - i${z.x}`] },
  ];

  return (
    <Box mt={4} p={3} bg="white" border="1px solid #ccc" borderRadius="md">
      <Text fontSize="md" fontWeight="bold" mb={2}>
        Démonstration des puissances de i
      </Text>
      {formulas.map((f) =>
        placed[f.idx] ? (
          <AnimatedFormula key={f.idx} steps={f.steps} delay={f.idx * 0.5} />
        ) : null
      )}
    </Box>
  );
};

