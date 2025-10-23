import { useState, useMemo } from "react";
import {
  Box,
  VStack,
  Separator,
  HStack,
  RadioGroup,
  Link
} from "@chakra-ui/react";
import { BaseSelector } from "./components/BaseSelector";
import { OperandInput } from "./components/OperandInput";
import { OperationPicker } from "./components/OperationPicker";
import { ResultInput } from "./components/ResultInput";
import { computeSteps } from "./logic/computeSteps";
import { ExplanationGrid } from "./components/ExplanationGrid";
import { OperationTable } from "./components/OperationTable";
import type { BaseType, OperationType, Step } from "./types/operation";

type Mode = "apprentissage" | "evaluation";

export const MultiBaseOperationSimulator: React.FC = () => {
  const [base, setBase] = useState<BaseType>(10);
  const [operation, setOperation] = useState<OperationType>("addition");
  const [valueA, setValueA] = useState("");
  const [valueB, setValueB] = useState("");
  const [proposedResult, setProposedResult] = useState<string[]>([]);
  const [mode, setMode] = useState<Mode>("apprentissage");

  const digitsA = useMemo(() => valueA.split("").map((c) => c.toUpperCase()), [valueA]);
  const digitsB = useMemo(() => valueB.split("").map((c) => c.toUpperCase()), [valueB]);

  const steps: Step[] = useMemo(() => {
    return digitsA.length > 0 && digitsB.length > 0
      ? computeSteps(base, digitsA, digitsB, operation)
      : [];
  }, [base, digitsA, digitsB, operation]);

  const resultDigits = useMemo(() => steps.map((s) => s.resultDigit).reverse(), [steps]);

  const validation = useMemo(() => {
    return proposedResult.length > 0
      ? resultDigits.map((expected, i) => {
          const proposed = proposedResult[i]?.toUpperCase() ?? "";
          return expected === proposed;
        })
      : [];
  }, [proposedResult, resultDigits]);

  return (
    <Box p={6} borderWidth={1} borderRadius="lg" shadow="md">
       <Link
              href="/dash/courses/numeration"
              color="teal.500"
              fontWeight="medium"
              mb={4}
              display="inline-block"
            >
              ← Retour à la page précédente
            </Link>
      <VStack align="stretch" gap={6}>
        <RadioGroup.Root value={mode} onValueChange={(details) => setMode(details.value as Mode)}>
          <HStack>
            <RadioGroup.Item value="apprentissage">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Apprentissage</RadioGroup.ItemText>
            </RadioGroup.Item>
            <RadioGroup.Item value="evaluation">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Évaluation</RadioGroup.ItemText>
            </RadioGroup.Item>
          </HStack>
        </RadioGroup.Root>

        <BaseSelector selectedBase={base} onSelect={setBase} />
        <OperationPicker selected={operation} onSelect={setOperation} />
        <OperandInput label="A" base={base} value={valueA} onChange={setValueA} />
        <OperandInput label="B" base={base} value={valueB} onChange={setValueB} />

        <Separator />

        {steps.length > 0 && (
          <VStack align="start" gap={4}>
            <OperationTable
              base={base}
              mode={mode}
              steps={steps}
              digitsA={digitsA}
              digitsB={digitsB}
              resultDigits={resultDigits}
              proposedResult={proposedResult}
              validation={validation}
              onProposedChange={setProposedResult}
            />

            <ResultInput
              expected={resultDigits}
              proposed={proposedResult}
              onChange={setProposedResult}
              base={base}
              reverse={false}
            />

            <ExplanationGrid
              steps={steps}
              base={base}
              mode={mode}
              proposed={proposedResult}
            />
          </VStack>
        )}
      </VStack>
    </Box>
  );
};
