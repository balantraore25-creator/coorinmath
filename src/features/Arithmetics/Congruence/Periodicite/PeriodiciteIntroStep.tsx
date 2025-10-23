import { Stack, HStack, Button } from "@chakra-ui/react"
import { LabeledNumber } from "../Fermat/LabeledNumber" // adapte le chemin si nécessaire

export function PeriodiciteIntroStep({
  a, n, p, setA, setN, setP, onStart
}: {
  a: number
  n: number
  p: number
  setA: (v: number) => void
  setN: (v: number) => void
  setP: (v: number) => void
  onStart: () => void
}) {
  return (
    <Stack gap={4}>
      <HStack>
        <LabeledNumber label="a" value={a} onChange={setA} min={0} />
        <LabeledNumber label="n" value={n} onChange={setN} min={2} />
        <LabeledNumber label="p" value={p} onChange={setP} min={0} />
      </HStack>
      <Button colorPalette="teal" onClick={onStart}>Commencer</Button>
    </Stack>
  )
}
