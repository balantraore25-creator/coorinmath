import { Box, Text, Code, Field, Select, Portal, createListCollection } from "@chakra-ui/react";
import type { ClassModuloProps } from "./EquationProps";

export default function DivisionEuclidienneStepper({ modulo, values, setValues }: ClassModuloProps) {
  const getClassCollection = (n: number) =>
    createListCollection({
      items: Array.from({ length: n }, (_, r) => ({
        label: `Classe ${r}`,
        value: `${r}`,
      })),
    });

  return (
    <Box>
      <Text mb="4">Méthode 1 : Division euclidienne — trouve le reste de a ÷ n.</Text>
      {values.map((item, i) => (
        <Box key={i} p="4" borderWidth="1px" borderRadius="md" bg="gray.50" mb="3">
          <Text>Valeur : <Code>{item.value}</Code></Text>
          <Field.Root>
            <Field.Label>Classe mod {modulo}</Field.Label>
            <Select.Root
              collection={getClassCollection(modulo)}
              value={item.assignedClass ? [item.assignedClass] : []}
              onValueChange={(details) => {
                const copy = [...values];
                copy[i].assignedClass = details.value[0];
                setValues(copy);
              }}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Choisir une classe" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {getClassCollection(modulo).items.map((opt) => (
                      <Select.Item key={opt.value} item={opt}>
                        {opt.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Field.Root>
        </Box>
      ))}
    </Box>
  );
}
