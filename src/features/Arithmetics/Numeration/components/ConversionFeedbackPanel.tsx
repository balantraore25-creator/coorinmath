// src/features/Arithmetics/Numeration/components/ConversionFeedbackPanel.tsx
"use client";

import { VStack, Text, List } from "@chakra-ui/react";
import { LuCircleCheck, LuCircleDashed } from "react-icons/lu";
import type { FC } from "react";
import type { ConversionStep } from "../logic/conversionSteps";

interface ConversionFeedbackPanelProps {
  steps: ConversionStep[];
  checks?: boolean[]; // optional: per-column validation booleans to show a summary
}

export const ConversionFeedbackPanel: FC<ConversionFeedbackPanelProps> = ({
  steps,
  checks,
}) => {
  return (
    <VStack align="start" gap={4}>
      <Text fontWeight="bold">Explications de la conversion</Text>
      <List.Root gap="2" variant="plain" align="start">
        {steps.map((step, i) => (
          <List.Item key={i}>
            <List.Indicator asChild color="teal.500">
              <LuCircleDashed />
            </List.Indicator>
            <Text fontSize="sm">
              <b>{step.label}:</b> {step.detail}
            </Text>
          </List.Item>
        ))}
      </List.Root>

      {checks && (
        <>
          <Text fontWeight="bold">Validation par colonnes</Text>
          <List.Root gap="2" variant="plain" align="start">
            {checks.map((ok, i) => (
              <List.Item key={i}>
                <List.Indicator asChild color={ok ? "green.500" : "red.500"}>
                  {ok ? <LuCircleCheck /> : <LuCircleDashed />}
                </List.Indicator>
                <Text fontSize="sm">Colonne {i}: {ok ? "Correcte" : "À corriger"}</Text>
              </List.Item>
            ))}
          </List.Root>
        </>
      )}
    </VStack>
  );
};
