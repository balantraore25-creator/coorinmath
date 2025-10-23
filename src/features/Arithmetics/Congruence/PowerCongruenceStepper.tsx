"use client";

import { useState } from "react";
import {
  Box,
  RadioGroup,
  HStack,
  Text,
} from "@chakra-ui/react";
import StepperPeriodicite from "./StepperPeriodicite";     // Méthode périodicité
import FastExpStepper from "./FastExpStepper";       // Méthode exponentiation rapide

export default function PowerCongruenceStepper() {
  const [method, setMethod] = useState<"periodicity" | "fastExp">("periodicity");

  return (
    <Box maxW="800px" mx="auto" p={4}>
      {/* Sélecteur de méthode */}
      <Text fontWeight="bold" mb={2}>Méthode</Text>
      <RadioGroup.Root
        value={method}
        onValueChange={(e) => setMethod(e.value as "periodicity" | "fastExp")}
      >
        <HStack>
          <RadioGroup.Item value="periodicity">
            <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemIndicator />
            <RadioGroup.ItemText>Périodicité</RadioGroup.ItemText>
          </RadioGroup.Item>
          <RadioGroup.Item value="fastExp">
            <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemIndicator />
            <RadioGroup.ItemText>Exponentiation rapide</RadioGroup.ItemText>
          </RadioGroup.Item>
        </HStack>
      </RadioGroup.Root>

      {/* Affichage selon la méthode */}
      <Box mt={6}>
        {method === "periodicity" && <StepperPeriodicite />}
        {method === "fastExp" && <FastExpStepper />}
      </Box>
    </Box>
  );
}
