import { Stack, Text, HStack, Input, Button, Separator } from "@chakra-ui/react"
import { CycleTag } from "./CycleTag"

export function PeriodiciteCycleStep({
  a, n, sequence, k0, lambda, answerNext, setAnswerNext, onValidate
}: {
  a: number
  n: number
  sequence: { k: number; value: number }[]
  k0?: number
  lambda?: number
  answerNext: string
  setAnswerNext: (v: string) => void
  onValidate: (v: number) => void
}) {
  const nextK = sequence[sequence.length - 1].k + 1
  return (
    <Stack gap={4}>
      <Text>Propose r_{nextK} = r_{nextK - 1} × {a} mod {n}</Text>
      <HStack>
        <Input value={answerNext} onChange={(e) => setAnswerNext(e.target.value)} w="200px" />
        <Button onClick={() => onValidate(Number(answerNext))}>Valider</Button>
      </HStack>
      <Separator />
      <HStack wrap="wrap" gap={2}>
        {sequence.map(s => (
          <CycleTag key={s.k} {...s} k0={k0} lambda={lambda} />
        ))}
      </HStack>
    </Stack>
  )
}
