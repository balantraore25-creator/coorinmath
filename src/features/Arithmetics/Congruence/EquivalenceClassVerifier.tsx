import {
  Box,
  Flex,
  Input,
  Button,
  VStack,
  Stack,
  Code,
  ButtonGroup,
  Portal,
  Field,
  Steps,
  Select,
  createListCollection,
  Text,
} from "@chakra-ui/react"
import { RouterChakraLink } from "@/components/ui/RouterChakraLink"
import { useState } from "react"

type ProposedValue = {
  value: number
  assignedClass: string
}

const ClassVisualizer = ({ values, modulo }: { values: number[]; modulo: number }) => (
  <Box mt="8">
    <Text fontWeight="bold" mb="2">Visualisation des classes :</Text>
    <Stack direction="row" flexWrap="wrap" gap="2">
      {values.map((value, i) => {
        const r = ((value % modulo) + modulo) % modulo
        const color = `hsl(${(r * 360) / modulo}, 70%, 60%)`
        return (
          <Box
            key={i}
            p="2"
            borderRadius="full"
            bg={color}
            color="white"
            minW="40px"
            textAlign="center"
            fontWeight="bold"
            title={`Classe ${r}`}
          >
            {value}
          </Box>
        )
      })}
    </Stack>
  </Box>
)

export default function EquivalenceClassVerifier() {
  const [step, setStep] = useState(0)
  const [modulo, setModulo] = useState<number | "">(5)
  const [errors, setErrors] = useState<{ modulo?: string }>({})
  const [values, setValues] = useState<ProposedValue[]>([])
  const [feedback, setFeedback] = useState<string[]>([])

  const validate = () => {
    const n = typeof modulo === "string" ? Number(modulo) : modulo
    const e: typeof errors = {}
    if (isNaN(n) || n < 2) e.modulo = "n ≥ 2"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const generateValues = () => {
    const generated: ProposedValue[] = []
    for (let i = 0; i < 8; i++) {
      const val = Math.floor(Math.random() * 100) - 50
      generated.push({ value: val, assignedClass: "" })
    }
    setValues(generated)
    setFeedback(Array(8).fill(""))
  }

  const verifyAssignments = () => {
    const n = typeof modulo === "string" ? Number(modulo) : modulo
    const results = values.map(({ value, assignedClass }) => {
      const expected = ((value % n) + n) % n
      const assigned = Number(assignedClass)

      const methodSoustraction = (value - assigned) % n === 0
      const q = Math.floor(value / n)
      const r = value % n
      const methodDivision = value === q * n + r
      const methodReste = ((value % n) + n) % n === assigned

      const isCorrect = assigned === expected

      const details = [
        `➖ Soustraction : ${value} − ${assigned} = ${value - assigned} ${methodSoustraction ? "⇒ divisible par" : "⇏ divisible par"} ${n}`,
        `➗ Division euclidienne : ${value} = ${q} × ${n} + ${r} ${methodDivision ? "⇒ conforme" : "⇏ non conforme"}`,
        `🟰 Reste : ${value} mod ${n} = ${value % n} ${methodReste ? "⇒ égal à" : "⇏ différent de"} ${assigned}`,
      ]

      return isCorrect
        ? `✅ ${value} ∈ Classe ${assigned} ✔\n${details.join("\n")}`
        : `❌ ${value} ∉ Classe ${assigned} (devrait être Classe ${expected}) ✘\n${details.join("\n")}`
    })

    setFeedback(results)
    setStep(2)
  }

  const handleNext = () => {
    if (step === 0 && validate()) {
      generateValues()
      setStep(1)
    }
  }

  const handleReset = () => {
    setModulo(5)
    setValues([])
    setFeedback([])
    setErrors({})
    setStep(0)
  }

  const getClassCollection = (n: number) =>
    createListCollection({
      items: Array.from({ length: n }, (_, r) => ({
        label: `Classe ${r}`,
        value: `${r}`,
      })),
    })

  return (
    <Box maxW="4xl" mx="auto" mt="8">
      <Flex justify="space-between" w="full">
        <RouterChakraLink to="/dash/courses/congruence" color="teal.500">
          ← Retour à la page précédente
        </RouterChakraLink>
      </Flex>

      <Steps.Root count={3} step={step} onStepChange={(details) => setStep(details.step)}>
        <Steps.List>
          {["Choix de n", "Classement", "Vérification"].map((title, index) => (
            <Steps.Item key={index} index={index} title={title}>
              <Steps.Trigger>
                <Steps.Indicator />
                <Steps.Title>{title}</Steps.Title>
              </Steps.Trigger>
              <Steps.Separator />
            </Steps.Item>
          ))}
        </Steps.List>

        {step === 0 && (
          <Steps.Content index={0}>
            <VStack mt="6" align="start">
              <Field.Root>
                <Field.Label>Choisis un entier n ≥ 2</Field.Label>
                <Input
                  type="number"
                  value={modulo}
                  onChange={(e) =>
                    setModulo(e.target.value === "" ? "" : Number(e.target.value))
                  }
                />
                {errors.modulo && <Field.ErrorText>{errors.modulo}</Field.ErrorText>}
              </Field.Root>
              <Button mt="4" onClick={handleNext}>
                Valider
              </Button>
            </VStack>
          </Steps.Content>
        )}

        {step === 1 && (
          <Steps.Content index={1}>
            <Box p="4" mb="4" borderWidth="1px" borderRadius="md" bg="yellow.50">
              <Text fontWeight="bold" mb="2">
                Formule générale pour trouver la classe mod n :
              </Text>
              <Code p="2" display="block" whiteSpace="pre">
                ( (a mod n) + n ) mod n
              </Code>
              <Text fontSize="sm" color="gray.600" mt="2">
                Exemple : si a = -7 et n = 5 → (-7 mod 5 + 5) mod 5 = 3
              </Text>
            </Box>

            <Text mb="4">Classe chaque valeur proposée dans sa classe modulo {modulo} :</Text>
            <Stack gap="4">
              {values.map((item, i) => (
                <Box key={i} p="4" borderWidth="1px" borderRadius="md" bg="gray.50">
                  <Text mb="2">
                    Valeur proposée : <Code>{item.value}</Code>
                  </Text>
                  <Field.Root>
                    <Field.Label>Classe mod {modulo}</Field.Label>
                    <Select.Root
                      collection={getClassCollection(Number(modulo))}
                      value={item.assignedClass ? [item.assignedClass] : []}
                      onValueChange={(details) => {
                        const copy = [...values]
                        copy[i].assignedClass = details.value[0]
                        setValues(copy)
                      }}
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText placeholder="Choisir une classe" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Portal>
                        <Select.Positioner>
                          <Select.Content>
                            {getClassCollection(Number(modulo)).items.map((opt) => (
                              <Select.Item key={opt.value} item={opt}>
                                {opt.label}
                                <Select.ItemIndicator />
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Portal>
                    </Select.Root>
                  </Field.Root>
                </Box>
              ))}
            </Stack>
            <Button mt="6" onClick={verifyAssignments}>
              Vérifier les affectations
            </Button>
          </Steps.Content>
        )}

        {step === 2 && (
          <Steps.Content index={2}>
            <Text mt="6" mb="4">Résultats de la vérification :</Text>
            <Stack gap="4">
              {feedback.map((msg, i) => (
                <Code
                  key={i}
                  p="3"
                  whiteSpace="pre-wrap"
                  bg={msg.startsWith("✅") ? "green.700" : "red.700"}
                  borderRadius="md"
                >
                  {msg}
                </Code>
              ))}
            </Stack>

            <ClassVisualizer
              values={values.map((v) => v.value)}
              modulo={typeof modulo === "string" ? Number(modulo) : modulo}
            />
          </Steps.Content>
        )}

        <Steps.CompletedContent>
          <Text mt="6" color="green.600">✅ Classement terminé !</Text>
        </Steps.CompletedContent>

        <ButtonGroup mt="6">
          <Steps.PrevTrigger asChild>
            <Button disabled={step === 0}>Précédent</Button>
          </Steps.PrevTrigger>
          <Steps.NextTrigger asChild>
            <Button disabled={step === 2} onClick={handleNext}>Suivant</Button>
          </Steps.NextTrigger>
        </ButtonGroup>

        <Button mt="4" variant="ghost" colorScheme="gray" onClick={handleReset}>
          Initialiser
        </Button>
      </Steps.Root>
    </Box>
  )
}
