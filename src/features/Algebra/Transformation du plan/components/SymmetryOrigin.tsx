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

export default function SymmetryOrigin() {
  const [z, setZ] = useState<Complex>({ re: 2, im: -3 });

  const fz: Complex = { re: -z.re, im: -z.im };

  return (
    <Flex direction="column" align="center" gap={6}>
      <Box p={6} borderWidth="1px" borderRadius="lg" shadow="md" w="md">
        <Heading size="md" mb={6} textAlign="center">
          Symétrie par rapport à l’origine
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
        </VStack>

        <Box mt={6} textAlign="center">
          <Text>f(z) = -z</Text>
          <Text>
            z = {z.re} + {z.im}i
          </Text>
          <Text fontWeight="bold">
            f(z) = {fz.re} + {fz.im}i
          </Text>
        </Box>
      </Box>

      <ComplexPlanePanZoom
        z={z}
        fz={fz}
        label="Symétrie f(z) = -z"
        showGrid
        showProjections
      />
    </Flex>
  );
}
