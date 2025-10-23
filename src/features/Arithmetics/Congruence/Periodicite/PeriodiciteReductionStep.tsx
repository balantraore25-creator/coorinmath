import { Stack, Text, HStack, Input, Button } from "@chakra-ui/react"

export function PeriodiciteReductionStep({
  p, k0, lambda, proposedPPrime, setProposedPPrime, onValidate
}: {
  p: number
  k0: number
  lambda: number
  proposedPPrime: string
  setProposedPPrime: (v: string) => void
  onValidate: () => void
}) {
  return (
    <Stack gap={4}>
      <Text>
        Pour p = {p}, si p &lt; {k0}, alors p′ = p. Sinon p′ = {k0} + (({p} − {k0}) mod {lambda}).
      </Text>
      <HStack>
        <Input
          placeholder="Propose p′"
          value={proposedPPrime}
          onChange={(e) => setProposedPPrime(e.target.value)}
          w="200px"
        />
        <Button onClick={onValidate}>Valider p′</Button>
      </HStack>
    </Stack>
  )
}
