import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

type AnimatedFormulaProps = {
  steps: string[];
  delay: number;
};

export const AnimatedFormula: React.FC<AnimatedFormulaProps> = ({ steps, delay }) => (
  <Box mb={2}>
    {steps.map((s, idx) => (
      <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: delay + idx * 0.4 }}>
        <Text>{s}</Text>
      </motion.div>
    ))}
  </Box>
);
