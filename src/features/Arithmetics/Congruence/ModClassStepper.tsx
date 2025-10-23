import {
  Box, Button, Input, Text, VStack, Field, Stack,
} from '@chakra-ui/react'
import { useState } from 'react'

export type ModClassEntry = {
  a: number
  p: number
  n: number
  cycle: number[]
  reducedExponent: number
  result: number
  timestamp: string
}

export const ModClassStepper = ({ onSave }: { onSave: (entry: ModClassEntry) => void }) => {
  const [step, setStep] = useState(0)
  const [a, setA] = useState<number | ''>(3)
  const [p, setP] = useState<number | ''>(10)
  const [n, setN] = useState<number | ''>(7)
  const [errors, setErrors] = useState<{ a?: string; p?: string; n?: string }>({})
  const [actualCycle, setActualCycle] = useState<number[]>([])
  const [studentCycle, setStudentCycle] = useState<string[]>([])
  const [studentReduction, setStudentReduction] = useState<string>('')
  const [studentResult, setStudentResult] = useState<string>('')
  const [feedback, setFeedback] = useState<string>('')

  const validate = () => {
    const e: typeof errors = {}
    if (typeof a !== 'number' || a <= 0) e.a = 'a > 0'
    if (typeof p !== 'number' || p < 0) e.p = 'p ≥ 0'
    if (typeof n !== 'number' || n <= 1) e.n = 'n > 1'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const computeCycle = () => {
    const seen = new Set<number>()
    const powers: number[] = []
    let k = 0
    while (true) {
      const mod = Math.pow(a as number, k) % (n as number)
      if (seen.has(mod)) break
      powers.push(mod)
      seen.add(mod)
      k++
    }
    setActualCycle(powers)
    setStudentCycle(Array(powers.length).fill(''))
  }

  const checkCycle = () => {
    const correct = studentCycle.every((val, i) => Number(val) === actualCycle[i])
    setFeedback(correct ? '✅ Cycle correct !' : '❌ Cycle incorrect.')
    if (correct) setStep(2)
  }

  const checkReduction = () => {
    const expected = (p as number) % actualCycle.length
    const correct = Number(studentReduction) === expected
    setFeedback(correct ? '✅ Réduction correcte !' : `❌ Mauvais reste. p mod ${actualCycle.length} = ${expected}`)
    if (correct) setStep(3)
  }

  const checkResult = () => {
    const reduced = (p as number) % actualCycle.length
    const expected = Math.pow(a as number, reduced) % (n as number)
    const correct = Number(studentResult) === expected
    setFeedback(correct ? '✅ Résultat correct !' : `❌ Faux. a^${reduced} mod ${n} = ${expected}`)
    if (correct) {
      onSave({
        a: a as number,
        p: p as number,
        n: n as number,
        cycle: actualCycle,
        reducedExponent: reduced,
        result: expected,
        timestamp: new Date().toISOString(),
      })
      setStep(4)
    }
  }

  return (
    <Box>
      {step === 0 && (
        <VStack >
          <Field.Root>
            <Field.Label>a</Field.Label>
            <Input type="number" value={a} onChange={e => setA(Number(e.target.value))} />
            {errors.a && <Field.ErrorText>{errors.a}</Field.ErrorText>}
          </Field.Root>
          <Field.Root>
            <Field.Label>p</Field.Label>
            <Input type="number" value={p} onChange={e => setP(Number(e.target.value))} />
            {errors.p && <Field.ErrorText>{errors.p}</Field.ErrorText>}
          </Field.Root>
          <Field.Root>
            <Field.Label>n</Field.Label>
            <Input type="number" value={n} onChange={e => setN(Number(e.target.value))} />
            {errors.n && <Field.ErrorText>{errors.n}</Field.ErrorText>}
          </Field.Root>
          <Button onClick={() => validate() && (computeCycle(), setStep(1))}>Valider</Button>
        </VStack>
      )}

      {step === 1 && (
        <Box>
          <Text mb="2">Propose le cycle de a mod n :</Text>
          <Stack >
            {studentCycle.map((val, i) => (
              <Field.Root key={i}>
                <Field.Label>a<sup>{i}</sup> mod {n}</Field.Label>
                <Input value={val} onChange={e => {
                  const copy = [...studentCycle]
                  copy[i] = e.target.value
                  setStudentCycle(copy)
                }} />
              </Field.Root>
            ))}
          </Stack>
          <Button mt="4" onClick={checkCycle}>Vérifier le cycle</Button>
        </Box>
      )}

      {step === 2 && (
        <Box>
          <Text>Réduis p mod {actualCycle.length} :</Text>
          <Input mt="2" value={studentReduction} onChange={e => setStudentReduction(e.target.value)} />
          <Button mt="4" onClick={checkReduction}>Vérifier la réduction</Button>
        </Box>
      )}

      {step === 3 && (
        <Box>
          <Text>Propose le résultat final de a^p mod n :</Text>
          <Input mt="2" value={studentResult} onChange={e => setStudentResult(e.target.value)} />
          <Button mt="4" onClick={checkResult}>Vérifier le résultat</Button>
        </Box>
      )}

      {step === 4 && (
        <Text mt="6" color="green.600">✅ Tous les calculs sont terminés !</Text>
      )}

      {feedback && <Text mt="4" color={feedback.startsWith('✅') ? 'green.500' : 'red.500'}>{feedback}</Text>}
    </Box>
  )
}
