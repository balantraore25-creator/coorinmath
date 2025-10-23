import { Grid, GridItem, Text } from "@chakra-ui/react";
import type { Step, BaseType } from "../types/operation";

type Props = {
  steps: Step[];
  base: BaseType;
  mode: "apprentissage" | "evaluation";
  proposed: string[];
};

const getPositionLabels = (length: number, base: BaseType): string[] => {
  if (base === 10) {
    return [
      "Unité",
      "Dizaine",
      "Centaine",
      "Millier",
      "Dizaine de mille",
      "Centaine de mille",
    ].slice(-length);
  }
  return Array.from({ length }, (_, i) => `Bit ${length - 1 - i}`);
};

export const ExplanationGrid: React.FC<Props> = ({ steps, base, mode, proposed }) => {
  const labels = getPositionLabels(steps.length, base);
  const isFullyValidated =
    mode === "apprentissage" ||
    (proposed.length === steps.length &&
      proposed.every((val, i) => val === steps[steps.length - 1 - i].resultDigit));

  if (!isFullyValidated) return null;

  return (
    <>
      <Text fontWeight="bold">🧠 Explication du calcul :</Text>
      <Grid templateColumns="180px 1fr" gap={2}>
        {steps.map((step, i) => {
          const label = labels[i];
          const { a, b, carryIn, sum, resultDigit, carryOut } = step;
          const explanation = `${a ?? "—"} + ${b ?? "—"}${carryIn ? ` + retenue ${carryIn}` : ""} = ${sum} → on écrit ${resultDigit}, on retient ${carryOut ?? 0}`;
          return (
            <>
              <GridItem fontWeight="bold">{label}</GridItem>
              <GridItem>{explanation}</GridItem>
            </>
          );
        })}
        {steps[0]?.carryOut && (
          <>
            <GridItem fontWeight="bold">Retenue finale</GridItem>
            <GridItem>Propagée : {steps[0].carryOut} → ajoutée à gauche du résultat</GridItem>
          </>
        )}
      </Grid>
    </>
  );
};
