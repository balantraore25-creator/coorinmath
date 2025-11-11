import { Box, Text, Input, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import type { Point } from "./ComplexPlacement";

interface Props {
  points: { A: Point; B: Point; C: Point };
}

export const ComplexCoordinates: React.FC<Props> = ({ points }) => {
  const [answers, setAnswers] = useState<{ A?: string; B?: string; C?: string }>({});

  const validate = () => {
    const results = Object.entries(points).map(([label, p]) => {
      const student = answers[label as keyof typeof answers];
      if (!student) return `${label}: non répondu ❌`;
      return student === `(${p.x},${p.y})`
        ? `${label}: correct ✅`
        : `${label}: attendu (${p.x},${p.y}), obtenu ${student} ❌`;
    });
    alert(results.join("\n"));
  };

  return (
    <Box p={6}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Déduis les coordonnées
      </Text>
      <Input
        placeholder="Coordonnées de A (ex: (x,y))"
        mb={2}
        onChange={(e) => setAnswers({ ...answers, A: e.target.value })}
      />
      <Input
        placeholder="Coordonnées de B"
        mb={2}
        onChange={(e) => setAnswers({ ...answers, B: e.target.value })}
      />
      <Input
        placeholder="Coordonnées de C"
        mb={2}
        onChange={(e) => setAnswers({ ...answers, C: e.target.value })}
      />
      <Button mt={4} colorScheme="blue" onClick={validate}>
        Valider
      </Button>
    </Box>
  );
};
