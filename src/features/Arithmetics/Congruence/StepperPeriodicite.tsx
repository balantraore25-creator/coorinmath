import {
  Card,
  Heading,
  HStack,
  Progress,
  Stack,
  Text,
  Link,
} from "@chakra-ui/react"
import { useState, useEffect, useMemo } from "react"
import { PeriodiciteIntroStep } from "./Periodicite/PeriodiciteIntroStep"
import { PeriodiciteCycleStep } from "./Periodicite/PeriodiciteCycleStep"
import { PeriodiciteCycleConfirmStep } from "./Periodicite/PeriodiciteCycleConfirmStep"
import { PeriodiciteReductionStep } from "./Periodicite/PeriodiciteReductionStep"
import { PeriodiciteResultStep } from "./Periodicite/PeriodiciteResultStep"
import { mod, nextPower, reduceExponent } from "./utils/mod"

type Step = 0 | 1 | 2 | 3 | 4
type SeqItem = { k: number; value: number }

export default function StepperPeriodicite() {
  const [a, setA] = useState(2)
  const [n, setN] = useState(7)
  const [p, setP] = useState(13)
  const [sequence, setSequence] = useState<SeqItem[]>([{ k: 0, value: 1 }])
  const [visited, setVisited] = useState<Map<number, number>>(new Map([[1, 0]]))
  const [k0, setK0] = useState<number | undefined>()
  const [lambda, setLambda] = useState<number | undefined>()
  const [step, setStep] = useState<Step>(0)

  const [answerNext, setAnswerNext] = useState("")
  const [proposedK0, setProposedK0] = useState("")
  const [proposedLambda, setProposedLambda] = useState("")
  const [proposedPPrime, setProposedPPrime] = useState("")

  useEffect(() => {
    try {
      const raw = localStorage.getItem("periodicite_stepper_v3")
      if (raw) {
        const parsed = JSON.parse(raw)
        setA(parsed.a)
        setN(parsed.n)
        setP(parsed.p)
        setSequence(parsed.sequence)
        setVisited(new Map(parsed.visitedEntries))
        setK0(parsed.k0)
        setLambda(parsed.lambda)
        setStep(parsed.step)
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    const persist = {
      a, n, p, sequence,
      visitedEntries: Array.from(visited.entries()),
      k0, lambda, step
    }
    localStorage.setItem("periodicite_stepper_v3", JSON.stringify(persist))
  }, [a, n, p, sequence, visited, k0, lambda, step])

  const progress = useMemo(() => {
    switch (step) {
      case 0: return 5
      case 1: return 35
      case 2: return 60
      case 3: return 85
      case 4: return 100
      default: return 0
    }
  }, [step])

  const nextK = sequence[sequence.length - 1].k + 1
  const correctNext = useMemo(() => {
    const prev = sequence[sequence.length - 1].value
    return nextPower(prev, a, n)
  }, [sequence, a, n])

  function validateParams() {
    const base = mod(1, n)
    setSequence([{ k: 0, value: base }])
    setVisited(new Map([[base, 0]]))
    setK0(undefined)
    setLambda(undefined)
    setStep(1)
  }

  function submitNext(answer: number) {
    if (answer !== correctNext) return
    const k = nextK
    const newSeq = [...sequence, { k, value: answer }]
    const prevIdx = visited.get(answer)
    setSequence(newSeq)
    if (prevIdx !== undefined) {
      setK0(prevIdx)
      setLambda(k - prevIdx)
      setStep(2)
    } else {
      const newVisited = new Map(visited)
      newVisited.set(answer, k)
      setVisited(newVisited)
    }
    setAnswerNext("")
  }

  function confirmK0Lambda(k0Val: number, lambdaVal: number) {
    setK0(k0Val)
    setLambda(lambdaVal)
    setStep(3)
  }

  function validateReduction() {
    if (k0 === undefined || lambda === undefined) return
    const pPrime = reduceExponent(p, k0, lambda)
    if (Number(proposedPPrime) === pPrime) {
      setStep(4)
    }
  }

  function reset() {
    setA(2)
    setN(7)
    setP(13)
    setSequence([{ k: 0, value: 1 }])
    setVisited(new Map([[1, 0]]))
    setK0(undefined)
    setLambda(undefined)
    setStep(0)
    setAnswerNext("")
    setProposedK0("")
    setProposedLambda("")
    setProposedPPrime("")
  }

  const finalValue = useMemo(() => {
    if (k0 === undefined || lambda === undefined) return undefined
    const pPrime = reduceExponent(p, k0, lambda)
    return sequence.find(s => s.k === pPrime)?.value
  }, [sequence, p, k0, lambda])

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
            <Heading size="md">Périodicité — Mode élève</Heading>
            <HStack w="40%">
              <Progress.Root value={progress} max={100} w="100%" colorPalette="teal" size="sm">
                <Progress.Track>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>
              <Text>{progress}%</Text>
            </HStack>
          </HStack>
        </Card.Header>

        <Card.Body>
          {step === 0 && (
            <PeriodiciteIntroStep
              a={a} n={n} p={p}
              setA={setA} setN={setN} setP={setP}
              onStart={validateParams}
            />
          )}

          {step === 1 && (
            <PeriodiciteCycleStep
              a={a} n={n}
              sequence={sequence}
              k0={k0} lambda={lambda}
              answerNext={answerNext}
              setAnswerNext={setAnswerNext}
              onValidate={(v) => submitNext(mod(v, n))}
            />
          )}

          {step === 2 && (
            <PeriodiciteCycleConfirmStep
              sequence={sequence}
              k0={k0} lambda={lambda}
              proposedK0={proposedK0}
              proposedLambda={proposedLambda}
              setProposedK0={setProposedK0}
              setProposedLambda={setProposedLambda}
              onConfirm={confirmK0Lambda}
            />
          )}

          {step === 3 && k0 !== undefined && lambda !== undefined && (
            <PeriodiciteReductionStep
              p={p}
              k0={k0}
              lambda={lambda}
              proposedPPrime={proposedPPrime}
              setProposedPPrime={setProposedPPrime}
              onValidate={validateReduction}
            />
          )}

          {step === 4 && finalValue !== undefined && (
            <PeriodiciteResultStep
              p={p}
              n={n}
              finalValue={finalValue}
              onBack={() => setStep(3)}
              onReset={reset}
            />
          )}
        </Card.Body>
      </Card.Root>
    </Stack>
  )
}
