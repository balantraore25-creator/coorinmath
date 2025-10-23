import {
  Card,
  Heading,
  HStack,
  Progress,
  Stack,
  Text,
  Link,
} from "@chakra-ui/react"
import { useEffect, useMemo, useState } from "react"
import { FastExpIntroStep } from "./exponentiation/FastExpIntroStep"
import { FastExpStep } from "./exponentiation/FastExpStep"
import { FastExpResultStep } from "./exponentiation/FastExpResultStep"

const EX_KEY = "fast_exp_stepper_v3"

type Step = 0 | 1 | 2
type FastStep = { e: number; bit: number; base: number; result: number }
type Persisted = {
  a: number
  p: number
  n: number
  steps: FastStep[]
  currentIndex: number
  step: Step
}

function mod(a: number, n: number): number {
  const r = a % n
  return r < 0 ? r + n : r
}

export default function StepperFastExp() {
  const [a, setA] = useState(2)
  const [p, setP] = useState(13)
  const [n, setN] = useState(7)
  const [steps, setSteps] = useState<FastStep[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [step, setStep] = useState<Step>(0)

  const [ansResult, setAnsResult] = useState("")
  const [ansBase, setAnsBase] = useState("")

  useEffect(() => {
    try {
      const raw = localStorage.getItem(EX_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Persisted
        setA(parsed.a)
        setP(parsed.p)
        setN(parsed.n)
        setSteps(parsed.steps)
        setCurrentIndex(parsed.currentIndex)
        setStep(parsed.step)
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    const persist: Persisted = { a, p, n, steps, currentIndex, step }
    localStorage.setItem(EX_KEY, JSON.stringify(persist))
  }, [a, p, n, steps, currentIndex, step])

  const progress = useMemo(() => {
    if (step === 0) return 5
    if (step === 1) return ((currentIndex + 1) / steps.length) * 90
    if (step === 2) return 100
    return 0
  }, [step, currentIndex, steps.length])

  function prepareSteps() {
    let e = p
    let base = mod(a, n)
    let result = 1
    const s: FastStep[] = []
    while (e > 0) {
      const bit = e % 2
      s.push({ e, bit, base, result })
      if (bit === 1) result = mod(result * base, n)
      e = Math.floor(e / 2)
      base = mod(base * base, n)
    }
    setSteps(s)
    setCurrentIndex(0)
    setStep(1)
    setAnsResult("")
    setAnsBase("")
  }

  useEffect(() => {
    const st = steps[currentIndex]
    if (!st || !ansResult || !ansBase) return

    const expectedResult = st.bit === 1 ? mod(st.result * st.base, n) : st.result
    const expectedBase = mod(st.base * st.base, n)

    const isCorrect = Number(ansResult) === expectedResult && Number(ansBase) === expectedBase

    if (isCorrect) {
      setTimeout(() => {
        if (currentIndex < steps.length - 1) {
          setCurrentIndex(i => i + 1)
          setAnsResult("")
          setAnsBase("")
        } else {
          setStep(2)
        }
      }, 500)
    }
  }, [ansResult, ansBase, currentIndex, steps, n])

  const finalValue = useMemo(() => {
    if (!steps.length) return undefined
    const last = steps[steps.length - 1]
    let r = last.result
    if (last.bit === 1) r = mod(last.result * last.base, n)
    return r
  }, [steps, n])

  function reset() {
    setA(2)
    setP(13)
    setN(7)
    setSteps([])
    setCurrentIndex(0)
    setStep(0)
    setAnsResult("")
    setAnsBase("")
  }

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
            <Heading size="md">Exponentiation rapide — Mode élève</Heading>
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
            <FastExpIntroStep
              a={a}
              p={p}
              n={n}
              setA={setA}
              setP={setP}
              setN={setN}
              onStart={prepareSteps}
            />
          )}

          {step === 1 && steps.length > 0 && (
            <FastExpStep
              currentIndex={currentIndex}
              totalSteps={steps.length}
              stepData={steps[currentIndex]}
              ansResult={ansResult}
              ansBase={ansBase}
              setAnsResult={setAnsResult}
              setAnsBase={setAnsBase}
              n={n}
            />
          )}

          {step === 2 && finalValue !== undefined && (
            <FastExpResultStep
              a={a}
              p={p}
              n={n}
              finalValue={finalValue}
              onBack={() => setStep(1)}
              onReset={reset}
            />
          )}
        </Card.Body>
      </Card.Root>
    </Stack>
  )
}
