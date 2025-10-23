import { useState } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { Accordion, Tag, Alert, Collapsible, Span } from "@chakra-ui/react";

interface CorollaireProps {
  a: number;
  b: number;
  c: number;
}

const pgcd = (a: number, b: number): number => {
  while (b !== 0) [a, b] = [b, a % b];
  return Math.abs(a);
};

export default function CorollaireGauss({ a, b, c }: CorollaireProps) {
  const [showResult, setShowResult] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const gcd = pgcd(a, b);
  const hypothesesOk = c % a === 0 && c % b === 0 && gcd === 1;
  const conclusion = c % (a * b) === 0;

  return (
    <Accordion.Item value="corollaire">
      <Accordion.ItemTrigger>
        <Span flex="1">📐 Corollaire de Gauss</Span>
        <Accordion.ItemIndicator />
      </Accordion.ItemTrigger>
      <Accordion.ItemContent>
        <Accordion.ItemBody>
          {/* ✅ Correction : Text as="span" pour éviter <p><div> */}
          <Box mb={3}>
            <Text as="span">
              Si{" "}
              <Tag.Root colorScheme="orange"><Tag.Label>a | c</Tag.Label></Tag.Root>,{" "}
              <Tag.Root colorScheme="blue"><Tag.Label>b | c</Tag.Label></Tag.Root> et{" "}
              <Tag.Root colorScheme="green"><Tag.Label>pgcd(a, b) = 1</Tag.Label></Tag.Root>, alors{" "}
              <Tag.Root colorScheme="purple"><Tag.Label>ab | c</Tag.Label></Tag.Root>.
            </Text>
          </Box>

          <Button colorScheme="teal" onClick={() => setShowResult(true)}>Vérifier</Button>

          {showResult && (
            <Alert.Root status={hypothesesOk ? "success" : "error"} mt={3}>
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>
                  {hypothesesOk ? "✅ Corollaire vérifié" : "❌ Hypothèses non satisfaites"}
                </Alert.Title>
                <Alert.Description>
                  {hypothesesOk
                    ? `Alors ${a*b} divise ${c}.`
                    : "Vérifie que a | c, b | c et pgcd(a, b) = 1."}
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}

          {/* ✅ Correction : utiliser asChild pour éviter <button><button> */}
          <Collapsible.Root open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
            <Collapsible.Trigger asChild>
              <Button variant="outline" mt={3}>
                {isOpen ? "Masquer la visualisation" : "Voir la visualisation"}
              </Button>
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Box mt={4}>
                <Text>
                  ab = {a} × {b} = {a*b}, vérifie si {c} est multiple de {a*b} → {conclusion ? "oui" : "non"}.
                </Text>
              </Box>
            </Collapsible.Content>
          </Collapsible.Root>
        </Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
}
