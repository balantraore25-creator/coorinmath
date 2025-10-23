import { Stack, HStack, Button, Alert, Text } from "@chakra-ui/react"
import { ModularCircleVisualizer } from "./ModularCircleVisualizer"

export function FastExpResultStep({
  a, p, n, finalValue, onBack, onReset
}: {
  a: number
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
            Par exponentiation rapide, {a}^{p} mod {n} = <strong>{finalValue}</strong>
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>

      <Text fontSize="sm" color="gray.600">
        Le calcul a suivi la décomposition binaire de {p} et a appliqué les multiplications conditionnelles selon les bits actifs. Le résultat final est mis en évidence sur le cercle modulaire ci-dessous.
      </Text>

      <ModularCircleVisualizer a={a} n={n} p={p} />

      <HStack>
        <Button onClick={onBack} variant="surface">Revoir les étapes</Button>
        <Button onClick={onReset} variant="outline">Nouvel exercice</Button>
      </HStack>
    </Stack>
  )
}
