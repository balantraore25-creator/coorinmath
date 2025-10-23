import { Grid, GridItem, Box, Text } from "@chakra-ui/react";
import type { Step, BaseType } from "../types/operation";

type Props = {
  base: BaseType;
  mode: "apprentissage" | "evaluation";
  steps: Step[];
  digitsA: string[];
  digitsB: string[];
  resultDigits: string[];
  proposedResult: string[];
  validation: boolean[];
  onProposedChange: (r: string[]) => void;
};

function pad<T>(arr: T[], length: number, filler: T): T[] {
  return Array(Math.max(0, length - arr.length)).fill(filler).concat(arr);
}

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

export const OperationTable: React.FC<Props> = ({
  base,
  mode,
  steps,
  digitsA,
  digitsB,
  resultDigits,
  proposedResult,
  validation,
  onProposedChange,
}) => {
  const maxLength = steps.length;
  const paddedA = pad(digitsA, maxLength, "0");
  const paddedB = pad(digitsB, maxLength, "0");
  const paddedResult = pad(resultDigits, maxLength, "0");
  const paddedProposed = pad(proposedResult, maxLength, "");
  const paddedValidation = pad(validation, maxLength, false);
  const labels = getPositionLabels(maxLength, base);

  const renderRow = (
    label: string,
    values: string[],
    editable = false,
    validation?: boolean[]
  ) => (
    <>
      <GridItem><Text fontWeight="bold">{label}</Text></GridItem>
      {values.map((val, i) => {
        const isValid = validation?.[i];
        const showFeedback = mode === "apprentissage";
        const bg = showFeedback
          ? isValid === true
            ? "green.50"
            : isValid === false
            ? "red.50"
            : "white"
          : "white";
        const border = showFeedback
          ? isValid === true
            ? "green.400"
            : isValid === false
            ? "red.400"
            : "gray.200"
          : "gray.200";

        return (
          <GridItem
            key={i}
            textAlign="center"
            px={2}
            py={1}
            borderWidth="1px"
            borderColor={border}
            bg={bg}
            borderRadius="md"
          >
            {editable ? (
              <input
                value={val}
                placeholder="Propose ta réponse"
                onChange={(e) => {
                  const updated = [...proposedResult];
                  updated[i] = e.target.value.toUpperCase();
                  onProposedChange(updated);
                }}
                style={{
                  width: "100%",
                  textAlign: "center",
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  color: val ? "inherit" : "gray",
                  fontStyle: val ? "normal" : "italic",
                }}
              />
            ) : (
              <>
                {val}
                {showFeedback && isValid !== undefined && (
                  <Box as="span" ml={1}>
                    {isValid ? "✅" : "❌"}
                  </Box>
                )}
              </>
            )}
          </GridItem>
        );
      })}
    </>
  );

  return (
    <Grid templateColumns={`120px repeat(${maxLength}, 1fr)`} gap={2}>
      {renderRow("A", paddedA)}
      {renderRow("B", paddedB)}
      {mode === "apprentissage" && renderRow("Résultat", paddedResult)}
      {mode === "evaluation" && validation.every(Boolean) && renderRow("Résultat", paddedResult)}
      {renderRow("Validation", paddedProposed, mode === "evaluation", paddedValidation)}
      {renderRow("Position", labels)}
    </Grid>
  );
};
