import { Box, Text, VStack, Code } from "@chakra-ui/react"
import { gcd } from "../math/number"

type Props = {
  a: number
  b: number
  n: number
}

export const GaussResolutionSteps = ({ a, b, n }: Props) => {
  const g = gcd(a, n)
  const divisible = b % g === 0

  if (g === 1 || !divisible) return null

  const a1 = a / g
  const b1 = b / g
  const n1 = n / g

  return (
    <Box p={4} borderWidth="1px" rounded="md">
      <Text fontWeight="bold" mb={2}>Étapes du théorème de Gauss</Text>
      <VStack align="start" gap={2}>
        <Text><Code>pgcd({a}, {n}) = {g}</Code> ⇒ il y a <Code>{g}</Code> solutions modulo <Code>{n}</Code></Text>
        <Text>On réduit l’équation : <Code>{a1}x ≡ {b1} (mod {n1})</Code></Text>
        <Text>On résout cette équation réduite, puis on génère les <Code>{g}</Code> solutions :</Text>
        <Text><Code>xₖ = x₀ + k·{n1} mod {n}</Code> pour <Code>k = 0, 1, ..., {g - 1}</Code></Text>
      </VStack>
    </Box>
  )
}
