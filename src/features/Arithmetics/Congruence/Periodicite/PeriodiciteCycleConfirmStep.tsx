import { Stack, HStack, Button } from "@chakra-ui/react"
import { LabeledNumber } from "../Fermat/LabeledNumber"
import { CycleTag } from "./CycleTag"

export function PeriodiciteCycleConfirmStep({
  sequence, k0, lambda, proposedK0, proposedLambda, setProposedK0, setProposedLambda, onConfirm
}: {
  sequence: { k: number; value: number }[]
  k0?: number
  lambda?: number
  proposedK0: string
  proposedLambda: string
  setProposedK0: (v: string) => void
  setProposedLambda: (v: string) => void
  onConfirm: (k0: number, lambda: number) => void
}) {
  return (
    <Stack gap={4}>
      <HStack>
        <LabeledNumber label="k₀" value={Number(proposedK0)} onChange={(v) => setProposedK0(String(v))} min={0} />
        <LabeledNumber label="λ" value={Number(proposedLambda)} onChange={(v) => setProposedLambda(String(v))} min={1} />
        <Button onClick={() => onConfirm(Number(proposedK0), Number(proposedLambda))}>Valider</Button>
      </HStack>
      <HStack wrap="wrap" gap={2}>
        {sequence.map(s => (
          <CycleTag key={s.k} {...s} k0={k0} lambda={lambda} />
        ))}
      </HStack>
    </Stack>
  )
}
