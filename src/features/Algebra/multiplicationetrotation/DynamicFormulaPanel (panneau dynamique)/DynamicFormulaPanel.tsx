import React from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Separator,
  SliderRoot,
  SliderTrack,
  SliderRange,
  SliderThumb,
  Badge,
} from "@chakra-ui/react";

type Point = { x: number; y: number };

interface DynamicFormulaPanelProps {
  selectedPoints: Point[];
  placed?: Record<number, boolean>;
  k: number;
  onKChange: (newK: number) => void;
}

const toDegrees = (rad: number) => (rad * 180) / Math.PI;

export const DynamicFormulaPanel: React.FC<DynamicFormulaPanelProps> = ({
  selectedPoints,
  placed = {},
  k,
  onKChange,
}) => {
  return (
    <Box p={4} borderWidth="1px" borderRadius="md" bg="white">
      <Text fontSize="lg" fontWeight="bold" mb={3}>
        Formules dynamiques
      </Text>

      <Separator my={3} />

      <Text mb={2}>Choisir la puissance de i : i^k</Text>

      <SliderRoot
        min={0}
        max={4}
        step={1}
        value={[k]}
        onValueChange={(details) => onKChange(details.value[0])}
        width="100%"
        mb={4}
      >
        <SliderTrack />
        <SliderRange />
        <SliderThumb index={0}>
          <Box fontSize="sm" fontWeight="semibold">{k}</Box>
        </SliderThumb>
      </SliderRoot>

      <VStack align="start" gap={3}>
        {selectedPoints.map((p, idx) => {
          const r = Math.sqrt(p.x * p.x + p.y * p.y);
          const theta = Math.atan2(p.y, p.x);
          const thetaDeg = toDegrees(theta);
          const newThetaDeg = thetaDeg + k * 90;

          return (
            <Box key={idx} p={3} borderWidth="1px" borderRadius="md" w="100%">
              <HStack justify="space-between" gap={2} mb={2}>
                <Text fontWeight="semibold">Boule {idx + 1}</Text>
                <Badge colorScheme={placed[idx] ? "green" : "gray"}>
                  {placed[idx] ? "Placée" : "Non placée"}
                </Badge>
              </HStack>

              <Text>
                Écriture polaire : z = {r.toFixed(2)} · e^(i {thetaDeg.toFixed(1)}°)
              </Text>

              <Text mt={1}>
                Multiplication par i^{k} : z · i^{k} = {r.toFixed(2)} · e^(i ({thetaDeg.toFixed(1)}° + {k}·90°))
              </Text>

              <Text mt={1} fontSize="sm" color="gray.700">
                → Le module reste {r.toFixed(2)}, l’argument devient {newThetaDeg.toFixed(1)}°
              </Text>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
};
