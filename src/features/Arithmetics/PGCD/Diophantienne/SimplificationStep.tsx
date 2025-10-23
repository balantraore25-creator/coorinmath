import { VStack, Text, Code } from "@chakra-ui/react";
import { ValidatedInput } from "./ValidatedInput";
import { useState } from "react";

interface Props {
  a: number;
  b: number;
  c: number;
  pgcd: number;
  onValidated: (ok: boolean) => void;
}

export const SimplificationStep = ({ a, b, c, pgcd, onValidated }: Props) => {
  const expected = {
    a: a / pgcd,
    b: b / pgcd,
    c: c / pgcd,
  };

  const [validations, setValidations] = useState({
    a: false,
    b: false,
    c: false,
  });

  const handleSuccess = (key: keyof typeof validations) => {
    setValidations((prev) => {
      const updated = { ...prev, [key]: true };
      if (Object.values(updated).every(Boolean)) {
        onValidated(true);
      }
      return updated;
    });
  };

  return (
    <VStack align="stretch" gap={4}>
      <Text>
        Divise chaque coefficient par <Code>{pgcd}</Code> :
      </Text>
      <ValidatedInput
        label={`a ÷ ${pgcd}`}
        expected={expected.a}
        onSuccess={() => handleSuccess("a")}
      />
      <ValidatedInput
        label={`b ÷ ${pgcd}`}
        expected={expected.b}
        onSuccess={() => handleSuccess("b")}
      />
      <ValidatedInput
        label={`c ÷ ${pgcd}`}
        expected={expected.c}
        onSuccess={() => handleSuccess("c")}
      />
    </VStack>
  );
};
