import { Stack, HStack, Button } from "@chakra-ui/react"
import { LabeledNumber } from "../Fermat/LabeledNumber"

export function FastExpIntroStep({
  a, p, n, setA, setP, setN, onStart
}: {
  a: number
  p: number
  n: number
  setA: (v: number) => void
  setP: (v: number) => void
  setN: (v: number) => void
  onStart: () => void
}) {
  return (
    <Stack gap={4}>
      <HStack>
        <LabeledNumber label="a" value={a} onChange={setA} min={0} />
        <LabeledNumber label="p" value={p} onChange={setP} min={0} />
        <LabeledNumber label="n" value={n} onChange={setN} min={2} />
      </HStack>
      <Button colorPalette="teal" onClick={onStart}>Commencer</Button>
    </Stack>
  )
}
