import { useState, useCallback } from "react"
import { Badge, Stack, Text, Button, Table } from "@chakra-ui/react"
import { useColorModeValue } from "@/components/ui/color-mode"
import { motion } from "framer-motion"
import 'katex/dist/katex.min.css'
import { BlockMath } from 'react-katex'

interface Point { x: number; y: number }

export const DraggablePointsSVG = () => {
  const grid = useColorModeValue("#e2e8f0", "#2d3748")

  const [A, setA] = useState<Point>({ x: -40, y: 40 })
  const [B, setB] = useState<Point>({ x: 40, y: 40 })
  const [C, setC] = useState<Point>({ x: 0, y: -40 })
  const [D, setD] = useState<Point>({ x: 20, y: 20 })
  const [dragging, setDragging] = useState<string | null>(null)

  const handleMouseDown = (p: string) => () => setDragging(p)
  const handleMouseUp = () => setDragging(null)
  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    let x = e.clientX - rect.left - 200
    let y = e.clientY - rect.top - 200
    const newPoint = { x, y }
    if (dragging === "A") setA(newPoint)
    if (dragging === "B") setB(newPoint)
    if (dragging === "C") setC(newPoint)
    if (dragging === "D") setD(newPoint)
  }, [dragging])

  // Alignement
  const areaABC = 0.5 * (A.x*(B.y-C.y) + B.x*(C.y-A.y) + C.x*(A.y-B.y))
  const aligned = Math.abs(areaABC) < 1e-2

  // Cercle circonscrit
  const circumcenter = (A: Point, B: Point, C: Point): Point => {
    const d = 2 * (A.x*(B.y-C.y) + B.x*(C.y-A.y) + C.x*(A.y-B.y))
    if (Math.abs(d) < 1e-6) return { x: 0, y: 0 }
    const ux = ((A.x**2 + A.y**2)*(B.y-C.y) + (B.x**2 + B.y**2)*(C.y-A.y) + (C.x**2 + C.y**2)*(A.y-B.y)) / d
    const uy = ((A.x**2 + A.y**2)*(C.x-B.x) + (B.x**2 + B.y**2)*(A.x-C.x) + (C.x**2 + C.y**2)*(B.x-A.x)) / d
    return { x: ux, y: uy }
  }
  const center = circumcenter(A,B,C)
  const radius = Math.sqrt((A.x-center.x)**2 + (A.y-center.y)**2)
  const distD = Math.sqrt((D.x-center.x)**2 + (D.y-center.y)**2)
  const cocyclic = Math.abs(distD - radius) < 10

  // Rapport complexe
  const complexRatio = {
    re: (C.x - A.x) * (B.x - A.x) + (C.y - A.y) * (B.y - A.y),
    im: (C.y - A.y) * (B.x - A.x) - (C.x - A.x) * (B.y - A.y),
  }
  const denom = (B.x - A.x)**2 + (B.y - A.y)**2
  const ratioRe = complexRatio.re / denom
  const ratioIm = complexRatio.im / denom
  const module = Math.sqrt(ratioRe**2 + ratioIm**2)
  const argument = Math.atan2(ratioIm, ratioRe) * 180 / Math.PI

  return (
    <Stack direction="column" gap={4} align="start">
      <Text fontSize="lg" fontWeight="bold">Exploration interactive du plan</Text>

      {/* Boutons de mode */}
      <Stack direction="row" gap={2}>
        <Button size="sm" colorScheme="blue">Progression</Button>
        <Button size="sm" colorScheme="orange">Challenge</Button>
        <Button size="sm" colorScheme="green">Libre</Button>
      </Stack>

      {/* SVG principal */}
      <svg
        viewBox="-200 -200 400 400"
        width="100%"
        height="400px"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor: dragging ? "grabbing" : "default" }}
      >
        {/* Grille */}
        {Array.from({ length: 21 }).map((_, i) => {
          const x = (i-10) * 20
          return <line key={`gx${i}`} x1={x} y1={-200} x2={x} y2={200} stroke={grid} strokeWidth={0.5}/>
        })}
        {Array.from({ length: 21 }).map((_, i) => {
          const y = (i-10) * 20
          return <line key={`gy${i}`} x1={-200} y1={y} x2={200} y2={y} stroke={grid} strokeWidth={0.5}/>
        })}

        {/* Points interactifs animés */}
        {[{P:A,name:"A"},{P:B,name:"B"},{P:C,name:"C"},{P:D,name:"D"}].map(({P,name})=>(
          <motion.circle
            key={name}
            cx={P.x}
            cy={P.y}
            r={5}
            fill="blue"
            onMouseDown={handleMouseDown(name)}
            animate={{ cx: P.x, cy: P.y, r: dragging===name ? [5,8,5] : 5 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={{ r: 7 }}
          />
        ))}

        {/* Cercle circonscrit */}
        {cocyclic && (
          <>
            <circle cx={center.x} cy={center.y} r={radius} stroke="orange" strokeWidth={1} fill="none"/>
            <circle cx={center.x} cy={center.y} r={4} fill="orange"/>
            <text x={center.x+6} y={center.y-6} fontSize="10" fill="orange">O</text>
          </>
        )}
      </svg>

      {/* Badge pour l’alignement */}
      <Badge colorScheme={aligned ? "green":"red"}>
        Alignés (A,B,C): {aligned ? "Oui" : "Non"}
      </Badge>

      {/* Tableau des rapports complexes et cocyclicité */}
      <Text fontWeight="bold" mt={4}>Caractérisations numériques</Text>
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Propriété</Table.ColumnHeader>
            <Table.ColumnHeader>Valeur</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Partie réelle</Table.Cell>
            <Table.Cell>{ratioRe.toFixed(3)}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Partie imaginaire</Table.Cell>
            <Table.Cell>{ratioIm.toFixed(3)}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Module</Table.Cell>
            <Table.Cell>{module.toFixed(3)}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Argument</Table.Cell>
            <Table.Cell>{argument.toFixed(2)}°</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Cocyclicité (A,B,C,D)</Table.Cell>
            <Table.Cell>{cocyclic ? "Oui" : "Non"}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>

            {/* Section théorique en LaTeX */}
      <Text fontWeight="bold" mt={6} fontSize="lg">Caractérisations complexes (formules)</Text>
      <Stack direction="column" gap={3} mt={2}>
        <Text><strong>Alignement :</strong></Text>
        <BlockMath math="\frac{z_C - z_A}{z_B - z_A} \in \mathbb{R}" />

        <Text><strong>Cocyclicité :</strong></Text>
        <BlockMath math="\frac{(z_A - z_B)(z_C - z_D)}{(z_A - z_D)(z_C - z_B)} \in \mathbb{R}" />

        <Text><strong>Distance et module :</strong></Text>
        <BlockMath math="|z_B - z_A|" />

        <Text><strong>Angle et argument :</strong></Text>
        <BlockMath math="\arg\left(\frac{z_B}{z_A}\right)" />
      </Stack>
    </Stack>
  )
}
