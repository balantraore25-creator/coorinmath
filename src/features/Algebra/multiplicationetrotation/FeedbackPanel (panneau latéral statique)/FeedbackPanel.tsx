import React from "react";
import { Box, Text } from "@chakra-ui/react";

type FeedbackPanelProps = {
  z: { x: number; y: number };
  module: number;
  argumentDeg: number;
  placedCount: number;
  totalCount: number;
};

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ z, module, argumentDeg, placedCount, totalCount }) => (
  <Box minW={{ base: "100%", md: "280px" }} p={4} bg="gray.50" border="1px solid #ddd" borderRadius="md" shadow="md">
    <Text fontSize="lg" fontWeight="bold" mb={3}>Étapes de calcul</Text>
    <Text>Coordonnée : z = {z.x} + i{z.y}</Text>
    <Text>Module : √({z.x}² + {z.y}²) = {module.toFixed(2)}</Text>
    <Text>Argument : arctan({z.y}/{z.x}) = {argumentDeg.toFixed(2)}°</Text>
    <Text fontWeight="semibold">Forme trigonométrique :</Text>
    <Text>z = {module.toFixed(2)} (cos({argumentDeg.toFixed(2)}°) + i·sin({argumentDeg.toFixed(2)}°))</Text>
    <Box mt={4} p={2} bg="white" border="1px solid #ccc" borderRadius="md">
      <Text fontSize="md" fontWeight="semibold">
        Progression : {placedCount} / {totalCount} boules bien placées
      </Text>
    </Box>
  </Box>
);
