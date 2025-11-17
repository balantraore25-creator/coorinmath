"use client";

import React, { useState, useCallback } from "react";
import { ComplexCanvas } from "./ComplexCanvas";
import type { Point } from "../types";
import { Box, Button } from "@chakra-ui/react";

// 🔢 Génération aléatoire du complexe z
const generateRandomZ = (): Point => ({
  x: Math.floor(Math.random() * 9 - 4),
  y: Math.floor(Math.random() * 9 - 4),
});

// 🔢 Complexe multiplicateur w (fixé ou aléatoire)
const generateRandomW = (): Point => ({
  x: Math.floor(Math.random() * 5 - 2),
  y: Math.floor(Math.random() * 5 - 2),
});

export const ComplexActivityRoot: React.FC = () => {
  // ✅ État pour z et w
  const [zPoint, setZPoint] = useState<Point>(generateRandomZ);
  const [wPoint, setWPoint] = useState<Point>(generateRandomW);

  // ✅ Handler pour relancer l’activité
  const handleReset = useCallback(() => {
    setZPoint(generateRandomZ());
    setWPoint(generateRandomW());
  }, []);

  return (
    <Box>
      {/* Canvas avec 5 boules (z + puissances de w) */}
      <ComplexCanvas z={zPoint} w={wPoint} />

      {/* Bouton pour relancer l’activité avec de nouveaux points aléatoires */}
      <Box mt={4} display="flex" justifyContent="center">
        <Button colorScheme="blue" onClick={handleReset}>
          Relancer avec de nouveaux points
        </Button>
      </Box>
    </Box>
  );
};
