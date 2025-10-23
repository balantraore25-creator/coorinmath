import {
  Box,
  Code,
  HStack,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import type { EuclidRow } from "../../features/Arithmetics/Congruence/math/extended-euclid";

type Props = { steps: EuclidRow[]; n: number; a: number };

export const EuclidStepList = ({ steps, n, a }: Props) => {
  return (
    <Stack>
      <Text fontWeight="bold">
        Étapes de l’algorithme d’Euclide étendu pour a = {a} et n = {n}
      </Text>

      {steps.map((row, i) => (
        <Box key={i} p={3} borderWidth="1px" rounded="md">
          <HStack justify="space-between">
            <Text>Division {i + 1}</Text>
            <Code>q = {row.q}</Code>
          </HStack>

          <Text>
            r = {row.r0} − {row.q} × {row.r1} = <Code>{row.rNext}</Code>
          </Text>

          {/* ✅ Tooltip v3 */}
          <Tooltip.Root positioning={{ placement: "top" }}>
            <Tooltip.Trigger asChild>
              <Text cursor="help">
                s: {row.s0} → {row.s1} → <Code>{row.sNext}</Code>,{" "}
                t: {row.t0} → {row.t1} → <Code>{row.tNext}</Code>
              </Text>
            </Tooltip.Trigger>
            <Tooltip.Content>
              Coefficients de Bézout pour n = {n} et a = {a}
              <Tooltip.Arrow />
            </Tooltip.Content>
          </Tooltip.Root>
        </Box>
      ))}

      {steps.length === 0 && (
        <Text color="fg.muted">
          Aucune étape à afficher. Lance un calcul pour voir le déroulé.
        </Text>
      )}

      <Text fontSize="sm" color="fg.muted">
        Convention : s et t satisfont s·n + t·a = gcd(n, a).
      </Text>
    </Stack>
  );
};
