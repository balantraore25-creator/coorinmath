import React, { useState, useEffect } from "react";
import { Box, Button } from "@chakra-ui/react";
import { ComplexIntro } from "./ComplexIntro";
import { ComplexPlacement } from "./ComplexPlacement";
import { ComplexCoordinates } from "./ComplexCoordinates";
import type { Point } from "./ComplexCanvas";

function randomPoint(): Point {
  return {
    x: Math.floor(Math.random() * 11 - 5),
    y: Math.floor(Math.random() * 11 - 5),
  };
}

export const ComplexActivity: React.FC = () => {
  const [step, setStep] = useState(1);
  const [points] = useState<{ A: Point; B: Point; C: Point }>({
    A: randomPoint(),
    B: randomPoint(),
    C: randomPoint(),
  });

  // Étape 1 → passe automatiquement à l’étape 2 après 5s
  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => setStep(2), 5000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <Box>
      {step === 1 && <ComplexIntro />}

      {step === 2 && (
        <Box>
          <ComplexPlacement points={points} />
          <Button mt={4} colorScheme="blue" onClick={() => setStep(3)}>
            Suivant
          </Button>
        </Box>
      )}

      {step === 3 && <ComplexCoordinates points={points} />}
    </Box>
  );
};
