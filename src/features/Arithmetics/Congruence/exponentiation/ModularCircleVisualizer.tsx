import { Box, Text, Circle, Tooltip } from "@chakra-ui/react"
import { useMemo } from "react"

interface ModularCircleVisualizerProps {
  a: number
  n: number
  p: number
}

export function ModularCircleVisualizer({ a, n, p }: ModularCircleVisualizerProps) {
  const radius = 120
  const center = { x: radius, y: radius }

  const sequence = useMemo(() => {
    const seen = new Map<number, number>()
    const values: number[] = []
    let current = 1
    for (let k = 0; k <= p; k++) {
      values.push(current)
      if (seen.has(current)) break
      seen.set(current, k)
      current = (current * a) % n
    }
    return values
  }, [a, n, p])

  return (
    <Box position="relative" w={`${2 * radius}px`} h={`${2 * radius}px`}>
      {sequence.map((value, index) => {
        const angle = (2 * Math.PI * index) / sequence.length
        const x = center.x + radius * Math.cos(angle)
        const y = center.y + radius * Math.sin(angle)
        const isFinal = index === p || index === sequence.length - 1

        return (
          <Tooltip.Root key={index}>
            <Tooltip.Trigger>
              <Circle
                size="16px"
                bg={isFinal ? "teal.500" : index === 0 ? "gray.500" : "blue.400"}
                position="absolute"
                left={`${x - 8}px`}
                top={`${y - 8}px`}
                border={isFinal ? "2px solid black" : undefined}
                cursor="pointer"
              />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Text fontSize="xs">r_{index} = {value}</Text>
            </Tooltip.Content>
          </Tooltip.Root>
        )
      })}
      <Text position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" fontWeight="bold">
        mod {n}
      </Text>
    </Box>
  )
}

