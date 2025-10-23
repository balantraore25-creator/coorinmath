import { useState } from "react";
import { Stack, Text, Input, Button, Alert } from "@chakra-ui/react";
import { mod } from "./utils";
import type { EquationProps } from "./EquationProps";

export default function EssaisStepper({ a, b, n }: EquationProps) {
  // ...

  const [xProposed, setXProposed] = useState("");
  const [found, setFound] = useState(false);
  const [solutions, setSolutions] = useState<number[]>([]);

  const check = () => {
    const x = Number(xProposed);
    if (mod(a * x, n) === mod(b, n)) {
      const sols = [];
      for (let t = 0; t < n; t++) {
        if (mod(a * t, n) === mod(b, n)) sols.push(t);
      }
      setSolutions(sols);
      setFound(true);
    }
  };

  return (
    <Stack gap={4}>
      {!found ? (
        <>
          <Text>Propose une valeur de x :</Text>
          <Input value={xProposed} onChange={(e) => setXProposed(e.target.value)} />
          <Button onClick={check}>Valider</Button>
        </>
      ) : (
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
