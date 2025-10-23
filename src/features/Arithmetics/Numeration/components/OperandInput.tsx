"use client";

import { Field, Input } from "@chakra-ui/react";
import type { FC, ChangeEvent } from "react";

type OperandInputProps = {
  label: string;
  value: string;
  base: 2 | 8 | 10 | 16;
  onChange: (val: string) => void;
};

export const OperandInput: FC<OperandInputProps> = ({
  label,
  value,
  base,
  onChange,
}) => {
  // Vérifie si un caractère est valide pour la base choisie
  const isValidChar = (char: string): boolean => {
    const regex: Record<2 | 8 | 10 | 16, RegExp> = {
      2: /^[01]$/,
      8: /^[0-7]$/,
      10: /^[0-9]$/,
      16: /^[0-9A-Fa-f]$/,
    };
    return regex[base].test(char);
  };

  // Filtre la saisie utilisateur pour ne garder que les caractères valides
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const filtered = e.target.value
      .toUpperCase()
      .split("")
      .filter(isValidChar)
      .join("");
    onChange(filtered);
  };

  return (
    <Field.Root orientation="vertical">
      <Field.Label fontWeight="bold">{label}</Field.Label>

      <Input
        value={value}
        onChange={handleChange}
        placeholder={`En base ${base}`}
        name={`operand-${label.toLowerCase()}`}
      />

      <Field.HelperText>
        Saisis un nombre valide en base {base}
      </Field.HelperText>
    </Field.Root>
  );
};
