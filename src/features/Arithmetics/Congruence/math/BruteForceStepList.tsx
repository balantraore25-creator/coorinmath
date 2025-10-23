// src/components/congruence/BruteForceStepList.tsx
import { Box, Code, Stack, Text } from "@chakra-ui/react";
import type { BruteForceStep } from "./types";

type Props = { steps: BruteForceStep[]; a: number; n: number; b: number };

export const BruteForceStepList = ({ steps, a, n, b }: Props) => {
  return (
    <Stack>
      <Text fontWeight="bold">
        Étapes de la recherche brute force pour a = {a}, b = {b}, n = {n}
      </Text>
      {steps.map((s, i) => (
        <Box
          key={i}
          p={2}
          borderWidth="1px"
          rounded="md"
          bg={s.match ? "green.50" : undefined}
        >
          <Text>
            x = {s.x} → a·x mod n = {a}·{s.x} mod {n} ={" "}
            <Code>{s.axModN}</Code>{" "}
            {s.match && <strong>✓ correspond à b mod n</strong>}
          </Text>
        </Box>
      ))}
    </Stack>
  );
};
