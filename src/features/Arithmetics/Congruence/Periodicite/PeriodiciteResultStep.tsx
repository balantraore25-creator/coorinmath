import { Stack, HStack, Button, Alert } from "@chakra-ui/react"
import { ModularCircleVisualizer } from "../Fermat/ModularCircleVisualizer" // adapte le chemin si nécessaire

export function PeriodiciteResultStep({
  p, n, finalValue, onBack, onReset
}: {
  p: number
  n: number
  finalValue: number
  onBack: () => void
  onReset: () => void
}) {

  return (
    <Stack gap={6}>
      <Alert.Root status="success" variant="subtle">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Résultat final</Alert.Title>
          <Alert.Description>
            Grâce à la périodicité, a^{p} mod {n} = {finalValue}
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>

      <ModularCircleVisualizer
        modulus={n}
        highlight={finalValue}
        label={`a^${p} ≡ ${finalValue} mod ${n}`}
      />

      <HStack>
        <Button onClick={onBack} variant="surface">Revoir la réduction</Button>
        <Button onClick={onReset} variant="outline">Nouvel exercice</Button>
      </HStack>
    </Stack>
  )
}
