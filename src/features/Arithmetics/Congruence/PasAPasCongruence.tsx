import React, { useState } from "react"
import {
  Box,
  Button,
  ButtonGroup,
  Input,
  Stack,
  Text,
  Steps,
  Flex
} from "@chakra-ui/react"
import { RouterChakraLink } from "@/components/ui/RouterChakraLink"
type StepItem = {
  title: string
  description: string
}

const steps: StepItem[] = [
  { title: "Saisie", description: "Entrer a, b et n" },
  { title: "Calcul", description: "Calculer a - b" },
  { title: "Test", description: "Tester si n divise (a - b)" },
  { title: "Conclusion", description: "Déduire la congruence" },
]

export default function PasAPasCongruence(): React.ReactNode {
  const [a, setA] = useState<string>("")
  const [b, setB] = useState<string>("")
  const [n, setN] = useState<string>("")

  const parsedA = parseInt(a)
  const parsedB = parseInt(b)
  const parsedN = parseInt(n)
  const diff = parsedA - parsedB
  const isDiv = parsedN !== 0 && diff % parsedN === 0

  const explanations: string[] = [
    `Valeurs : a = ${isNaN(parsedA) ? "?" : parsedA}, b = ${isNaN(parsedB) ? "?" : parsedB}, n = ${isNaN(parsedN) ? "?" : parsedN}`,
    `a - b = ${parsedA} - ${parsedB} = ${diff}`,
    isDiv
      ? `${parsedN} divise ${diff}`
      : `${parsedN} ne divise pas ${diff}`,
    isDiv
      ? `${parsedA} ≡ ${parsedB} mod ${parsedN}`
      : `${parsedA} n’est pas congru à ${parsedB} modulo ${parsedN}`,
  ]

  const handleReset = () => {
    setA("")
    setB("")
    setN("")
  }

  return (
    <Box maxW="lg" mx="auto" mt={10}>
      <Flex justify="space-between" w="full">
              <RouterChakraLink to="/dash/courses/congruence" color="teal.500">
                 ← Retour à la page précédente
              </RouterChakraLink>
            </Flex>

      <Steps.Root defaultStep={0} count={steps.length}>
        <Steps.List>
          {steps.map((step, index) => (
            <Steps.Item key={index} index={index} title={step.title}>
              <Steps.Trigger>
                <Steps.Indicator />
                <Steps.Title>{step.title}</Steps.Title>
              </Steps.Trigger>
              <Steps.Separator />
            </Steps.Item>
          ))}
        </Steps.List>

        {steps.map((step, index) => (
          <Steps.Content key={index} index={index}>
            <Box mt={4}>
              <Text fontWeight="medium">{step.description}</Text>
              {index === 0 && (
                <Stack mt={2}>
                  <Input
                    placeholder="a"
                    value={a}
                    onChange={(e) => setA(e.target.value)}
                    type="number"
                  />
                  <Input
                    placeholder="b"
                    value={b}
                    onChange={(e) => setB(e.target.value)}
                    type="number"
                  />
                  <Input
                    placeholder="n"
                    value={n}
                    onChange={(e) => setN(e.target.value)}
                    type="number"
                  />
                  <Button onClick={handleReset} colorScheme="gray" size="sm">
                    Initialiser
                  </Button>
                </Stack>
              )}
              {index > 0 && (
                <Text mt={2}>{explanations[index]}</Text>
              )}
            </Box>
          </Steps.Content>
        ))}

        <Steps.CompletedContent>
          <Text fontWeight="semibold" color="teal.600">
            ✅ Tous les calculs sont terminés !
          </Text>
        </Steps.CompletedContent>

        <ButtonGroup mt={6} size="sm" variant="outline">
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
