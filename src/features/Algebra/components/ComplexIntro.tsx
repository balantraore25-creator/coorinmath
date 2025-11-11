import { Box, Text } from "@chakra-ui/react";
import React from "react";

export const ComplexIntro: React.FC = () => (
  <Box p={6}>
    <Text fontSize="xl" fontWeight="bold" mb={4}>
      Définition d’un nombre complexe
    </Text>
    <Text>
      Un nombre complexe s’écrit : z = x + i y
    </Text>
    <Text mt={2}>- x : partie réelle</Text>
    <Text>- y : partie imaginaire</Text>
    <Text mt={4}>
      Interprétations possibles :
      <br />1. Coordonnée (x, y)
      <br />2. Point du plan complexe
      <br />3. Vecteur depuis l’origine
    </Text>
  </Box>
);
