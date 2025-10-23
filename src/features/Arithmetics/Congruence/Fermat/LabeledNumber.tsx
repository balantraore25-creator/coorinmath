import { VStack, Text, NumberInput } from "@chakra-ui/react"

interface LabeledNumberProps {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
}

export function LabeledNumber({ label, value, onChange, min }: LabeledNumberProps) {
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
