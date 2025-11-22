import { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  VStack,
  Text,
  Field,
  Input,
} from "@chakra-ui/react";
import ComplexPlanePanZoom from "./ComplexPlane";
import type { Complex } from "./ComplexPlane";

export default function HomothetyInteractive() {
  const [z, setZ] = useState<Complex>({ re: 2, im: 1 });
  const [a, setA] = useState<Complex>({ re: 1, im: 2 });
  const [k, setK] = useState<number>(2);

  const fz: Complex = {
    re: a.re + k * (z.re - a.re),
    im: a.im + k * (z.im - a.im),
  };

  return (
    <Flex direction="column" align="center" gap={6}>
      <Box p={6} borderWidth="1px" borderRadius="lg" shadow="md" w="md">
        <Heading size="md" mb={6} textAlign="center">
          Homothétie dans le plan complexe
        </Heading>

        <VStack gap={4} align="stretch">
          <Field.Root>
            <Field.Label>z.re</Field.Label>
            <Input
              type="number"
              value={z.re}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setZ({ ...z, re: parseFloat(e.target.value) })
              }
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>z.im</Field.Label>
            <Input
              type="number"
              value={z.im}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setZ({ ...z, im: parseFloat(e.target.value) })
              }
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>a.re</Field.Label>
            <Input
              type="number"
              value={a.re}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setA({ ...a, re: parseFloat(e.target.value) })
              }
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>a.im</Field.Label>
            <Input
              type="number"
              value={a.im}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setA({ ...a, im: parseFloat(e.target.value) })
              }
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>k</Field.Label>
            <Input
              type="number"
              value={k}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setK(parseFloat(e.target.value))
              }
            />
          </Field.Root>
        </VStack>

        <Box mt={6} textAlign="center">
          <Text>f(z) = a + k·(z - a)</Text>
          <Text>z = {z.re} + {z.im}i</Text>
          <Text>a = {a.re} + {a.im}i</Text>
          <Text>k = {k}</Text>
          <Text fontWeight="bold">
            f(z) = {fz.re.toFixed(2)} + {fz.im.toFixed(2)}i
          </Text>
        </Box>
      </Box>

      <ComplexPlanePanZoom
        z={z}
        fz={fz}
        a={a}
        label="Homothétie f(z) = a + k(z - a)"
        showGrid
        showProjections
      />
    </Flex>
  );
}
