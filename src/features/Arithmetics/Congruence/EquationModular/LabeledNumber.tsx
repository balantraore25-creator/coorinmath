
import { VStack, Text, NumberInput } from "@chakra-ui/react";

interface LabeledNumberProps {
  label: string;                 // Libellé affiché au-dessus du champ
  value: number;                  // Valeur actuelle
  onChange: (v: number) => void;  // Callback quand la valeur change
  min?: number;                   // Valeur minimale autorisée
}

export default function LabeledNumber({ label, value, onChange, min }: LabeledNumberProps) {
  return (
    <VStack align="start">
      <Text>{label}</Text>
      <NumberInput.Root
        value={value.toString()}
        min={min ?? Number.NEGATIVE_INFINITY}
        onValueChange={(details) => {
          const num = Number(details.value);
          if (!Number.isNaN(num)) {
            onChange(num);
          }
        }}
        w="140px"
      >
        <NumberInput.Input />
        <NumberInput.Control />
      </NumberInput.Root>
    </VStack>
  );
}
