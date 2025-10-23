import { VStack, Text, List } from "@chakra-ui/react";
import { LuCircleCheck, LuCircleDashed } from "react-icons/lu";
import type { FC } from "react";
import type { OperationStep } from "../types/operation";

interface FeedbackPanelProps {
  steps: OperationStep[];
  base: number;
}

export const FeedbackPanel: FC<FeedbackPanelProps> = ({ steps, base }) => {
  const errors = steps
    .map((step, i) =>
      !step.isValid
        ? `Colonne ${steps.length - 1 - i} : ${step.explanation}`
        : null
    )
    .filter(Boolean);

  const validDigits = [...Array(base).keys()].map((n) =>
    n.toString(base).toUpperCase()
  );

  return (
    <VStack align="start" gap={4}>
      <Text fontWeight="bold">Explication du calcul :</Text>

      <List.Root gap="2" variant="plain" align="start">
        {steps.map((step, i) => (
          <List.Item key={i}>
            <List.Indicator asChild color={step.isValid ? "green.500" : "red.500"}>
              {step.isValid ? <LuCircleCheck /> : <LuCircleDashed />}
            </List.Indicator>
            <Text fontSize="sm">{step.explanation}</Text>
          </List.Item>
        ))}
      </List.Root>

      <Text fontWeight="bold" mt={4}>
        Base utilisée : {base}
      </Text>
      <Text fontSize="sm">Chiffres valides : {validDigits.join(", ")}</Text>

      {errors.length > 0 && (
        <>
          <Text fontWeight="bold" mt={4}>
            Erreurs détectées :
          </Text>
          <List.Root gap="2" variant="plain" align="start">
            {errors.map((err, i) => (
              <List.Item key={i}>
                <List.Indicator asChild color="red.500">
                  <LuCircleDashed />
                </List.Indicator>
                <Text fontSize="sm">{err}</Text>
              </List.Item>
            ))}
          </List.Root>
        </>
      )}
    </VStack>
  );
};
