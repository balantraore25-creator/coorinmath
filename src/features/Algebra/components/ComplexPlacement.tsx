import { Box, Text } from "@chakra-ui/react";
import React from "react";

export type Point = { x: number; y: number };

interface Props {
  points: { A: Point; B: Point; C: Point };
}

export const ComplexPlacement: React.FC<Props> = ({ points }) => (
  <Box p={6}>
    <Text fontSize="xl" fontWeight="bold" mb={4}>
      Placement sur le plan complexe
    </Text>
    <Text>A : z = {points.A.x} + i{points.A.y}</Text>
    <Text>B : z = {points.B.x} + i{points.B.y}</Text>
    <Text>C : z = {points.C.x} + i{points.C.y}</Text>
    <Text mt={4} color="gray.500">
      👉 Place ces points sur le plan complexe interactif.
    </Text>
  </Box>
);
