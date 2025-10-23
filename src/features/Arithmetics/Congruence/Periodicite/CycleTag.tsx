import { Tag } from "@chakra-ui/react"

export function CycleTag({
  k, value, k0, lambda
}: {
  k: number
  value: number
  k0?: number
  lambda?: number
}) {
  const inCycle = k0 !== undefined && lambda !== undefined && k >= k0
  const color = inCycle ? "green" : "blue"
  const variant = inCycle ? "solid" : "subtle"

  return (
    <Tag.Root colorPalette={color} variant={variant}>
      <Tag.Label>{`k=${k} → ${value}`}</Tag.Label>
    </Tag.Root>
  )
}
