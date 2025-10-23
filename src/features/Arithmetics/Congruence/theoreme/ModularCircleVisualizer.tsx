import { Box, Text } from "@chakra-ui/react"
import { useMemo } from "react"
import { motion } from "framer-motion"

type Props = {
  modulus: number
  solutions: number[]
  radius?: number
}

export const ModularCircleVisualizer = ({ modulus, solutions, radius = 100 }: Props) => {
  const points = useMemo(() => {
    const angleStep = (2 * Math.PI) / modulus
    return Array.from({ length: modulus }, (_, i) => {
      const angle = i * angleStep - Math.PI / 2
      return {
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
        value: i,
        isSolution: solutions.includes(i),
      }
    })
  }, [modulus, solutions, radius])

  return (
    <Box position="relative" h={`${radius * 2 + 40}px`} w="full" textAlign="center">
      <Text fontWeight="bold" mb={2}>Visualisation circulaire modulo {modulus}</Text>
      <Box position="relative" w="full" h={`${radius * 2}px`}>
        {points.map((p, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              left: `calc(50% + ${p.x}px - 12px)`,
              top: `calc(50% + ${p.y}px - 12px)`,
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: p.isSolution ? "#319795" : "#CBD5E0",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "sm",
              fontWeight: "bold",
              boxShadow: p.isSolution ? "0 0 0 2px #2C7A7B" : "none",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.03 }}
          >
            {p.value}
          </motion.div>
        ))}
      </Box>
    </Box>
  )
}
