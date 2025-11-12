import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { ComplexIntro } from "./ComplexIntro";
import { ComplexPlacement } from "./ComplexPlacement";
import { ComplexCoordinates } from "./ComplexCoordinates";
import type { Point } from "./ComplexCanvas";
import { motion, AnimatePresence } from "framer-motion";

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
      const timer = setTimeout(() => setStep(step + 1), 7000); // délai de 7s
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
