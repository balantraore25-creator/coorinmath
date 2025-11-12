import React from "react";
import { ComplexCanvas } from "./ComplexCanvas";
import type { Point } from "../types";
import { Box } from "@chakra-ui/react";

export const ComplexPlacement: React.FC = () => {
  // Points attendus
  const points: { A: Point; B: Point; C: Point } = {
    A: { x: 3, y: -5 },
    B: { x: -2, y: 4 },
    C: { x: 1, y: 2 },
  };

  return (
    <Box>
      {/* Phase fixée à 2 → Placement */}
      <ComplexCanvas points={points} phase={2} />
    </Box>
  );
};
