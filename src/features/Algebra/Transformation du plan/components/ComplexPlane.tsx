"use client"

import React, { useState, useMemo } from "react"
import {
  Box,
  Flex,
  Text,
  HStack,
  Grid,
  GridItem,
  Slider,
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
  const [scale, setScale] = useState(40)
  const [offsetX, setOffsetX] = useState(width / 2)
  const [offsetY, setOffsetY] = useState(height / 2)

  const origin = { x: offsetX, y: offsetY }

  const Z = toSVG(z, scale, origin)
  const FZ = toSVG(fz, scale, origin)
  const A = a ? toSVG(a, scale, origin) : null

  // ✅ Grille centrée sur l’origine
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
      {/* Contrôles interactifs regroupés dans un Grid responsive avec Cards */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} w="full" maxW="lg">
        
        {/* Zoom */}
        <GridItem>
          <Card.Root shadow="md" borderRadius="lg">
            <Card.Header>
              <HStack justify="space-between">
                <Text fontWeight="semibold">Zoom (px/unité)</Text>
                <Slider.ValueText>{scale}</Slider.ValueText>
              </HStack>
            </Card.Header>
            <Card.Body>
              <Slider.Root
                value={[scale]}
                min={20}
                max={80}
                step={5}
                onValueChange={(details) => setScale(details.value[0])}
              >
                <Slider.Track>
                  <Slider.Range />
                </Slider.Track>
                <Slider.Thumbs />
                <Slider.DraggingIndicator>
                  <Slider.ValueText />
                </Slider.DraggingIndicator>
                <Slider.Marks
                  marks={[
                    { value: 20, label: "20" },
                    { value: 40, label: "40" },
                    { value: 60, label: "60" },
                    { value: 80, label: "80" },
                  ]}
                />
              </Slider.Root>
            </Card.Body>
            <Card.Footer>
              <Text fontSize="sm" color="gray.600">Zoom actuel : {scale}px/unité</Text>
            </Card.Footer>
          </Card.Root>
        </GridItem>

        {/* Translation X */}
        <GridItem>
          <Card.Root shadow="md" borderRadius="lg">
            <Card.Header>
              <HStack justify="space-between">
                <Text fontWeight="semibold">Translation X</Text>
                <Slider.ValueText>{offsetX}</Slider.ValueText>
              </HStack>
            </Card.Header>
            <Card.Body>
              <Slider.Root
                value={[offsetX]}
                min={0}
                max={width}
                step={10}
                onValueChange={(details) => setOffsetX(details.value[0])}
              >
                <Slider.Track>
                  <Slider.Range />
                </Slider.Track>
                <Slider.Thumbs />
                <Slider.DraggingIndicator>
                  <Slider.ValueText />
                </Slider.DraggingIndicator>
                <Slider.Marks
                  marks={[
                    { value: 0, label: "0" },
                    { value: width / 2, label: "center" },
                    { value: width, label: `${width}` },
                  ]}
                />
              </Slider.Root>
            </Card.Body>
            <Card.Footer>
              <Text fontSize="sm" color="gray.600">Décalage X : {offsetX}</Text>
            </Card.Footer>
          </Card.Root>
        </GridItem>

        {/* Translation Y en vertical */}
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <Card.Root shadow="md" borderRadius="lg">
            <Card.Header>
              <HStack justify="space-between">
                <Text fontWeight="semibold">Translation Y</Text>
                <Slider.ValueText>{offsetY}</Slider.ValueText>
              </HStack>
            </Card.Header>
            <Card.Body>
              <Flex justify="center" h="200px">
                <Slider.Root
                  orientation="vertical"
                  value={[offsetY]}
                  min={0}
                  max={height}
                  step={10}
                  onValueChange={(details) => setOffsetY(details.value[0])}
                  h="full"
                >
                  <Slider.Track>
                    <Slider.Range />
                  </Slider.Track>
                  <Slider.Thumbs />
                  <Slider.DraggingIndicator>
                    <Slider.ValueText />
                  </Slider.DraggingIndicator>
                  <Slider.Marks
                    marks={[
                      { value: 0, label: "0" },
                      { value: height / 2, label: "center" },
                      { value: height, label: `${height}` },
                    ]}
                  />
                </Slider.Root>
              </Flex>
            </Card.Body>
            <Card.Footer>
              <Text fontSize="sm" color="gray.600">Décalage Y : {offsetY}</Text>
            </Card.Footer>
          </Card.Root>
        </GridItem>
      </Grid>

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

          {A && (
            <>
              <circle cx={A.x} cy={A.y} r={5} fill="red" />
              <text x={A.x + 5} y={A.y - 5}>a</text>
            </>
          )}

          {/* Projections */}
          {showProjections && (
            <>
                           {/* Projections de f(z) */}
              <line x1={FZ.x} y1={FZ.y} x2={FZ.x} y2={origin.y} stroke="green" strokeDasharray="2" />
              <line x1={FZ.x} y1={FZ.y} x2={origin.x} y2={FZ.y} stroke="green" strokeDasharray="2" />
              <text x={FZ.x} y={origin.y + 30} fontSize="10">{fz.re}</text>
              <text x={origin.x - 25} y={FZ.y} fontSize="10">{fz.im}</text>
            </>
          )}

          {/* Vecteurs */}
          <line x1={Z.x} y1={Z.y} x2={FZ.x} y2={FZ.y} stroke="gray" strokeDasharray="4" />
          {A && <line x1={A.x} y1={A.y} x2={Z.x} y2={Z.y} stroke="orange" />}
          {A && <line x1={A.x} y1={A.y} x2={FZ.x} y2={FZ.y} stroke="orange" />}

          {/* Label */}
          {label && <text x={10} y={20} fontWeight="bold">{label}</text>}
        </svg>
      </Box>

      {/* Footer global pour afficher les coordonnées */}
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
