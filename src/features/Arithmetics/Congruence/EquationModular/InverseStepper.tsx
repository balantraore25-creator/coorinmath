import  { useState, useMemo } from "react";
import { Stack, Text, Input, Button, Alert, Tag } from "@chakra-ui/react";
import { mod, egcd, modInverse } from "./utils";
import type { EquationProps } from "./EquationProps";

export default function InverseStepper({ a, b, n }: EquationProps) {
  const [invProposed, setInvProposed] = useState("");
  const [solutions, setSolutions] = useState<number[]>([]);
  const [step, setStep] = useState(0);

  const d = useMemo(() => egcd(a, n)[0], [a, n]);
  const invA = useMemo(() => modInverse(a, n), [a, n]);
  const x0 = invA !== undefined ? mod(invA * b, n) : undefined;

  return (
    <Stack gap={4}>
      {step === 0 && (
        <>
          <Text>PGCD(a, n) = {d}</Text>
          {d !== 1 ? (
            <Tag.Root colorPalette="red"><Tag.Label>Pas de solution</Tag.Label></Tag.Root>
          ) : (
            <Button onClick={() => setStep(1)}>Continuer</Button>
          )}
        </>
      )}
      {step === 1 && invA !== undefined && (
        <>
          <Text>Propose l'inverse de a mod n :</Text>
          <Input value={invProposed} onChange={(e) => setInvProposed(e.target.value)} />
          <Button onClick={() => {
            if (Number(invProposed) === invA) setStep(2);
          }}>Valider</Button>
        </>
      )}
      {step === 2 && (
        <>
          <Text>Solution particulière : x₀ = {x0}</Text>
          <Button onClick={() => {
            const sols = [];
            for (let t = 0; t < n; t++) {
              if (mod(a * t, n) === mod(b, n)) sols.push(t);
            }
            setSolutions(sols);
            setStep(3);
          }}>Voir solutions</Button>
        </>
      )}
      {step === 3 && (
        <Alert.Root status="success" variant="subtle">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Solutions</Alert.Title>
            <Alert.Description>
              x ≡ {solutions.join(", ")} (mod {n})
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}
    </Stack>
  );
}
