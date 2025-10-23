import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  Stack,
  Code,
  ButtonGroup,
  Portal,
  Field,
  Steps,
  Select,
  createListCollection,
} from '@chakra-ui/react'
import { useState } from 'react'

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
  const [modulo, setModulo] = useState<number | ''>(5)
  const [errors, setErrors] = useState<{ modulo?: string }>({})
  const [values, setValues] = useState<ProposedValue[]>([])
  const [feedback, setFeedback] = useState<string[]>([])

  const validate = () => {
    const n = typeof modulo === 'string' ? Number(modulo) : modulo
    const e: typeof errors = {}
    if (isNaN(n) || n < 2) e.modulo = 'n ≥ 2'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const generateValues = () => {
    const generated: ProposedValue[] = []
    for (let i = 0; i < 8; i++) {
      const val = Math.floor(Math.random() * 100) - 50
      generated.push({ value: val, assignedClass: '' })
    }
    setValues(generated)
    setFeedback(Array(8).fill(''))
  }

  const verifyAssignments = () => {
    const n = typeof modulo === 'string' ? Number(modulo) : modulo
    const results = values.map(({ value, assignedClass }) => {
      const expectedClass = ((value % n) + n) % n
      const assigned = Number(assignedClass)
      return assigned === expectedClass
        ? `✅ ${value} ∈ Classe ${assignedClass}`
        : `❌ ${value} ∉ Classe ${assignedClass} (devrait être Classe ${expectedClass})`
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

  const getClassCollection = (n: number) =>
    createListCollection({
      items: Array.from({ length: n }, (_, r) => ({
        label: `Classe ${r}`,
        value: `${r}`,
      })),
    })

  return (
    <Steps.Root count={3} step={step} onStepChange={(details) => setStep(details.step)}>
      <Steps.List>
        {['Choix de n', 'Classement', 'Vérification'].map((title, index) => (
          <Steps.Item key={index} index={index} title={title}>
            <Steps.Trigger>
              <Steps.Indicator />
              <Steps.Title>{title}</Steps.Title>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>

      {/* Étape 1 */}
      {step === 0 && (
        <Steps.Content index={0}>
          <VStack mt="6" align="start">
            <Field.Root>
              <Field.Label>Choisis un entier n ≥ 2</Field.Label>
              <Input
                type="number"
                value={modulo}
                onChange={e => setModulo(e.target.value === '' ? '' : Number(e.target.value))}
              />
              {errors.modulo && <Field.ErrorText>{errors.modulo}</Field.ErrorText>}
            </Field.Root>
            <Button mt="4" onClick={handleNext}>Valider</Button>
          </VStack>
        </Steps.Content>
      )}

      {/* Étape 2 */}
      {step === 1 && (
        <Steps.Content index={1}>
          <Text mt="6" mb="4">Classe chaque valeur proposée dans sa classe modulo {modulo} :</Text>
          <Stack gap="4">
            {values.map((item, i) => (
              <Box key={i} p="4" borderWidth="1px" borderRadius="md" bg="gray.50">
                <Text mb="2">Valeur proposée : <Code>{item.value}</Code></Text>
                <Field.Root>
                  <Field.Label>Classe mod {modulo}</Field.Label>
                  <Select.Root
                    collection={getClassCollection(Number(modulo))}
                    value={item.assignedClass ? [item.assignedClass] : []}
                    onValueChange={(details) => {
                      const copy = [...values]
                      copy[i].assignedClass = details.value[0] // value est string[]
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
          <Button mt="6" onClick={verifyAssignments}>Vérifier les affectations</Button>
        </Steps.Content>
      )}

      {/* Étape 3 */}
      {step === 2 && (
        <Steps.Content index={2}>
          <Text mt="6" mb="4">Résultats de la vérification :</Text>
          <Stack gap="3">
            {feedback.map((msg, i) => (
              <Text key={i} color={msg.startsWith('✅') ? 'green.600' : 'red.600'}>
                {msg}
              </Text>
            ))}
          </Stack>
          <ClassVisualizer
            values={values.map(v => v.value)}
            modulo={typeof modulo === 'string' ? Number(modulo) : modulo}
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
    </Steps.Root>
  )
}
