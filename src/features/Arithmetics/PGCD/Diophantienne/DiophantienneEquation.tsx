import { useState } from "react";
import {
  VStack,
  Heading,
  HStack,
  Text,
  NumberInput,
  Separator,
} from "@chakra-ui/react";

import { EuclideStep } from "./EuclideStep";
import { DivisibiliteStep } from "./DivisibiliteStep";
import { SimplificationStep } from "./SimplificationStep";
import { SolutionStep } from "./SolutionStep/SolutionStep";
//import { SolutionStep } from "./SolutioStep/SolutionStep";

export default function DiophantienneEquation() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const [pgcd, setPgcd] = useState<number | null>(null);
  const [step, setStep] = useState(0);

  return (
    <VStack align="stretch" gap={6}>
      <Heading size="md">Équation diophantienne ax + by = c</Heading>

      {/* Étape 0 : saisie des coefficients */}
      {step === 0 && (
        <VStack align="stretch" gap={4}>
          <Text>Entre les coefficients a, b, c :</Text>
          <HStack gap={4}>
            <NumberInput.Root
              value={a.toString()}
              onValueChange={(details) => setA(Number(details.value))}
            >
              <NumberInput.Input placeholder="a" />
              <NumberInput.Control>
                <NumberInput.DecrementTrigger />
                <NumberInput.IncrementTrigger />
              </NumberInput.Control>
            </NumberInput.Root>

            <NumberInput.Root
              value={b.toString()}
              onValueChange={(details) => setB(Number(details.value))}
            >
              <NumberInput.Input placeholder="b" />
              <NumberInput.Control>
                <NumberInput.DecrementTrigger />
                <NumberInput.IncrementTrigger />
              </NumberInput.Control>
            </NumberInput.Root>

            <NumberInput.Root
              value={c.toString()}
              onValueChange={(details) => setC(Number(details.value))}
            >
              <NumberInput.Input placeholder="c" />
              <NumberInput.Control>
                <NumberInput.DecrementTrigger />
                <NumberInput.IncrementTrigger />
              </NumberInput.Control>
            </NumberInput.Root>
          </HStack>

          <Text
            as="button"
            fontWeight="bold"
            color="blue.500"
            onClick={() => setStep(1)}
          >
            ➡️ Commencer la résolution
          </Text>
        </VStack>
      )}

      {/* Étape 1 : Algorithme d’Euclide */}
      {step === 1 && (
        <EuclideStep
          a={a}
          b={b}
          onValidated={(computedPgcd) => {
            setPgcd(computedPgcd);
            setStep(2);
          }}
        />
      )}

      {/* Étape 2 : Vérification de divisibilité */}
      {step === 2 && pgcd !== null && (
        <DivisibiliteStep
          pgcd={pgcd}
          c={c}
          onValidated={(ok) => ok && setStep(3)}
        />
      )}

      {/* Étape 3 : Simplification */}
      {step === 3 && pgcd !== null && (
        <SimplificationStep
          a={a}
          b={b}
          c={c}
          pgcd={pgcd}
          onValidated={(ok) => ok && setStep(4)}
        />
      )}

      {/* Étape 4 : Résolution finale */}
      {step === 4 && (
        <SolutionStep  a={a} b={b} c={c}  />
        // ✅ plus besoin de passer pgcd, il est géré en interne
      )}

      <Separator />
    </VStack>
  );
}
