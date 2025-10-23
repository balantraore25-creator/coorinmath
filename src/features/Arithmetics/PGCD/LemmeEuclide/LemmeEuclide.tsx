import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  SimpleGrid,
} from "@chakra-ui/react";

// ⚡️ Import du hook color-mode depuis le snippet généré
import { useColorModeValue } from "@/components/ui/color-mode";

// Composants modulaires Chakra UI v3
import { Accordion, Span, Tag, Alert, Tooltip, Collapsible } from "@chakra-ui/react";

// Fonction utilitaire : division euclidienne
const divisionEuclidienne = (a: number, b: number) => {
  const q = Math.floor(a / b);
  const r = a % b;
  return { q, r };
};

export default function LemmeEuclide() {
  const [a, setA] = useState(56);
  const [b, setB] = useState(15);
  const [showResult, setShowResult] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { q, r } = divisionEuclidienne(a, b);

  const cercleColor = useColorModeValue("blue.400", "blue.300");
  const highlightColor = useColorModeValue("teal.400", "teal.300");

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>
        📐 Lemme d’Euclide
      </Heading>

      {/* Accordion v3 */}
      <Accordion.Root collapsible defaultValue={["lemme"]}>
        <Accordion.Item value="lemme">
          <Accordion.ItemTrigger>
            <Span flex="1">📘 Énoncé du lemme</Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <Text>
                Pour tout couple d’entiers <Tag.Root colorScheme="blue"><Tag.Label>a</Tag.Label></Tag.Root> et{" "}
                <Tag.Root colorScheme="green"><Tag.Label>b</Tag.Label></Tag.Root> (avec b ≠ 0), il existe un unique couple{" "}
                <Tag.Root colorScheme="orange"><Tag.Label>(q, r)</Tag.Label></Tag.Root> tel que :  
                <br />
                <b>a = bq + r</b> avec 0 ≤ r &lt; b.
              </Text>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>

      {/* Inputs + actions */}
      <Box mt={6} display="flex" flexDirection="column" gap={6}>
        <Box display="flex" gap={4}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Input
                type="number"
                value={a}
                onChange={(e) => setA(+e.target.value)}
                placeholder="a"
              />
            </Tooltip.Trigger>
            <Tooltip.Content>Entier a</Tooltip.Content>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger>
              <Input
                type="number"
                value={b}
                onChange={(e) => setB(+e.target.value)}
                placeholder="b"
              />
            </Tooltip.Trigger>
            <Tooltip.Content>Entier b (≠ 0)</Tooltip.Content>
          </Tooltip.Root>
        </Box>

        <Button colorScheme="teal" onClick={() => setShowResult(true)}>
          Calculer
        </Button>

        {showResult && (
          <Box display="flex" flexDirection="column" gap={3}>
            <Tag.Root colorScheme="blue">
              <Tag.Label>{a} = {b} × {q} + {r}</Tag.Label>
            </Tag.Root>

            <Alert.Root status="success" borderRadius="md">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>✅ Division euclidienne trouvée</Alert.Title>
                <Alert.Description>
                  Le quotient est q = {q}, et le reste est r = {r}.
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>
          </Box>
        )}

        {/* Collapsible v3 */}
        <Collapsible.Root open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
          <Collapsible.Trigger>
            <Button variant="outline">
              {isOpen ? "Masquer la visualisation" : "Voir la visualisation"}
            </Button>
          </Collapsible.Trigger>

          <Collapsible.Content>
            <Box mt={4}>
              <Text mb={2}>
                Visualisation de la division : {a} = {b} × {q} + {r}
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
      </Box>
    </Box>
  );
}
