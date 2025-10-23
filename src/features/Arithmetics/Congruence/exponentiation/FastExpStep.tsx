import { Stack, Text, HStack, Input, Separator, Tag } from "@chakra-ui/react"

export function FastExpStep({
  currentIndex, totalSteps, stepData,
  ansResult, ansBase, setAnsResult, setAnsBase, n
}: {
  currentIndex: number
  totalSteps: number
  stepData: { e: number; bit: number; base: number; result: number }
  ansResult: string
  ansBase: string
  setAnsResult: (v: string) => void
  setAnsBase: (v: string) => void
  n: number
}) {
  const binary = stepData.e.toString(2).padStart(8, "0")

  const expectedResult = stepData.bit === 1
    ? (stepData.result * stepData.base) % n
    : stepData.result

  const expectedBase = (stepData.base * stepData.base) % n

  const resultValid = Number(ansResult) === expectedResult
  const baseValid = Number(ansBase) === expectedBase

  return (
    <Stack gap={4}>
      <Text>Étape {currentIndex + 1} / {totalSteps}</Text>
      <Text>e = {stepData.e} (binaire : <Tag.Root variant="solid" colorPalette="blue"><Tag.Label>{binary}</Tag.Label></Tag.Root>)</Text>
      <Text>bit = {stepData.bit}, base = {stepData.base}, résultat = {stepData.result}</Text>
      <Separator />
      <HStack>
        <Input
          placeholder="Nouveau résultat"
          value={ansResult}
          onChange={(e) => setAnsResult(e.target.value)}
          w="200px"
          colorPalette={resultValid ? "green" : ansResult ? "red" : "gray"}
        />
        <Input
          placeholder="Nouvelle base"
          value={ansBase}
          onChange={(e) => setAnsBase(e.target.value)}
          w="200px"
          colorPalette={baseValid ? "green" : ansBase ? "red" : "gray"}
        />
      </HStack>
    </Stack>
  )
}
