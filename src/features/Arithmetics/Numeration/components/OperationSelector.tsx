"use client";

import {
  Select,
  createListCollection,
  Portal,
} from "@chakra-ui/react";
import type { OperationType } from "../types/operation";

type OperationSelectorProps = {
  value: OperationType;
  onChange: (operation: OperationType) => void;
};

const operations = createListCollection({
  items: [
    { label: "➕ Addition", value: "addition" },
    { label: "➖ Soustraction", value: "soustraction" },
    { label: "✖️ Multiplication", value: "multiplication" },
  ],
});

export const OperationSelector: React.FC<OperationSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <Select.Root
      collection={operations}
      value={[value]} // ✅ string[] attendu
      onValueChange={(e) => {
        const selected = Array.isArray(e.value) ? e.value[0] : e.value;
        if (
          selected === "addition" ||
          selected === "soustraction" ||
          selected === "multiplication"
        ) {
          onChange(selected);
        }
      }}
      multiple={false} // ✅ sélection unique
      size="md"
      width="100%"
    >
      <Select.HiddenSelect name="operation" />
      <Select.Label fontWeight="bold">Opération</Select.Label>

      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Choisir une opération" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>

      <Portal>
        <Select.Positioner>
          <Select.Content>
            {operations.items.map((item) => (
              <Select.Item item={item} key={item.value}>
                {item.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};
