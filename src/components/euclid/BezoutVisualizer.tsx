// components/euclid/BezoutVisualizer.tsx
import { Box, HStack, Kbd, Stack, Text } from "@chakra-ui/react";

type Props = { s: number; t: number; n: number; a: number; gcd: number };

export const BezoutVisualizer = ({ s, t, n, a, gcd }: Props) => {
  return (
    <Box p={3} borderWidth="1px" rounded="md">
      <Text fontWeight="bold" mb={1}>Visualisation de Bézout</Text>
      <Text>
        s·n + t·a = gcd(n, a) → <Kbd>{s}</Kbd>×<Kbd>{n}</Kbd> + <Kbd>{t}</Kbd>×<Kbd>{a}</Kbd> = <Kbd>{gcd}</Kbd>
      </Text>
      <HStack mt={2} >
        <Stack>
          <Text fontSize="sm" color="fg.muted">Coefficient sur n</Text>
          <Kbd>{s}</Kbd>
        </Stack>
        <Stack>
          <Text fontSize="sm" color="fg.muted">Coefficient sur a</Text>
          <Kbd>{t}</Kbd>
        </Stack>
      </HStack>
    </Box>
  );
};
