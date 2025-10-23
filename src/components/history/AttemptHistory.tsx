// components/history/AttemptHistory.tsx
import { Badge, Box, HStack, Stack, Text } from "@chakra-ui/react";

export type Attempt = {
  a: number;
  n: number;
  method: "euclid" | "bruteforce";
  result: number | null;
  gcd: number;
  at: string; // ISO date
};

type Props = { items: Attempt[] };

export const AttemptHistory = ({ items }: Props) => {
  if (!items.length) return <Text color="fg.muted">Aucun historique pour le moment.</Text>;

  return (
    <Stack >
      {items.map((it, i) => (
        <Box key={i} p={3} borderWidth="1px" rounded="md">
          <HStack justify="space-between">
            <Text>
              a = {it.a}, n = {it.n} — {it.method === "euclid" ? "Euclide étendu" : "Brute force"}
            </Text>
            <Badge colorPalette={it.result !== null ? "green" : "red"}>
              {it.result !== null ? `inverse = ${it.result}` : "pas d’inverse"}
            </Badge>
          </HStack>
          <Text fontSize="sm" color="fg.muted">gcd = {it.gcd} — {new Date(it.at).toLocaleString()}</Text>
        </Box>
      ))}
    </Stack>
  );
};
