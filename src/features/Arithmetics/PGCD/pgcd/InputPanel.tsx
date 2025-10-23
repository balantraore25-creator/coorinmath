import React from "react";
import { VStack, Input } from "@chakra-ui/react";
import { Field } from "@chakra-ui/react";

export const InputPanel: React.FC<{
  a: number;
  b: number;
  setA: (n: number) => void;
  setB: (n: number) => void;
}> = ({ a, b, setA, setB }) => {
  const isValidInput = (n: number) => Number.isInteger(n) && n > 0;

  return (
    <VStack align="start" gap={4}>
      <Field.Root>
        <Field.Label htmlFor="input-a">A</Field.Label>
        <Input
          id="input-a"
          type="number"
          value={a}
          onChange={(e) => setA(Number(e.target.value))}
          placeholder="Entier A"
          variant="outline"
          css={{
            "--focus-color": isValidInput(a)
              ? "var(--chakra-colors-teal-500)"
              : "var(--chakra-colors-red-500)"
          }}
        />
        <Field.HelperText>Entre un entier positif</Field.HelperText>
      </Field.Root>

      <Field.Root>
        <Field.Label htmlFor="input-b">B</Field.Label>
        <Input
          id="input-b"
          type="number"
          value={b}
          onChange={(e) => setB(Number(e.target.value))}
          placeholder="Entier B"
          variant="outline"
          css={{
            "--focus-color": isValidInput(b)
              ? "var(--chakra-colors-teal-500)"
              : "var(--chakra-colors-red-500)"
          }}
        />
        <Field.HelperText>Entre un entier positif</Field.HelperText>
      </Field.Root>
    </VStack>
  );
};
