"use client";

import { VStack, Text, List } from "@chakra-ui/react";
import type { FC } from "react";
import type { ConversionMethod } from "../logic/conversionSteps";

interface MethodGuideProps {
  method: ConversionMethod;
}

export const MethodGuide: FC<MethodGuideProps> = ({ method }) => {
  const guides: Record<ConversionMethod, { title: string; steps: string[]; example: string }> = {
    polynomial: {
      title: "Méthode polynomiale (développement)",
      steps: [
        "Écrire le nombre comme une somme pondérée des puissances de la base.",
        "Multiplier chaque chiffre par la puissance correspondante.",
        "Additionner les résultats.",
      ],
      example: "(101101)₂ = 1×2⁵ + 0×2⁴ + 1×2³ + 1×2² + 0×2¹ + 1×2⁰ = 45₁₀",
    },
    division: {
      title: "Méthode des divisions successives",
      steps: [
        "Diviser le nombre par la base cible.",
        "Noter le reste (chiffre de poids faible).",
        "Reprendre avec le quotient jusqu’à 0.",
        "Lire les restes de bas en haut.",
      ],
      example: "44₁₀ ÷ 2 → restes 101100₂",
    },
    multiplication: {
      title: "Méthode des multiplications successives",
      steps: [
        "Multiplier la partie fractionnaire par la base cible.",
        "Noter la partie entière obtenue.",
        "Reprendre avec la nouvelle fraction.",
        "Arrêter quand la fraction = 0 ou après un nombre de pas fixé.",
      ],
      example: "0.625₁₀ × 2 → 0.101₂",
    },
    grouping: {
      title: "Méthode du regroupement de bits",
      steps: [
        "Regrouper les bits en paquets (3 pour octal, 4 pour hexadécimal).",
        "Convertir chaque paquet en chiffre octal ou hexadécimal.",
        "Assembler le résultat.",
      ],
      example: "(101101)₂ → 0010 1101 → (2D)₁₆",
    },
  };

  const guide = guides[method];

  return (
    <VStack align="start" gap={3} p={4} borderWidth={1} borderRadius="md" bg="gray.50">
      <Text fontWeight="bold">{guide.title}</Text>
      <List.Root gap="2" variant="plain" align="start">
        {guide.steps.map((s, i) => (
          <List.Item key={i}>
            <List.Indicator />
            <Text fontSize="sm">{s}</Text>
          </List.Item>
        ))}
      </List.Root>
      <Text fontSize="sm" color="teal.600">
        <b>Exemple guidé :</b> {guide.example}
      </Text>
    </VStack>
  );
};
