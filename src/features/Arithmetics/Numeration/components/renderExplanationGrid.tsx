import React from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import type { Step } from "../types/operation"; // ou le bon chemin
import type { BaseType } from "../types/operation";

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

export const renderExplanationGrid = (
  steps: Step[],
  base: BaseType
): React.ReactElement => {
  const labels = getPositionLabels(steps.length, base);
  const finalCarry = steps[0]?.carryOut ?? null;

  return (
    <Grid templateColumns="150px 1fr" gap={2}>
      {steps.map((step, i) => (
        <>
          <GridItem fontWeight="bold">{labels[i]}</GridItem>
          <GridItem>{step.explanation}</GridItem>
        </>
      ))}
      {finalCarry && (
        <>
          <GridItem fontWeight="bold">Retenue finale</GridItem>
          <GridItem>
            Propagée : {finalCarry} → ajoutée à gauche du résultat
          </GridItem>
        </>
      )}
    </Grid>
  );
};
