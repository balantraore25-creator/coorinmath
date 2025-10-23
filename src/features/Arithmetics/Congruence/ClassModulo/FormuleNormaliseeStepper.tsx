import {
  Box, Button, Text, Stack, Code, Portal, Field, Select, createListCollection
} from '@chakra-ui/react';
import { useState } from 'react';
import type { ClassModuloProps } from './EquationProps';
import { mod } from './utils';

const ClassVisualizer = ({ values, modulo }: { values: number[]; modulo: number }) => (
  <Box mt="8">
    <Text fontWeight="bold" mb="2">Visualisation des classes :</Text>
    <Stack direction="row" flexWrap="wrap" gap="2">
      {values.map((value, i) => {
        const r = mod(value, modulo);
        const color = `hsl(${(r * 360) / modulo}, 70%, 60%)`;
        return (
          <Box
            key={i}
            p="2"
            borderRadius="full"
            bg={color}
            color="white"
            minW="40px"
            textAlign="center"
            fontWeight="bold"
            title={`Classe ${r}`}
          >
            {value}
          </Box>
        );
      })}
    </Stack>
  </Box>
);

export default function FormuleNormaliseeStepper({ modulo, values, setValues }: ClassModuloProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<string[]>([]);

  const getClassCollection = (n: number) =>
    createListCollection({
      items: Array.from({ length: n }, (_, r) => ({
        label: `Classe ${r}`,
        value: `${r}`,
      })),
    });

  const handleSelect = (selected: string) => {
    const copy = [...values];
    copy[currentIndex].assignedClass = selected;
    setValues(copy);
  };

  const handleNext = () => {
    if (currentIndex < values.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Fin du formulaire → vérification
      const results = values.map(({ value, assignedClass }) => {
        const expectedClass = mod(value, modulo);
        const assigned = Number(assignedClass);
        return assigned === expectedClass
          ? `✅ ${value} ∈ Classe ${assignedClass}`
          : `❌ ${value} ∉ Classe ${assignedClass} (devrait être Classe ${expectedClass})`;
      });
      setFeedback(results);
      setFinished(true);
    }
  };

  return (
    <Box>
      {/* Formule générale */}
      <Box p="4" mb="4" borderWidth="1px" borderRadius="md" bg="yellow.50">
        <Text fontWeight="bold" mb="2">
          Formule générale pour trouver la classe mod n :
        </Text>
        <Code p="2" display="block" whiteSpace="pre">
          ( (a mod n) + n ) mod n
        </Code>
        <Text fontSize="sm" color="gray.600" mt="2">
          Exemple : si a = -7 et n = 5 → (-7 mod 5 + 5) mod 5 = 3
        </Text>
      </Box>

      {!finished ? (
        <Stack gap="4">
          <Text>Valeur {currentIndex + 1} sur {values.length} :</Text>
          <Box p="4" borderWidth="1px" borderRadius="md" bg="gray.50">
            <Text mb="2">Valeur proposée : <Code>{values[currentIndex].value}</Code></Text>
            <Field.Root>
              <Field.Label>Classe mod {modulo}</Field.Label>
              <Select.Root
                collection={getClassCollection(modulo)}
                value={values[currentIndex].assignedClass ? [values[currentIndex].assignedClass] : []}
                onValueChange={(details) => handleSelect(details.value[0])}
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
          <Button
            onClick={handleNext}
            disabled={!values[currentIndex].assignedClass}
          >
            {currentIndex < values.length - 1 ? 'Suivant' : 'Terminer'}
          </Button>
        </Stack>
      ) : (
        <Box>
          <Text mb="4">Résultats :</Text>
          <Stack gap="3">
            {feedback.map((msg, i) => (
              <Text key={i} color={msg.startsWith('✅') ? 'green.600' : 'red.600'}>
                {msg}
              </Text>
            ))}
          </Stack>
          <ClassVisualizer
            values={values.map(v => v.value)}
            modulo={modulo}
          />
        </Box>
      )}
    </Box>
  );
}
