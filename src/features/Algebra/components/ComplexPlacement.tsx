import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { ComplexCanvas } from "./ComplexCanvas";

export type Point = { x: number; y: number }; // ✅ export ajouté

interface Props {
  points: { A: Point; B: Point; C: Point };
}

export const ComplexPlacement: React.FC<Props> = ({ points }) => (
  <Box p={6}>
    <Text fontSize="xl" fontWeight="bold" mb={4}>
      Placement sur le plan complexe
    </Text>
    <Text mb={4}>
      Clique sur les cercles colorés pour placer les points A (rouge), B (bleu) et C (vert).
    </Text>
    <ComplexCanvas points={points} />
  </Box>
);
