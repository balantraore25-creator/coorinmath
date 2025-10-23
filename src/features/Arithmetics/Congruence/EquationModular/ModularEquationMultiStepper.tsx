import { useState } from "react";
import {
  Card, Heading, Stack, HStack, Select, Portal, createListCollection
} from "@chakra-ui/react";
import LabeledNumber from "./LabeledNumber";
import EssaisStepper from "./EssaisStepper";
import InverseStepper from "./InverseStepper";
import DiophantienneStepper from "./DiophantienneStepper";

const methods = createListCollection({
  items: [
    { label: "Méthode par essais", value: "essais" },
    { label: "Méthode de l'inverse", value: "inverse" },
    { label: "Méthode diophantienne", value: "diophantienne" },
  ],
});

export default function ModularEquationMultiStepper() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const [n, setN] = useState(7);

  // State en string[] pour Select.Root
  const [method, setMethod] = useState<string[]>(["essais"]);

  return (
    <Card.Root size="lg" variant="elevated">
      <Card.Header>
        <Heading size="md">Résoudre a·x ≡ b (mod n)</Heading>
      </Card.Header>
      <Card.Body>
        <Stack gap={4}>
          <HStack>
            <LabeledNumber label="a" value={a} onChange={setA} />
            <LabeledNumber label="b" value={b} onChange={setB} />
            <LabeledNumber label="n" value={n} onChange={setN} min={1} />
          </HStack>

          <Select.Root
            collection={methods}
            value={method}
            onValueChange={(details) => setMethod(details.value)}
            size="md"
            width="320px"
          >
            <Select.HiddenSelect />
            <Select.Label>Choisir une méthode</Select.Label>
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Sélectionner" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {methods.items.map((m) => (
                    <Select.Item item={m} key={m.value}>
                      {m.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          {method[0] === "essais" && <EssaisStepper a={a} b={b} n={n} />}
          {method[0] === "inverse" && <InverseStepper a={a} b={b} n={n} />}
          {method[0] === "diophantienne" && <DiophantienneStepper a={a} b={b} n={n} />}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
