import { useState } from "react";
import {
  Card, Heading, Stack, Field, Input, Select, Portal, createListCollection, Button
} from "@chakra-ui/react";
import { generateRandomValues } from "./utils";
import type { ClassModuloValue } from "./EquationProps";
import DivisionEuclidienneStepper from "./DivisionEuclidienneStepper";
import FormuleNormaliseeStepper from "./FormuleNormaliseeStepper";
import EquivalenceMultiplesStepper from "./EquivalenceMultiplesStepper";

const methods = createListCollection({
  items: [
    { label: "Division euclidienne", value: "division" },
    { label: "Formule normalisée", value: "formule" },
    { label: "Équivalence par multiples", value: "equivalence" },
  ],
});

export default function ClassModuloMultiStepper() {
  const [modulo, setModulo] = useState(5);
  const [values, setValues] = useState<ClassModuloValue[]>(generateRandomValues());
  const [method, setMethod] = useState<string[]>(["division"]);

  return (
    <Card.Root size="lg" variant="elevated">
      <Card.Header>
        <Heading size="md">Trouver la classe mod n</Heading>
      </Card.Header>
      <Card.Body>
        <Stack gap={4}>
          <Field.Root>
            <Field.Label>n ≥ 2</Field.Label>
            <Input type="number" value={modulo} onChange={(e) => setModulo(Number(e.target.value))} />
          </Field.Root>

          <Button onClick={() => setValues(generateRandomValues())}>Nouvelles valeurs</Button>

          <Select.Root
            collection={methods}
            value={method}
            onValueChange={(details) => setMethod(details.value)}
            size="md"
            width="320px"
          >
            <Select.HiddenSelect />
            <Select.Label>Méthode</Select.Label>
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

          {method[0] === "division" && (
            <DivisionEuclidienneStepper modulo={modulo} values={values} setValues={setValues} />
          )}
          {method[0] === "formule" && (
            <FormuleNormaliseeStepper modulo={modulo} values={values} setValues={setValues} />
          )}
          {method[0] === "equivalence" && (
            <EquivalenceMultiplesStepper modulo={modulo} values={values} setValues={setValues} />
          )}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
