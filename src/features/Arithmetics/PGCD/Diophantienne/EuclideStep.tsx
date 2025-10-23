import { useState } from "react";
import {
  VStack,
  Text,
  Input,
  Button,
  Code,
  HStack,
  Separator,
} from "@chakra-ui/react";

interface Props {
  a: number;
  b: number;
  onValidated: (gcd: number) => void;
}

interface Step {
  a: number;
  b: number;
  q?: number;
  r?: number;
  valid?: boolean;
}

export const EuclideStep = ({ a, b, onValidated }: Props) => {
  const [steps, setSteps] = useState<Step[]>([{ a, b }]);
  const [qInput, setQInput] = useState("");
  const [rInput, setRInput] = useState("");
  const [feedback, setFeedback] = useState("");

  const current = steps[steps.length - 1];

  const validateStep = () => {
    const q = parseInt(qInput);
    const r = parseInt(rInput);
    const expectedR = current.a % current.b;
    const expectedQ = Math.floor(current.a / current.b);

    if (q === expectedQ && r === expectedR) {
      setFeedback("✅ Bonne division !");
      const nextStep = { a: current.b, b: r };
      setSteps([...steps.slice(0, -1), { ...current, q, r, valid: true }, nextStep]);
      setQInput("");
      setRInput("");
      if (r === 0) {
        onValidated(current.b); // PGCD trouvé
      }
    } else {
      setFeedback("❌ Vérifie ton quotient et ton reste.");
    }
  };

  return (
    <VStack align="stretch" gap={4}>
      <Text>Applique l’algorithme d’Euclide :</Text>

      {steps.map((step, index) => (
        <VStack key={index} align="stretch" gap={2}>
          <Text>
            {step.valid ? (
              <Code>{`${step.a} = ${step.q} × ${step.b} + ${step.r}`}</Code>
            ) : (
              <Code>{`${step.a} = q × ${step.b} + r`}</Code>
            )}
          </Text>
          {!step.valid && index === steps.length - 1 && (
            <HStack gap={2}>
              <Input
                placeholder="q"
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
              />
              <Input
                placeholder="r"
                value={rInput}
                onChange={(e) => setRInput(e.target.value)}
              />
              <Button onClick={validateStep} colorScheme="blue">
                Valider
              </Button>
            </HStack>
          )}
        </VStack>
      ))}

      <Separator />
      <Text>{feedback}</Text>
    </VStack>
  );
};
