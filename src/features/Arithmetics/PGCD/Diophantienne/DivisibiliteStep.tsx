import { VStack, Text, Code } from "@chakra-ui/react";
import { ValidatedInput } from "./ValidatedInput";

interface Props {
  pgcd: number;
  c: number;
  onValidated: (ok: boolean) => void;
}

export const DivisibiliteStep = ({ pgcd, c, onValidated }: Props) => {
  const expectedQuotient = c / pgcd;

  return (
    <VStack align="stretch" gap={4}>
      <Text>
        Vérifie si <Code>{c}</Code> est divisible par <Code>{pgcd}</Code>.
      </Text>
      <ValidatedInput
        label="Quel est le quotient ?"
        expected={expectedQuotient}
        onSuccess={() => onValidated(true)}
      />
    </VStack>
  );
};
