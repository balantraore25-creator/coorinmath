import { useState } from "react";
import { Box, Text, Button, SimpleGrid } from "@chakra-ui/react";
import { Accordion, Span, Tag, Alert, Collapsible } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";

interface PremiersProps {
  a: number;
  b: number;
}

// Algorithme d’Euclide étendu pour PGCD et coefficients de Bézout
const euclideEtendu = (a: number, b: number): { d: number; u: number; v: number } => {
  if (b === 0) return { d: a, u: 1, v: 0 };
  const { d, u: u1, v: v1 } = euclideEtendu(b, a % b);
  return { d, u: v1, v: u1 - Math.floor(a / b) * v1 };
};

export default function PremiersEntreEux({ a, b }: PremiersProps) {
  const [showResult, setShowResult] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { d, u, v } = euclideEtendu(a, b);
  const premiers = d === 1;

  const cercleColor = useColorModeValue("blue.400", "blue.300");
  const highlightColor = useColorModeValue("red.400", "red.300");

  return (
    <Accordion.Item value="premiers">
      <Accordion.ItemTrigger>
        <Span flex="1">🤝 Nombres premiers entre eux</Span>
        <Accordion.ItemIndicator />
      </Accordion.ItemTrigger>
      <Accordion.ItemContent>
        <Accordion.ItemBody>
          {/* ✅ Correction : Text as="span" pour éviter <p><div> */}
          <Box mb={3}>
            <Text as="span">
              Deux entiers{" "}
              <Tag.Root colorScheme="blue"><Tag.Label>a</Tag.Label></Tag.Root> et{" "}
              <Tag.Root colorScheme="green"><Tag.Label>b</Tag.Label></Tag.Root> sont{" "}
              <Tag.Root colorScheme="purple"><Tag.Label>premiers entre eux</Tag.Label></Tag.Root> si{" "}
              <Tag.Root colorScheme="orange"><Tag.Label>pgcd(a, b) = 1</Tag.Label></Tag.Root>, ce qui équivaut à{" "}
              <Tag.Root colorScheme="red"><Tag.Label>au + bv = 1</Tag.Label></Tag.Root>.
            </Text>
          </Box>

          <Button colorScheme="teal" onClick={() => setShowResult(true)}>
            Vérifier
          </Button>

          {showResult && (
            <Box mt={3} display="flex" flexDirection="column" gap={3}>
              <Alert.Root status={premiers ? "success" : "error"}>
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>
                    {premiers ? "✅ Premiers entre eux" : "❌ Pas premiers entre eux"}
                  </Alert.Title>
                  <Alert.Description>
                    {premiers
                      ? `${a} et ${b} ont PGCD = 1.`
                      : `PGCD(${a}, ${b}) = ${d}.`}
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>

              {premiers && (
                <Alert.Root status="info">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>✍️ Identité de Bézout</Alert.Title>
                    <Alert.Description>
                      {`1 = ${a} × (${u}) + ${b} × (${v})`}
                    </Alert.Description>
                  </Alert.Content>
                </Alert.Root>
              )}
            </Box>
          )}

          {/* ✅ Correction : asChild pour éviter <button><button> */}
          <Collapsible.Root open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
            <Collapsible.Trigger asChild>
              <Button variant="outline" mt={3}>
                {isOpen ? "Masquer la visualisation" : "Voir la visualisation"}
              </Button>
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Box mt={4}>
                <Text mb={2}>Visualisation des diviseurs communs de {a} et {b}</Text>
                <SimpleGrid columns={Math.min(a, b)} gap={1}>
                  {Array.from({ length: Math.min(a, b) }).map((_, i) => {
                    const k = i + 1;
                    const isDiv = a % k === 0 && b % k === 0;
                    return (
                      <Box
                        key={k}
                        w="12px"
                        h="12px"
                        borderRadius="full"
                        bg={isDiv ? highlightColor : cercleColor}
                        title={isDiv ? `${k} divise ${a} et ${b}` : `${k} ne divise pas les deux`}
                      />
                    );
                  })}
                </SimpleGrid>
              </Box>
            </Collapsible.Content>
          </Collapsible.Root>
        </Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
}
