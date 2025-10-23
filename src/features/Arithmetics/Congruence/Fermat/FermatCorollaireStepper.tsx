import {
  Button,
  Card,
  HStack,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
  Progress,
  NumberInput,
  Alert,
  Link,
} from "@chakra-ui/react"
import { useState, useEffect, useMemo } from "react"
import { ExponentiationSteps } from "./ExponentiationSteps"
import { ModularCircleVisualizer } from "./ModularCircleVisualizer"
import { modPow } from "./modPow"

type Step = 0 | 1 | 2
interface Persisted {
  a: number
  p: number
  n: number
  pPrime?: number
  step: Step
}

const STORAGE_KEY = "fermat_corollaire_stepper_v3"

export default function FermatCorollaireStepper() {
  const [a, setA] = useState(2)
  const [p, setP] = useState(13)
  const [n, setN] = useState(7)
  const [pPrime, setPPrime] = useState<number | undefined>()
  const [step, setStep] = useState<Step>(0)
  const [answerPPrime, setAnswerPPrime] = useState("")
  const [error, setError] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Persisted
        setA(parsed.a)
        setP(parsed.p)
        setN(parsed.n)
        setPPrime(parsed.pPrime)
        setStep(parsed.step)
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    const persist: Persisted = { a, p, n, pPrime, step }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persist))
  }, [a, p, n, pPrime, step])

  const progress = useMemo(() => (step === 0 ? 5 : step === 1 ? 60 : 100), [step])

  function validateCorollary() {
    if (a % n === 0) {
      setPPrime(undefined)
      setStep(2)
      return
    }
    const expected = p % (n - 1)
    const parsed = Number(answerPPrime)
    if (!Number.isNaN(parsed) && parsed === expected) {
      setPPrime(expected)
      setStep(2)
      setError(false)
    } else {
      setError(true)
    }
  }

  function reset() {
    setA(2)
    setP(13)
    setN(7)
    setPPrime(undefined)
    setStep(0)
    setAnswerPPrime("")
    setError(false)
  }

  const finalValue = useMemo(() => {
    if (a % n === 0) return a % n
    if (pPrime === undefined) return undefined
    return modPow(a, pPrime, n)
  }, [a, pPrime, n])

  return (
    <Stack gap={6}>
      <Link
        href="/dash/courses/congruence"
        color="teal.500"
        fontWeight="medium"
        mb={4}
        display="inline-block"
      >
        ← Retour à la page précédente
      </Link>

      <Card.Root size="lg" variant="elevated">
        <Card.Header>
          <HStack justify="space-between" w="100%">
            <Heading size="md">Corollaire de Fermat — Mode élève</Heading>
            <HStack w="40%">
              <Progress.Root value={progress} max={100} w="100%" colorPalette="teal" size="sm">
                <Progress.Track>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>
              <Text>{Math.round(progress)}%</Text>
            </HStack>
          </HStack>
        </Card.Header>

        <Card.Body>
          {step === 0 && (
            <Stack gap={4}>
              <HStack>
                <LabeledNumber label="a" value={a} onChange={setA} min={0} />
                <LabeledNumber label="p" value={p} onChange={setP} min={0} />
                <LabeledNumber label="n" value={n} onChange={setN} min={2} />
              </HStack>
              <HStack>
                <Button colorPalette="teal" onClick={() => setStep(1)}>Commencer</Button>
                <Button variant="outline" onClick={reset}>Réinitialiser</Button>
              </HStack>
            </Stack>
          )}

          {step === 1 && (
            <Stack gap={4}>
              {a % n === 0 ? (
                <>
                  <Text>
                    Comme n divise a, par le corollaire de Fermat : a^p mod n = a mod n = 0.
                  </Text>
                  <Button colorPalette="teal" onClick={() => setStep(2)}>Voir le résultat</Button>
                </>
              ) : (
                <>
                  <Text>
                    Comme n est premier et gcd(a, n) = 1, on peut réduire l’exposant : p′ = p mod (n − 1)
                  </Text>
                  <HStack>
                    <Input
                      placeholder="Propose p′"
                      value={answerPPrime}
                      onChange={(e) => setAnswerPPrime(e.target.value)}
                      w="200px"
                    />
                    <Button onClick={validateCorollary}>Valider p′</Button>
                  </HStack>
                  {error && (
                    <Text color="red.500" fontSize="sm">
                      ❌ Mauvaise réponse. Essaie encore.
                    </Text>
                  )}
                </>
              )}
            </Stack>
          )}

          {step === 2 && finalValue !== undefined && (
            <Stack gap={6}>
              <Alert.Root status="success" variant="subtle">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>Résultat final</Alert.Title>
                  <Alert.Description>
                    Par le corollaire de Fermat, a^{p} mod {n} = {finalValue}
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>

              {pPrime !== undefined && (
                <ExponentiationSteps base={a} exp={pPrime} mod={n} />
              )}
              <ModularCircleVisualizer
                modulus={n}
                highlight={finalValue}
                label={`a^${p} ≡ ${finalValue} mod ${n}`}
              />

              <HStack>
                <Button onClick={() => setStep(1)} variant="surface">Revoir la réduction</Button>
                <Button onClick={reset} variant="outline">Nouvel exercice</Button>
              </HStack>
            </Stack>
          )}
        </Card.Body>
      </Card.Root>
    </Stack>
  )
}

function LabeledNumber({ label, value, onChange, min }: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
}) {
  return (
    <VStack align="start">
      <label htmlFor={`input-${label}`}>
        <Text>{label}</Text>
      </label>
      <NumberInput.Root
        id={`input-${label}`}
        value={value.toString()}
        min={min ?? Number.NEGATIVE_INFINITY}
        onValueChange={(details) => {
          const num = Number(details.value)
          if (!Number.isNaN(num)) onChange(num)
        }}
        w="140px"
      >
        <NumberInput.Input />
        <NumberInput.Control />
      </NumberInput.Root>
    </VStack>
  )
}
