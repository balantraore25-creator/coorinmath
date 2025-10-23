import { HStack, Button, Text } from "@chakra-ui/react";
import type { FC } from "react";
import type { BaseType } from "../types/operation";

interface BaseSelectorProps {
  selectedBase: BaseType;
  onSelect: (base: BaseType) => void;
}

const bases: BaseType[] = [2, 8, 10, 16];

export const BaseSelector: FC<BaseSelectorProps> = ({ selectedBase, onSelect }) => {
  return (
    <HStack gap={3}>
      <Text fontWeight="bold">Base :</Text>
      {bases.map((base) => (
        <Button
          key={base}
          variant={base === selectedBase ? "solid" : "outline"}
          colorScheme="teal"
          onClick={() => onSelect(base)}
        >
          {`Base ${base}`}
        </Button>
      ))}
    </HStack>
  );
};





/*import {
  Text,
  Box,
  Stack,
  HStack,
  RadioGroup,
  For,
} from "@chakra-ui/react";
import type {  BaseType } from "../../../../types/operation";
import { baseOptions } from "./../types/operation";

export interface BaseSelectorProps {
  value: BaseType;
  onChange: (val: BaseType) => void;
}

export const BaseSelector: React.FC<BaseSelectorProps> = ({ value, onChange }) => {
  const variants = ["solid", "outline", "subtle"] as const;

  return (
    <Box>
      <Text fontWeight="bold" mb={2}>Base numérique</Text>

      <Stack gap="4">
        <For each={variants}>
          {(variant) => (
            <RadioGroup.Root
              key={variant}
              variant={variant}
              value={String(value)}
              onValueChange={(details) => {
                if (details.value !== null) {
                  onChange(Number(details.value) as BaseType);
                }
              }}
              colorPalette="teal"
              size="md"
            >
              <HStack gap="4">
                {baseOptions.map((base) => (
                  <RadioGroup.Item key={base} value={String(base)} minW="120px">
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText>{`Base ${base} (${variant})`}</RadioGroup.ItemText>
                  </RadioGroup.Item>
                ))}
              </HStack>
            </RadioGroup.Root>
          )}
        </For>
      </Stack>
    </Box>
  );
};*/




