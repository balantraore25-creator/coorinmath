import { useState } from "react";
import { VStack, Text, Code, Button, HStack } from "@chakra-ui/react";

interface Step {
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
}

function computeEuclideanTrail(a: number, b: number): Step[] {
  const steps: Step[] = [];
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    const q = Math.floor(x / y);
    const r = x % y;
    steps.push({ dividend: x, divisor: y, quotient: q, remainder: r });
    x = y;
    y = r;
  }
  return steps;
}

interface Props {
  a: number;
  b: number;
  c: number;
}

export const EuclideanAutoTrail = ({ a, b, c }: Props) => {
  // Calcul du pgcd
  const steps = computeEuclideanTrail(a, b);
  const pgcd = steps.at(-1)?.divisor ?? 1;

  // Équation simplifiée
  const a1 = a / pgcd;
  const b1 = b / pgcd;
  const c1 = c / pgcd;

  // Gestion de l’affichage progressif
  const [visibleCount, setVisibleCount] = useState(1);

  return (
    <VStack align="stretch" gap={4}>
      <Text>
        Équation initiale : <Code>{a}x + {b}y = {c}</Code>
      </Text>
      <Text>
        Équation simplifiée : <Code>{a1}x + {b1}y = {c1}</Code>
      </Text>

      <Text fontWeight="bold">Descente Euclide (progressive) :</Text>
      {steps.slice(0, visibleCount).map((s, i) => (
        <HStack key={i}>
          <Code>
            {s.dividend} = {s.divisor} ×{" "}
            <span style={{ color: "blue" }}>{s.quotient}</span> +{" "}
            <span style={{ color: "red" }}>{s.remainder}</span>
          </Code>
        </HStack>
      ))}

      {visibleCount < steps.length && (
        <Button
          onClick={() => setVisibleCount((c) => c + 1)}
          colorScheme="teal"
          alignSelf="flex-start"
        >
          ➕ Révéler l’étape suivante
        </Button>
      )}

      {visibleCount === steps.length && (
        <Text color="green.600" fontWeight="bold">
          ✅ Descente terminée : pgcd({a}, {b}) = {pgcd}
        </Text>
      )}
    </VStack>
  );
};
