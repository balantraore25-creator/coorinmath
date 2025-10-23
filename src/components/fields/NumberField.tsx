// components/fields/NumberField.tsx
import { Field, Input } from "@chakra-ui/react";

type NumberFieldProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  isInvalid?: boolean;
  error?: string;
  onChange: (value: number) => void;
};

export const NumberField = ({
  label,
  value,
  min,
  max,
  isInvalid,
  error,
  onChange,
}: NumberFieldProps) => {
  return (
    <Field.Root invalid={isInvalid}>
      <Field.Label>{label}</Field.Label>

      <Input
        type="number"
        value={Number.isNaN(value) ? "" : value}
        min={min}
        max={max}
        inputMode="numeric"
        onChange={(e) => onChange(Number(e.target.value))}
      />

      {error && <Field.ErrorText>{error}</Field.ErrorText>}
    </Field.Root>
  );
};
