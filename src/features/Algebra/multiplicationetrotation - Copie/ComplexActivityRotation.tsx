import React, { useState } from "react";
import { ComplexCanvas } from "./ComplexCanvas";
import type { Point } from "../types";
import { Box, Button } from "@chakra-ui/react";

export const ComplexActivityRotation: React.FC = () => {
  // Génération aléatoire des points initiaux
  const generateRandomPoints = (): { A: Point; B: Point; C: Point } => ({
    A: { x: Math.floor(Math.random() * 9 - 4), y: Math.floor(Math.random() * 9 - 4) },
    B: { x: Math.floor(Math.random() * 9 - 4), y: Math.floor(Math.random() * 9 - 4) },
    C: { x: Math.floor(Math.random() * 9 - 4), y: Math.floor(Math.random() * 9 - 4) },
  });

  const [points, setPoints] = useState<{ A: Point; B: Point; C: Point }>(generateRandomPoints);

  return (
    <Box>
      {/* Canvas avec phases automatiques */}
      <ComplexCanvas points={points} />

      {/* Bouton pour relancer l’activité avec de nouveaux points aléatoires */}
      <Box mt={4} display="flex" justifyContent="center">
        <Button colorScheme="blue" onClick={() => setPoints(generateRandomPoints())}>
          Relancer avec de nouveaux points
        </Button>
      </Box>
    </Box>
  );
};
