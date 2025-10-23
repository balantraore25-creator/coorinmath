"use client";

import { useState } from "react";
import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  Alert,
} from "@chakra-ui/react";

interface Props {
  a: string;
  b: string;
}

export default function EuclideanDivisionPanelDirect({ a: aProp, b: bProp }: Props) {
  const a = parseInt(aProp);
  const b = parseInt(bProp);

  const expectedQ = Math.trunc(a / b);
  const expectedR = a - b * expectedQ;

  const [q, setQ] = useState("");
  const [r, setR] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [success, setSuccess] = useState(false);

  const handleValidate = () => {
    if (parseInt(q) === expectedQ && parseInt(r) === expectedR) {
      setSuccess(true);
    } else {
      setAttempts((prev) => prev + 1);
    }
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" shadow="md">
      <VStack align="stretch" gap={4}>
        {/* En-tête */}
        <Text fontWeight="bold" fontSize="lg">
          Mode direct
        </Text>
        <Text>
          a = {a}, b = {b}
        </Text>

        {/* Inputs élève */}
        <Text>Propose le quotient q et le reste r</Text>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="q"
          maxW="100px"
        />
        <Input
          value={r}
          onChange={(e) => setR(e.target.value)}
          placeholder="r"
          maxW="100px"
        />

        <Button colorScheme="blue" onClick={handleValidate}>
          Valider ma réponse
        </Button>

        {/* Feedback progressif */}
        {!success && attempts === 1 && (
          <Alert.Root status="warning" variant="subtle" borderRadius="md">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Essaie encore</Alert.Title>
              <Alert.Description>
                Vérifie que ton reste est bien positif et inférieur à |b|.
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        {!success && attempts === 2 && (
          <Alert.Root status="info" variant="subtle" borderRadius="md">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Indice</Alert.Title>
              <Alert.Description>
                Encadre {a} entre deux multiples de {b} : {b} × q ≤ {a} &lt; {b} × (q+1).
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        {!success && attempts >= 3 && (
          <Alert.Root status="error" variant="subtle" borderRadius="md">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Résultat attendu</Alert.Title>
              <Alert.Description>
                {a} = {b} × {expectedQ} + {expectedR}, avec 0 ≤ {expectedR} &lt; |{b}|
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        {success && (
          <Alert.Root status="success" variant="subtle" borderRadius="md">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Bravo 🎉</Alert.Title>
              <Alert.Description>
                Résultat correct : {a} = {b} × {expectedQ} + {expectedR}
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}
      </VStack>
    </Box>
  );
}
