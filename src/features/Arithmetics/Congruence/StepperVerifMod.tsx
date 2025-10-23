"use client"

import { useState } from "react"
import {
  Box,
  Input,
  Button,
  VStack,
  Text,
  Steps,
  ButtonGroup,
} from "@chakra-ui/react"

export default function StepperVerifMod() {
  const [step, setStep] = useState<number>(0)
  const [a, setA] = useState<string>("")
  const [p, setP] = useState<string>("")
  const [n, setN] = useState<string>("")
  const [powers, setPowers] = useState<number[]>([])
  const [reduction, setReduction] = useState<number | null>(null)
  const [result, setResult] = useState<number | null>(null)

  const steps = [
    {
      title: "Entrée des données",
      description: "Choisis les valeurs de a, p et n pour commencer.",
    },
    {
      title: "Cycle de puissances",
      description: "Calcule les puissances successives de a modulo n.",
    },
    {
      title: "Réduction de l’exposant",
      description: "Réduis p modulo la longueur du cycle.",
    },
    {
      title: "Résultat final",
      description: "Affiche le résultat de a^p mod n.",
    },
  ]

  const handleCycle = () => {
    const base = Number(a)
    const mod = Number(n)
    if (isNaN(base) || isNaN(mod) || mod <= 0) return

    let power = 1
    const cycle: number[] = []

    for (let i = 1; i <= mod * 2; i++) {
      power = (power * base) % mod
      if (cycle.includes(power)) break
      cycle.push(power)
    }

    setPowers(cycle)
  }

  const handleReduction = () => {
    const exponent = Number(p)
    if (isNaN(exponent) || powers.length === 0) return

    const r = exponent % powers.length
    setReduction(r === 0 ? powers.length : r)
  }

  const handleResult = () => {
    if (reduction === null || powers.length === 0) return

    const r = reduction === powers.length
      ? powers[powers.length - 1]
      : powers[reduction - 1]

    setResult(r)
  }

  const resetAll = () => {
    setStep(0)
    setA("")
    setP("")
    setN("")
    setPowers([])
    setReduction(null)
    setResult(null)
  }

  return (
    <Box maxW="600px" mx="auto" p={4}>
      <Steps.Root
        step={step}
        onStepChange={(details) => {
          if (typeof details === "object" && "index" in details) {
            setStep((details as any).index)
          }
        }}
        count={steps.length}
        orientation="vertical"
        colorPalette="blue"
        size="md"
      >
        <Steps.List>
          {steps.map((s, index) => (
            <Steps.Item key={index} index={index}>
              <Steps.Trigger>
                <Steps.Indicator />
                <Steps.Title>{s.title}</Steps.Title>
                <Steps.Description>{s.description}</Steps.Description>
              </Steps.Trigger>
              <Steps.Separator />
            </Steps.Item>
          ))}
        </Steps.List>

        <Steps.Content index={0}>
          <VStack mt={2}>
            <Input placeholder="a" value={a} onChange={(e) => setA(e.target.value)} />
            <Input placeholder="p" value={p} onChange={(e) => setP(e.target.value)} />
            <Input placeholder="n" value={n} onChange={(e) => setN(e.target.value)} />
            <Button mt={2} onClick={() => { handleCycle(); setStep(1) }}>
              Étape suivante
            </Button>
          </VStack>
        </Steps.Content>

        <Steps.Content index={1}>
          <VStack mt={2} align="start">
            {powers.map((val, idx) => (
              <Text key={idx}>
                {a}<sup>{idx + 1}</sup> ≡ {val} mod {n}
              </Text>
            ))}
            <Button mt={2} onClick={() => { handleReduction(); setStep(2) }}>
              Étape suivante
            </Button>
          </VStack>
        </Steps.Content>

        <Steps.Content index={2}>
          <Text mt={2}>
            {p} mod {powers.length} = {reduction}
          </Text>
          <Button mt={2} onClick={() => { handleResult(); setStep(3) }}>
            Étape suivante
          </Button>
        </Steps.Content>

        <Steps.Content index={3}>
          <Text mt={2} fontWeight="bold">
            {a}<sup>{p}</sup> ≡ {result} mod {n}
          </Text>
          <Button mt={3} onClick={resetAll}>Recommencer</Button>
        </Steps.Content>

        <Steps.CompletedContent>
          <Text mt={2}>✅ Tous les calculs sont terminés !</Text>
        </Steps.CompletedContent>

        <ButtonGroup size="sm" variant="outline" mt={4}>
          <Steps.PrevTrigger asChild>
            <Button>Précédent</Button>
          </Steps.PrevTrigger>
          <Steps.NextTrigger asChild>
            <Button>Suivant</Button>
          </Steps.NextTrigger>
        </ButtonGroup>
      </Steps.Root>
    </Box>
  )
}
