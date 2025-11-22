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

export default function RotationCenter() {
  const [z, setZ] = useState<Complex>({ re: 2, im: 0 });
  const [a, setA] = useState<Complex>({ re: 1, im: 1 });
  const [theta, setTheta] = useState<number>(Math.PI / 2); // 90°

  function rotate(z: Complex, a: Complex, theta: number): Complex {
    const dz: Complex = { re: z.re - a.re, im: z.im - a.im };
    const eitheta: Complex = { re: Math.cos(theta), im: Math.sin(theta) };

    const rotated: Complex = {
      re: eitheta.re * dz.re - eitheta.im * dz.im,
      im: eitheta.re * dz.im + eitheta.im * dz.re,
    };

    return { re: a.re + rotated.re, im: a.im + rotated.im };
  }

  const fz = rotate(z, a, theta);

  return (
    <Flex direction="column" align="center" gap={6}>
      <Box p={6} borderWidth="1px" borderRadius="lg" shadow="md" w="md">
        <Heading size="md" mb={6} textAlign="center">
          Rotation autour d’un centre
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
          <Text>f(z) = a + e^(iθ)(z - a)</Text>
          <Text>z = {z.re} + {z.im}i</Text>
          <Text>a = {a.re} + {a.im}i</Text>
          <Text>θ = {theta} rad</Text>
          <Text fontWeight="bold">
            f(z) = {fz.re.toFixed(2)} + {fz.im.toFixed(2)}i
          </Text>
        </Box>
      </Box>

      <ComplexPlanePanZoom
        z={z}
        fz={fz}
        a={a}
        label="Rotation f(z) = a + e^(iθ)(z - a)"
        showGrid
        showProjections
      />
    </Flex>
  );
}
