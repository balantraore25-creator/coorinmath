import React, { useState } from "react";
import { ComplexCanvas } from "./ComplexCanvas";
import type { Point } from "./../types";
import { Box, Button } from "@chakra-ui/react";

export const ComplexActivity: React.FC = () => {
  const [phase, setPhase] = useState(1);

  const points: { A: Point; B: Point; C: Point } = {
    A: { x: 3, y: -5 },
    B: { x: -2, y: 4 },
    C: { x: 1, y: 2 },
  };

  return (
    <Box>
      {/* Canvas avec phases 1 et 2 */}
      <ComplexCanvas points={points} phase={phase} />

      {/* Contrôles pour passer d’une phase à l’autre */}
      <Box mt={4} display="flex" gap={2}>
        <Button onClick={() => setPhase(1)} colorScheme="gray">
          Phase 1 : Introduction
        </Button>
        <Button onClick={() => setPhase(2)} colorScheme="orange">
          Phase 2 : Placement
        </Button>
      </Box>
    </Box>
  );
};
