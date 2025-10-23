import {
  VStack,
  HStack,
  Text,
  NumberInput,
} from "@chakra-ui/react";
import * as React from "react";

export type EuclideStep = {
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
};

type EuclideanTrailProps = {
  a: number;
  b: number;
  onValidatedSteps: (steps: EuclideStep[], gcd: number) => void;
};

export const EuclideanTrail: React.FC<EuclideanTrailProps> = ({ a, b, onValidatedSteps }) => {
  const [steps, setSteps] = React.useState<EuclideStep[]>([]);
  const [done, setDone] = React.useState(false);
  const [limit, setLimit] = React.useState("10"); // exemple d’usage NumberInputRoot

  const computeSteps = () => {
    let x = a, y = b;
    const s: EuclideStep[] = [];
    while (y !== 0) {
      const q = Math.floor(x / y);
      const r = x % y;
      s.push({ dividend: x, divisor: y, quotient: q, remainder: r });
      x = y;
      y = r;
    }
    setSteps(s);
    setDone(true);
    onValidatedSteps(s, x);
  };

  return (
    <VStack gap={3}>
      <Text>Algorithme d’Euclide pour {a} et {b}</Text>

      {/* Exemple d’utilisation de NumberInputRoot */}
      <NumberInput.Root
        value={limit}
        onValueChange={(e) => setLimit(e.value)}
        min={1}
        max={100}
        step={1}
        width="120px"
      >
        <NumberInput.Input />
        <NumberInput.Control>
          <NumberInput.DecrementTrigger />
          <NumberInput.IncrementTrigger />
        </NumberInput.Control>
      </NumberInput.Root>

      {!done && <button onClick={computeSteps}>Lancer la descente</button>}

      {done && steps.map((st, i) => (
        <HStack key={i}>
          <Text>
            {st.dividend} = {st.divisor} × {st.quotient} + {st.remainder}
          </Text>
        </HStack>
      ))}
    </VStack>
  );
};
