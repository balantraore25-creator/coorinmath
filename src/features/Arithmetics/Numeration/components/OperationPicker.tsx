import { HStack, Button, Text } from "@chakra-ui/react";
import type { FC } from "react";
import type { OperationType } from "../types/operation";

interface OperationPickerProps {
  selected: OperationType;
  onSelect: (op: OperationType) => void;
}

const operations: { label: string; value: OperationType }[] = [
  { label: "➕ Addition", value: "addition" },
  { label: "➖ Soustraction", value: "soustraction" },
  { label: "✖ Multiplication", value: "multiplication" },
];

export const OperationPicker: FC<OperationPickerProps> = ({ selected, onSelect }) => {
  return (
    <HStack gap={3}>
      <Text fontWeight="bold">Opération :</Text>
      {operations.map(({ label, value }) => (
        <Button
          key={value}
          variant={value === selected ? "solid" : "outline"}
          colorScheme="orange"
          onClick={() => onSelect(value)}
        >
          {label}
        </Button>
      ))}
    </HStack>
  );
};
