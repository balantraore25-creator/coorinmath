import { useState } from "react";
import { Box, Heading, Input, Link, Flex } from "@chakra-ui/react";
import { Accordion, Tooltip } from "@chakra-ui/react";

// Import des enfants
import GaussTheorem from "./GaussTheorem";
import CorollaireGauss from "./CorollaireGauss";
import LemmeEuclide from "./LemmeEuclide";
import PremiersEntreEux from "./PremiersEntreEux";

export default function ArithmeticsMother() {
  const [a, setA] = useState(7);
  const [b, setB] = useState(20);
  const [c, setC] = useState(14);

  return (
    <Box p={6}>
        <Flex justify="space-between" w="full">
          <Link
            href="/dash/courses/pgcd"
            color="teal.500"
            fontWeight="medium"
            mb={4}
            display="inline-block"
          >
            ← Retour à la page précédente
          </Link>
        </Flex>
      <Heading size="lg" mb={4}>
        📚 Théorèmes fondamentaux d’arithmétique
      </Heading>

      {/* Inputs partagés */}
      <Box display="flex" gap={4} mb={6}>
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

      {/* ✅ Tous les enfants sont enveloppés dans un seul Accordion.Root */}
      <Accordion.Root collapsible multiple defaultValue={["gauss"]}>
        <GaussTheorem a={a} b={b} c={c} />
        <CorollaireGauss a={a} b={b} c={c} />
        <LemmeEuclide a={a} b={b} />
        <PremiersEntreEux a={a} b={b} />
      </Accordion.Root>
    </Box>
  );
}
