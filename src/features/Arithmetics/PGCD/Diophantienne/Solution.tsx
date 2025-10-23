import { useState } from "react";
import { VStack, Text, HStack, Input, Button } from "@chakra-ui/react";

export const SolutionStep = ({
  a,
  b,
  c,
  pgcd,
}: {
  a: number;
  b: number;
  c: number;
  pgcd: number;
}) => {
  // États pour la solution particulière
  const [x0, setX0] = useState("");
  const [y0, setY0] = useState("");

  // États pour la solution générale
  const [coefX, setCoefX] = useState("");
  const [coefY, setCoefY] = useState("");

  // Feedback global
  const [feedback, setFeedback] = useState("");

  // Vérification solution particulière
  const checkParticuliere = () => {
    const ok = a * Number(x0) + b * Number(y0) === c;
    setFeedback(
      ok
        ? "✅ Solution particulière correcte."
        : "❌ Ce couple (x₀, y₀) ne vérifie pas ax + by = c."
    );
  };

  // Vérification solution générale
  const checkGenerale = () => {
    const ok =
      Number(coefX) === b / pgcd && Number(coefY) === -a / pgcd;
    setFeedback(
      ok
        ? "✅ Solution générale correcte."
        : "❌ Vérifie les coefficients : x = x₀ + (b/d)·t, y = y₀ - (a/d)·t."
    );
  };

  return (
    <VStack align="stretch" gap={6}>
      <Text fontSize="lg" fontWeight="bold">
        Étape 4 : Solutions de l’équation diophantienne
      </Text>

      {/* Solution particulière */}
      
      <VStack align="stretch" gap={3}>
        <Text>Propose une solution particulière (x₀, y₀) :</Text>
        <HStack gap={4}>
          <Input
            value={x0}
            onChange={(e) => setX0(e.target.value)}
            placeholder="x₀"
          />
          <Input
            value={y0}
            onChange={(e) => setY0(e.target.value)}
            placeholder="y₀"
          />
        </HStack>
        <Button size="sm" onClick={checkParticuliere}>
          Vérifier solution particulière
        </Button>
      </VStack>

      {/* Solution générale */}
      
      <VStack align="stretch" gap={3}>
        <Text>
          Complète la solution générale : x = x₀ + ( ? )·t , y = y₀ + ( ? )·t
        </Text>
        <HStack gap={4}>
          <Input
            value={coefX}
            onChange={(e) => setCoefX(e.target.value)}
            placeholder="coef pour x (b/d)"
          />
          <Input
            value={coefY}
            onChange={(e) => setCoefY(e.target.value)}
            placeholder="coef pour y (-a/d)"
          />
        </HStack>
        <Button size="sm" onClick={checkGenerale}>
          Vérifier solution générale
        </Button>
      </VStack>

      {/* Feedback */}
      
      {feedback && <Text fontWeight="semibold">{feedback}</Text>}
    </VStack>
  );
};
