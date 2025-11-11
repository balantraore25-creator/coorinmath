import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { ComplexIntro } from "./ComplexIntro";
import { ComplexPlacement } from "./ComplexPlacement";
import { ComplexCoordinates } from "./ComplexCoordinates";
import type { Point } from "./ComplexCanvas"; // import type-only

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

  // Transition automatique entre les étapes
  useEffect(() => {
    if (step < 3) {
      const timer = setTimeout(() => setStep(step + 1), 7000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <Box>
      {step === 1 && <ComplexIntro />}
      {step === 2 && <ComplexPlacement points={points} />}
      {step === 3 && <ComplexCoordinates points={points} />}
    </Box>
  );
};
