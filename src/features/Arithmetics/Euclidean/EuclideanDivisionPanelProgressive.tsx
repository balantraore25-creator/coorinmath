"use client";

import { useState } from "react";
import {
  Box,
  VStack,
  Text,
  Input,
  Button,
} from "@chakra-ui/react";

interface Props {
  a: string;
  b: string;
}

export default function EuclideanDivisionPanelProgressive({ a: aProp, b: bProp }: Props) {
  // On garde seulement les valeurs, pas besoin de setters
  const [a] = useState(parseInt(aProp));
  const [b] = useState(parseInt(bProp));

  const expectedQ = Math.trunc(a / b);
  const expectedR = a - b * expectedQ;

  const [step, setStep] = useState(1);
  const [q, setQ] = useState("");
  const [r, setR] = useState("");
  const [conditionOk, setConditionOk] = useState(false);

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" shadow="md">
      <VStack align="stretch" gap={4}>
        <Text fontWeight="bold" fontSize="lg">
          Mode progressif
        </Text>
        <Text>
          a = {a}, b = {b}
        </Text>

        {/* Étape 1 : quotient */}
        {step === 1 && (
          <>
            <Text>1️⃣ Propose le quotient q</Text>
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              maxW="100px"
            />
            <Button
              colorScheme="blue"
              onClick={() =>
                parseInt(q) === expectedQ
                  ? setStep(2)
                  : alert("❌ Essaie encore : encadre a entre deux multiples de b")
              }
            >
              Valider q
            </Button>
          </>
        )}

        {/* Étape 2 : reste */}
        {step === 2 && (
          <>
            <Text>2️⃣ Calcule le reste r = a - bq</Text>
            <Input
              value={r}
              onChange={(e) => setR(e.target.value)}
              maxW="100px"
            />
            <Button
              colorScheme="blue"
              onClick={() =>
                parseInt(r) === expectedR
                  ? setStep(3)
                  : alert("❌ Essaie encore : r = a - bq")
              }
            >
              Valider r
            </Button>
          </>
        )}

        {/* Étape 3 : condition */}
        {step === 3 && (
          <>
            <Text>3️⃣ Vérifie la condition 0 ≤ r &lt; |b|</Text>
            <Button
              colorScheme="blue"
              onClick={() => {
                if (expectedR >= 0 && expectedR < Math.abs(b)) {
                  setConditionOk(true);
                  setStep(4);
                } else {
                  alert("❌ Condition non respectée");
                }
              }}
            >
              Valider la condition
            </Button>
          </>
        )}

        {/* Étape finale */}
        {step === 4 && (
          <>
            {conditionOk && (
              <Text fontWeight="bold" color="green.600">
                ✅ Condition validée : 0 ≤ {expectedR} &lt; |{b}|
              </Text>
            )}
            <Text fontWeight="bold" color="green.600">
              ✅ Bravo ! Résultat : {a} = {b} × {expectedQ} + {expectedR}
            </Text>
            <Box p={3} borderWidth={1} borderRadius="md" bg="gray.50">
              <Text fontWeight="bold">Méthode utilisée : encadrement</Text>
              <Text>
                On encadre {a} entre {b} × {expectedQ} = {b * expectedQ} et{" "}
                {b} × ({expectedQ}+1) = {b * (expectedQ + 1)}.
              </Text>
              <Text>
                Ainsi, q = {expectedQ} et r = {expectedR}, avec 0 ≤ r &lt; |b|.
              </Text>
            </Box>
          </>
        )}
      </VStack>
    </Box>
  );
}
