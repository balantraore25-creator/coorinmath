import { Box, Text, VStack, Code } from "@chakra-ui/react";
import type { BaseType } from "../../../../types/operation";

export interface StepExplanationProps {
  explanation: string;
  base: BaseType;
}

export const StepExplanation: React.FC<StepExplanationProps> = ({ explanation, base }) => {
  const baseInfo: Record<BaseType, { label: string; digits: string }> = {
    2: { label: "binaire", digits: "0, 1" },
    8: { label: "octale", digits: "0 à 7" },
    10: { label: "décimale", digits: "0 à 9" },
    16: { label: "hexadécimale", digits: "0 à 9, A à F" },
  };

  const commonMistakes: Record<BaseType, string[]> = {
    2: ["Utiliser 2 comme chiffre", "Oublier la retenue en base 2"],
    8: ["Confondre 8 comme chiffre valide", "Erreur de conversion en base 10"],
    10: ["Erreur de retenue classique", "Alignement incorrect des chiffres"],
    16: ["Utiliser G ou H", "Oublier que A = 10, B = 11, etc."],
  };

  return (
    <Box borderWidth="1px" borderRadius="md" p={4} bg="gray.50" w="full">
      <VStack align="start" gap={3}>
        <Text fontWeight="bold">Explication du calcul :</Text>
        <Text>{explanation}</Text>

        <Text fontWeight="bold">Base utilisée :</Text>
        <Text>
          <Code>{base}</Code> – Système {baseInfo[base].label}, chiffres valides :{" "}
          <Code>{baseInfo[base].digits}</Code>
        </Text>

        <Text fontWeight="bold">Erreurs fréquentes :</Text>
        <VStack align="start" gap={1}>
          {commonMistakes[base].map((mistake, i) => (
            <Text key={i} fontSize="sm" color="red.600">
              • {mistake}
            </Text>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};
