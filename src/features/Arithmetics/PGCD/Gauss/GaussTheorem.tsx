import { useState } from "react";
import { Box, Text, Button, SimpleGrid } from "@chakra-ui/react";
import { Accordion, Tag, Alert, Collapsible, Span } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";

interface GaussProps {
  a: number;
  b: number;
  c: number;
}

const pgcd = (a: number, b: number): number => {
  while (b !== 0) [a, b] = [b, a % b];
  return Math.abs(a);
};

export default function GaussTheorem({ a, b, c }: GaussProps) {
  const [showResult, setShowResult] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const produit = b * c;
  const gcd = pgcd(a, b);
  const cercleColor = useColorModeValue("orange.400", "orange.300");
  const highlightColor = useColorModeValue("green.400", "green.300");

  return (
    <Accordion.Item value="gauss">
      <Accordion.ItemTrigger>
        <Span flex="1">👨🏻 Théorème de Gauss</Span>
        <Accordion.ItemIndicator />
      </Accordion.ItemTrigger>
      <Accordion.ItemContent>
        <Accordion.ItemBody>
          <Box mb={3}>
            <Text as="span">
              Si{" "}
              <Tag.Root colorScheme="orange"><Tag.Label>a | bc</Tag.Label></Tag.Root>{" "}
              et{" "}
              <Tag.Root colorScheme="green"><Tag.Label>pgcd(a, b) = 1</Tag.Label></Tag.Root>, alors{" "}
              <Tag.Root colorScheme="blue"><Tag.Label>a | c</Tag.Label></Tag.Root>.
            </Text>
          </Box>

          <Button colorScheme="teal" onClick={() => setShowResult(true)}>
            Vérifier
          </Button>

          {showResult && (
            <Alert.Root status={produit % a === 0 && gcd === 1 ? "success" : "error"} mt={3}>
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>
                  {produit % a === 0 && gcd === 1 ? "✅ Théorème vérifié" : "❌ Hypothèses non satisfaites"}
                </Alert.Title>
                <Alert.Description>
                  {produit % a === 0 && gcd === 1
                    ? "a divise c comme prévu."
                    : "Vérifie que a | bc et pgcd(a, b) = 1."}
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>
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
                <Text mb={2}>Visualisation de bc = {b} × {c} = {produit}</Text>
                <SimpleGrid columns={b} gap={1}>
                  {Array.from({ length: produit }).map((_, i) => (
                    <Box
                      key={i}
                      w="10px"
                      h="10px"
                      borderRadius="full"
                      bg={i % a === 0 ? highlightColor : cercleColor}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            </Collapsible.Content>
          </Collapsible.Root>
        </Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
}
