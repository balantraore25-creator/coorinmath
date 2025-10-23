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

// Utilitaire PGCD
const pgcd = (a: number, b: number): number => {
  while (b !== 0) [a, b] = [b, a % b];
  return Math.abs(a);
};

export default function GaussDivisibilite() {
  const [a, setA] = useState(7);
  const [b, setB] = useState(20);
  const [c, setC] = useState(14);
  const [showResult, setShowResult] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const produit = b * c;
  const gcd = pgcd(a, b);
  const aDiviseBC = produit % a === 0;
  const aDiviseC = c % a === 0;
  const isValidGauss = aDiviseBC && gcd === 1;

  const cercleColor = useColorModeValue("orange.400", "orange.300");
  const highlightColor = useColorModeValue("green.400", "green.300");

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>
        👨🏻 Théorème de Gauss
      </Heading>

      {/* Accordion v3 */}
      <Accordion.Root collapsible defaultValue={["gauss"]}>
        <Accordion.Item value="gauss">
          <Accordion.ItemTrigger>
            <Span flex="1">📘 Énoncé du théorème</Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <Text>
                Si{" "}
                <Tag.Root colorScheme="orange">
                  <Tag.Label>a | bc</Tag.Label>
                </Tag.Root>{" "}
                et{" "}
                <Tag.Root colorScheme="green">
                  <Tag.Label>pgcd(a, b) = 1</Tag.Label>
                </Tag.Root>
                , alors{" "}
                <Tag.Root colorScheme="blue">
                  <Tag.Label>a | c</Tag.Label>
                </Tag.Root>.
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
            <Tooltip.Content>Entier b</Tooltip.Content>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger>
              <Input
                type="number"
                value={c}
                onChange={(e) => setC(+e.target.value)}
                placeholder="c"
              />
            </Tooltip.Trigger>
            <Tooltip.Content>Entier c</Tooltip.Content>
          </Tooltip.Root>
        </Box>

        <Button colorScheme="teal" onClick={() => setShowResult(true)}>
          Vérifier
        </Button>

        {showResult && (
          <Box display="flex" flexDirection="column" gap={3}>
            <Box display="flex" gap={3}>
              <Tag.Root colorScheme={aDiviseBC ? "green" : "red"}>
                <Tag.Label>a | bc</Tag.Label>
              </Tag.Root>
              <Tag.Root colorScheme={gcd === 1 ? "green" : "red"}>
                <Tag.Label>pgcd(a, b) = {gcd}</Tag.Label>
              </Tag.Root>
              <Tag.Root colorScheme={aDiviseC ? "green" : "red"}>
                <Tag.Label>a | c</Tag.Label>
              </Tag.Root>
            </Box>

            <Alert.Root status={isValidGauss ? "success" : "error"} borderRadius="md">
              <Alert.Indicator /> {/* ✅ remplace Alert.Icon */}
              <Alert.Content>
                <Alert.Title>
                  {isValidGauss ? "✅ Théorème vérifié" : "❌ Hypothèses non satisfaites"}
                </Alert.Title>
                <Alert.Description>
                  {isValidGauss
                    ? "a divise c comme prévu par le théorème."
                    : "Vérifie que a divise bc et que pgcd(a, b) = 1."}
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>
          </Box>
        )}

        {/* Collapsible v3 */}
        <Collapsible.Root open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
          <Collapsible.Trigger>
            <Button variant="outline">
              {isOpen ? "Masquer l'animation" : "Voir l'animation"}
            </Button>
          </Collapsible.Trigger>

          <Collapsible.Content>
            <Box mt={4}>
              <Text mb={2}>
                Visualisation de bc = {b} × {c} = {produit}
              </Text>
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
      </Box>
    </Box>
  );
}
