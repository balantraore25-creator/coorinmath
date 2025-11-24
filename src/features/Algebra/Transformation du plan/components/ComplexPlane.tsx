"use client"

import React, { useState, useMemo } from "react"
import {
  Box,
  Flex,
  Text,
  HStack,
  Card,
} from "@chakra-ui/react"

export type Complex = { re: number; im: number }

interface Props {
  z: Complex
  fz: Complex
  a?: Complex
  label?: string
  showGrid?: boolean
  showProjections?: boolean
  width?: number
  height?: number
  maxUnits?: number
}

function toSVG({ re, im }: Complex, scale: number, origin: { x: number; y: number }) {
  return {
    x: origin.x + re * scale,
    y: origin.y - im * scale,
  }
}

export default function ComplexPlanePanZoom({
  z,
  fz,
  a,
  label,
  showGrid = true,
  showProjections = true,
  width = 640,
  height = 640,
  maxUnits = 8,
}: Props) {
  const [scale] = useState(40)
  const [offsetX] = useState(width / 2)
  const [offsetY] = useState(height / 2)

  const origin = { x: offsetX, y: offsetY }

  const Z = toSVG(z, scale, origin)
  const FZ = toSVG(fz, scale, origin)
  const A = a ? toSVG(a, scale, origin) : null

  const gridLines = useMemo(() => {
    if (!showGrid) return []
    const lines: React.ReactElement[] = []
    for (let i = -maxUnits; i <= maxUnits; i++) {
      const x = origin.x + i * scale
      lines.push(<line key={`vx${i}`} x1={x} y1={0} x2={x} y2={height} stroke="#eee" />)
    }
    for (let j = -maxUnits; j <= maxUnits; j++) {
      const y = origin.y - j * scale
      lines.push(<line key={`hz${j}`} x1={0} y1={y} x2={width} y2={y} stroke="#eee" />)
    }
    return lines
  }, [origin, scale, showGrid, maxUnits, width, height])

  return (
    <Flex direction="column" align="center" gap={6}>
      {/* SVG */}
      <Box border="1px solid" borderColor="gray.300" borderRadius="md" shadow="sm">
        <svg width={width} height={height}>
          {showGrid && gridLines}

          {/* Axes */}
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L10,5 L0,10 Z" fill="black" />
            </marker>
          </defs>
          <line x1={0} y1={origin.y} x2={width} y2={origin.y} stroke="black" markerEnd="url(#arrow)" />
          <line x1={origin.x} y1={height} x2={origin.x} y2={0} stroke="black" markerEnd="url(#arrow)" />

          {/* Points */}
          <circle cx={Z.x} cy={Z.y} r={5} fill="blue" />
          <text x={Z.x + 5} y={Z.y - 5}>z</text>

          <circle cx={FZ.x} cy={FZ.y} r={5} fill="green" />
          <text x={FZ.x + 5} y={FZ.y - 5}>f(z)</text>

          {a && A && (
            <>
              <circle cx={A.x} cy={A.y} r={5} fill="red" />
              <text x={A.x + 5} y={A.y - 5}>a</text>
            </>
          )}

          {/* Projections */}
          {showProjections && (
            <>
              {/* Projections de z */}
              <line x1={Z.x} y1={Z.y} x2={Z.x} y2={origin.y} stroke="blue" strokeDasharray="2" />
              <line x1={Z.x} y1={Z.y} x2={origin.x} y2={Z.y} stroke="blue" strokeDasharray="2" />
              <text x={Z.x} y={origin.y + 30} fontSize="10">{z.re}</text>
              <text x={origin.x - 25} y={Z.y} fontSize="10">{z.im}</text>

              {/* Projections de f(z) */}
              <line x1={FZ.x} y1={FZ.y} x2={FZ.x} y2={origin.y} stroke="green" strokeDasharray="2" />
              <line x1={FZ.x} y1={FZ.y} x2={origin.x} y2={FZ.y} stroke="green" strokeDasharray="2" />
              <text x={FZ.x} y={origin.y + 30} fontSize="10">{fz.re}</text>
              <text x={origin.x - 25} y={FZ.y} fontSize="10">{fz.im}</text>
            </>
          )}

          {/* Vecteurs */}
          <line x1={Z.x} y1={Z.y} x2={FZ.x} y2={FZ.y} stroke="gray" strokeDasharray="4" />
          {a && A && <line x1={A.x} y1={A.y} x2={Z.x} y2={Z.y} stroke="orange" />}
          {a && A && <line x1={A.x} y1={A.y} x2={FZ.x} y2={FZ.y} stroke="orange" />}

          {/* Label */}
          {label && <text x={10} y={20} fontWeight="bold">{label}</text>}
        </svg>
      </Box>

      {/* Footer global */}
      <Card.Root shadow="sm" borderRadius="md" w="full" maxW="lg">
        <Card.Header>
          <Text fontWeight="semibold">Coordonnées actuelles</Text>
        </Card.Header>
        <Card.Body>
          <HStack gap={8}>
            <Text color="blue.600">z = ({z.re}, {z.im})</Text>
            <Text color="green.600">f(z) = ({fz.re}, {fz.im})</Text>
            {a && <Text color="red.600">a = ({a.re}, {a.im})</Text>}
          </HStack>
        </Card.Body>
        <Card.Footer>
          <Text fontSize="sm" color="gray.600">
            Zoom : {scale}px/unité · Décalage X : {offsetX} · Décalage Y : {offsetY}
          </Text>
        </Card.Footer>
      </Card.Root>
    </Flex>
  )
}
