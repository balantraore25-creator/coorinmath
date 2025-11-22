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

export default function RotationOrigin() {
  const [z, setZ] = useState<Complex>({ re: 1, im: 1 });
  const [theta, setTheta] = useState<number>(Math.PI / 2); // 90°

  const eitheta: Complex = { re: Math.cos(theta), im: Math.sin(theta) };

  const fz: Complex = {
    re: eitheta.re * z.re - eitheta.im * z.im,
    im: eitheta.re * z.im + eitheta.im * z.re,
  };

  return (
    <Flex direction="column" align="center" gap={6}>
      <Box p={6} borderWidth="1px" borderRadius="lg" shadow="md" w="md">
        <Heading size="md" mb={6} textAlign="center">
          Rotation autour de l’origine
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
            <Field.Label>θ (radians)</Field.Label>
            <Input
              type="number"
              value={theta}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTheta(parseFloat(e.target.value))
              }
            />
          </Field.Root>
        </VStack>

        <Box mt={6} textAlign="center">
          <Text>f(z) = e^(iθ) · z</Text>
          <Text>θ = {theta} rad</Text>
          <Text>
            z = {z.re} + {z.im}i
          </Text>
          <Text fontWeight="bold">
            f(z) = {fz.re.toFixed(2)} + {fz.im.toFixed(2)}i
          </Text>
        </Box>
      </Box>

      <ComplexPlanePanZoom
        z={z}
        fz={fz}
        label="Rotation f(z) = e^(iθ)·z"
        showGrid
        showProjections
      />
    </Flex>
  );
}
