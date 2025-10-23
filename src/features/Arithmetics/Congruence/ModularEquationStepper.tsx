import {
  Box,
  Button,
  HStack,
  Stack,
  Text,
  VStack,
  RadioGroup,
} from "@chakra-ui/react"
import { Link } from "@chakra-ui/react"
import { useState, useMemo } from "react"
import { NumberField } from "../../../components/fields/NumberField"
import { solveModular } from "./math/solve-modular"
import { gcd, mod, normalizeMod } from "./math/number"
import { GaussResolutionSteps } from "./theoreme/GaussResolutionSteps"
import { ModularCircleVisualizer } from "./theoreme/ModularCircleVisualizer"
import { AttemptHistory } from "../../../components/history/AttemptHistory"
import { EuclidStepList } from "../../../components/euclid/EuclidStepList"
import { BezoutVisualizer } from "../../../components/euclid/BezoutVisualizer"
import { BruteForceStepList } from "./math/BruteForceStepList"

type MethodKey = "euclid" | "bruteforce"

const METHODS: { key: MethodKey; label: string; description: string }[] = [
  {
    key: "euclid",
    label: "Euclide étendu",
    description: "Calcule le pgcd(a,n) et l’inverse si pgcd=1.",
  },
  {
    key: "bruteforce",
    label: "Brute force (pédagogie)",
    description: "Teste x de 0 à n-1 pour montrer la démarche.",
  },
]

export const ModularEquationStepper = () => {
  const [a, setA] = useState(6)
  const [b, setB] = useState(8)
  const [n, setN] = useState(14)
  const [method, setMethod] = useState<MethodKey>("euclid")
  const [result, setResult] = useState<ReturnType<typeof solveModular> | null>(null)

  const g = useMemo(() => gcd(a, n), [a, n])
  const bMod = useMemo(() => normalizeMod(b, n), [b, n])

  const compute = () => {
    const res = solveModular({ a, b: bMod, n, method })
    setResult(res)
  }

  const reset = () => {
    setA(0)
    setB(0)
    setN(2)
    setMethod("euclid")
    setResult(null)
  }

  const verified = useMemo(() => {
    if (!result?.solution) return null
    return mod(a * result.solution, n)
  }, [a, n, result])

  return (
    <Stack gap={6}>
      {/* Lien retour */}
      <Link
        href="/dash/courses/congruence"
        color="teal.500"
        fontWeight="medium"
        mb={4}
        display="inline-block"
      >
        ← Retour à la page précédente
      </Link>

      {/* Paramètres */}
      <Box p={4} borderWidth="1px" borderRadius="md">
        <Text fontWeight="bold" mb={2}>Paramètres</Text>
        <VStack align="start" gap={4}>
          <NumberField label="a" value={a} onChange={setA} />
          <NumberField label="b" value={b} onChange={setB} />
          <NumberField label="n" value={n} onChange={setN} />

          <Box>
            <Text fontWeight="medium" mb={2}>Méthode</Text>
            <RadioGroup.Root
              value={method}
              onValueChange={(e) => setMethod(e.value as MethodKey)}
              colorPalette="teal"
              size="md"
              variant="outline"
            >
              <Stack gap={2}>
                {METHODS.map((m) => (
                  <RadioGroup.Item key={m.key} value={m.key}>
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText>
                      <HStack>
                        <Text>{m.label}</Text>
                        <Text fontSize="sm" color="gray.500">— {m.description}</Text>
                      </HStack>
                    </RadioGroup.ItemText>
                  </RadioGroup.Item>
                ))}
              </Stack>
            </RadioGroup.Root>
          </Box>

          <HStack>
            <Button colorScheme="teal" onClick={compute}>Résoudre</Button>
            <Button variant="outline" onClick={reset}>Réinitialiser</Button>
          </HStack>
        </VStack>
      </Box>

      {/* Résultat */}
      <Box p={4} borderWidth="1px" borderRadius="md">
        <Text fontWeight="bold" mb={2}>Résultat</Text>
        {result?.solution != null ? (
          <Stack gap={2}>
            <Text>Solution canonique : x ≡ <strong>{result.solution}</strong> mod {n}</Text>
            <Text>Vérification : {a} × {result.solution} ≡ {verified} mod {n}</Text>

            {g > 1 && bMod % g === 0 && (
              <>
                <Text>Il y a {g} solutions modulo {n} :</Text>
                <Text>
                  {Array.from({ length: g }, (_, k) =>
                    mod(result.solution! + k * (n / g), n)
                  ).join(", ")}
                </Text>
              </>
            )}
          </Stack>
        ) : (
          <Text>Aucune solution trouvée.</Text>
        )}
      </Box>

      {/* Étapes pédagogiques */}
      {result?.solution != null && g > 1 && bMod % g === 0 && (
        <>
          <GaussResolutionSteps a={a} b={b} n={n} />
          <ModularCircleVisualizer
            modulus={n}
            solutions={Array.from({ length: g }, (_, k) =>
              mod(result.solution! + k * (n / g), n)
            )}
          />
        </>
      )}

      {/* Détails de calcul */}
      <Box p={4} borderWidth="1px" borderRadius="md">
        <Text fontWeight="bold" mb={2}>Détails du calcul</Text>
        {method === "euclid" && result?.euclid && (
          <>
            <EuclidStepList steps={result.euclid.steps} a={a} n={n} />
            <BezoutVisualizer
              s={result.euclid.s}
              t={result.euclid.t}
              a={a}
              n={n}
              gcd={result.euclid.gcd}
            />
          </>
        )}
        {method === "bruteforce" && result?.bruteForceSteps && (
          <BruteForceStepList steps={result.bruteForceSteps} a={a} b={b} n={n} />
        )}
      </Box>

      {/* Historique */}
      <AttemptHistory items={[]} />
    </Stack>
  )
}
