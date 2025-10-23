import { useState } from "react";
import { Box, Text, Button, SimpleGrid } from "@chakra-ui/react";
import { Accordion, Tag, Alert, Collapsible, Span } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";

interface LemmeProps {
  a: number;
  b: number;
}

const divisionEuclidienne = (a: number, b: number) => {
  const q = Math.floor(a / b);
  const r = a % b;
  return { q, r };
};

export default function LemmeEuclide({ a, b }: LemmeProps) {
  const [showResult, setShowResult] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { q, r } = divisionEuclidienne(a, b);
  const cercleColor = useColorModeValue("blue.400", "blue.300");
  const highlightColor = useColorModeValue("teal.400", "teal.300");

  return (
    <Accordion.Item value="lemme">
      <Accordion.ItemTrigger>
        <Span flex="1">📘 Lemme d’Euclide</Span>
        <Accordion.ItemIndicator />
      </Accordion.ItemTrigger>
      <Accordion.ItemContent>
        <Accordion.ItemBody>
          {/* ✅ Correction : Text as="span" + Box pour éviter <p><div> */}
          <Box mb={3}>
            <Text as="span">
              Pour tout couple d’entiers a et b (b ≠ 0), il existe un unique couple{" "}
            </Text>
            <Tag.Root colorScheme="orange">
              <Tag.Label>(q, r)</Tag.Label>
            </Tag.Root>
            <Text as="span"> tel que : a = bq + r avec 0 ≤ r &lt; b.</Text>
          </Box>

          <Button colorScheme="teal" onClick={() => setShowResult(true)}>
            Calculer
          </Button>

          {showResult && (
            <Alert.Root status="success" mt={3}>
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>✅ Division euclidienne trouvée</Alert.Title>
                <Alert.Description>
                  {a} = {b} × {q} + {r}, avec 0 ≤ {r} &lt; {b}.
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
                <Text mb={2}>
                  Visualisation : {a} = {b} × {q} + {r}
                </Text>
                <SimpleGrid columns={b} gap={1}>
                  {Array.from({ length: a }).map((_, i) => (
                    <Box
                      key={i}
                      w="10px"
                      h="10px"
                      borderRadius="full"
                      bg={i < b * q ? cercleColor : highlightColor}
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
