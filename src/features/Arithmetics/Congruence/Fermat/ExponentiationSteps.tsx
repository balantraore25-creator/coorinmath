import { useMemo } from "react"
import { Stack, Text } from "@chakra-ui/react"

interface Step {
  step: number
  b: number
  e: number
  r: number
}

interface ExponentiationStepsProps {
  base: number
  exp: number
  mod: number
}

export function ExponentiationSteps({ base, exp, mod }: ExponentiationStepsProps) {
  const steps: Step[] = useMemo(() => {
    const result: Step[] = []
    let r = 1
    let b = base % mod
    let e = exp
    let i = 0
    while (e > 0) {
      if (e % 2 === 1) r = (r * b) % mod
      result.push({ step: i + 1, b, e, r })
      e = Math.floor(e / 2)
      b = (b * b) % mod
      i++
    }
    return result
  }, [base, exp, mod])

  return (
    <Stack gap={2}>
      <Text fontWeight="bold">Étapes de l’exponentiation modulaire</Text>
      {steps.map(({ step, b, e, r }) => (
        <Text key={step} fontSize="sm">
          Étape {step} : b = {b}, e = {e}, r = {r}
        </Text>
      ))}
    </Stack>
  )
}
