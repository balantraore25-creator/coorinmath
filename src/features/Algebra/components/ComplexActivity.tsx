import React, { useState, useEffect } from "react";
import { Box, Button } from "@chakra-ui/react";
import { ComplexIntro } from "./ComplexIntro";
import { ComplexPlacement } from "./ComplexPlacement";
import { ComplexCoordinates } from "./ComplexCoordinates";
import type { Point } from "./ComplexCanvas";
import { AnimatePresence, motion } from "framer-motion";

function randomPoint(): Point {
  return {
    x: Math.floor(Math.random() * 13 - 6), // plage -6 à +6
    y: Math.floor(Math.random() * 13 - 6),
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
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
          >
            <ComplexIntro />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="placement"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
          >
            <ComplexPlacement points={points} />
            <Button mt={4} colorScheme="blue" onClick={() => setStep(3)}>
              Suivant
            </Button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="coordinates"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <ComplexCoordinates points={points} />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};
