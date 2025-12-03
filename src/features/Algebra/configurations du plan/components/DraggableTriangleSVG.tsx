import { useState, useCallback } from "react"
import { Stack, Text, Table } from "@chakra-ui/react"
import { useColorModeValue } from "@/components/ui/color-mode"
import { motion } from "framer-motion"
import 'katex/dist/katex.min.css'
import { BlockMath } from 'react-katex'

interface Point { x: number; y: number }
const round = (x: number, p = 3) => Number(x.toFixed(p))

export const DraggableTriangleSVG = () => {
  const grid = useColorModeValue("#e2e8f0", "#2d3748")
  const accent = "#3182ce"
  const accent2 = "#dd6b20"

  const [A, setA] = useState<Point>({ x: -40, y: 40 })
  const [B, setB] = useState<Point>({ x: 40, y: 40 })
  const [C, setC] = useState<Point>({ x: 0, y: -40 })
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
  }, [dragging])

  // Rapport complexe (zC - zA)/(zB - zA)
  const re = (C.x - A.x) / (B.x - A.x)
  const im = (-(C.y - A.y)) / (B.x - A.x)
  const argDeg = round((Math.atan2(im, re) * 180) / Math.PI)
  const mod = round(Math.sqrt(re * re + im * im))

  // Circumcentre
  const circumcenter = (A: Point, B: Point, C: Point): Point => {
    const d = 2 * (A.x*(B.y-C.y) + B.x*(C.y-A.y) + C.x*(A.y-B.y))
    if (Math.abs(d) < 1e-6) return { x: 0, y: 0 }
    const ux = ((A.x**2 + A.y**2)*(B.y-C.y) + (B.x**2 + B.y**2)*(C.y-A.y) + (C.x**2 + C.y**2)*(A.y-B.y)) / d
    const uy = ((A.x**2 + A.y**2)*(C.x-B.x) + (B.x**2 + B.y**2)*(A.x-C.x) + (C.x**2 + C.y**2)*(B.x-A.x)) / d
    return { x: ux, y: uy }
  }
  const O = circumcenter(A,B,C)
  const R = Math.sqrt((A.x-O.x)**2 + (A.y-O.y)**2)

  // Centroïde
  const G = { x: (A.x + B.x + C.x)/3, y: (A.y + B.y + C.y)/3 }

  // Incentre
  const dist = (P: Point, Q: Point) => Math.sqrt((P.x-Q.x)**2 + (P.y-Q.y)**2)
  const a = dist(B,C), b = dist(A,C), c = dist(A,B)
  const I = { x: (a*A.x + b*B.x + c*C.x)/(a+b+c), y: (a*A.y + b*B.y + c*C.y)/(a+b+c) }
  const inradius = Math.abs((B.y - A.y)*I.x - (B.x - A.x)*I.y + B.x*A.y - B.y*A.x) /
                   Math.sqrt((B.y - A.y)**2 + (B.x - A.x)**2)

  // Orthocentre
  const orthocenter = (A: Point, B: Point, C: Point): Point => {
    const slopeAB = (B.y - A.y) / (B.x - A.x)
    const slopeBC = (C.y - B.y) / (C.x - B.x)
    const slopeCH = -1 / slopeAB
    const slopeAH = -1 / slopeBC
    const pCH = C.y - slopeCH * C.x
    const pAH = A.y - slopeAH * A.x
    const xH = (pAH - pCH) / (slopeCH - slopeAH)
    const yH = slopeCH * xH + pCH
    return { x: xH, y: yH }
  }
  const H = orthocenter(A,B,C)

  return (
    <Stack direction="column" gap={4} align="start">
      <Text fontSize="lg" fontWeight="bold">Exploration interactive du triangle</Text>

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

        {/* Triangle */}
        <motion.polyline
          points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${A.x},${A.y}`}
          fill="none"
          stroke={accent}
          strokeWidth={2}
        />

        {/* Points interactifs */}
        {[{P:A,name:"A",color:accent},{P:B,name:"B",color:accent},{P:C,name:"C",color:accent2}]
          .map(({P,name,color})=>(
            <motion.circle
              key={name}
              cx={P.x} cy={P.y} r={5} fill={color}
              onMouseDown={handleMouseDown(name)}
              animate={{ cx: P.x, cy: P.y }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              whileHover={{ r: 7 }}
            />
          ))}

        {/* Cercle circonscrit animé */}
        <motion.circle
          cx={O.x}
          cy={O.y}
          r={R}
          stroke="orange"
          strokeWidth={1.5}
          fill="none"
          initial={{ r: 0, opacity: 0 }}
          animate={{ r: R, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <motion.circle cx={O.x} cy={O.y} r={4} fill="orange"/>
        <motion.text x={O.x+6} y={O.y-6} fontSize="10" fill="orange">O</motion.text>

        {/* Cercle inscrit animé */}
        <motion.circle
          cx={I.x}
          cy={I.y}
          r={inradius}
          stroke="green"
          strokeWidth={1.5}
          fill="none"
          initial={{ r: 0, opacity: 0 }}
          animate={{ r: inradius, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <motion.circle cx={I.x} cy={I.y} r={4} fill="green"/>
                <motion.text x={I.x+6} y={I.y-6} fontSize="10" fill="green">I</motion.text>

        {/* Centroïde */}
        <motion.circle cx={G.x} cy={G.y} r={4} fill="purple"/>
        <motion.text x={G.x+6} y={G.y-6} fontSize="10" fill="purple">G</motion.text>

        {/* Orthocentre */}
        <motion.circle cx={H.x} cy={H.y} r={4} fill="red"/>
        <motion.text x={H.x+6} y={H.y-6} fontSize="10" fill="red">H</motion.text>
      </svg>

      {/* Coordonnées des sommets */}
      <Text fontWeight="bold" mt={6}>Coordonnées des sommets</Text>
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Point</Table.ColumnHeader>
            <Table.ColumnHeader>x</Table.ColumnHeader>
            <Table.ColumnHeader>y</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row><Table.Cell>A</Table.Cell><Table.Cell>{round(A.x)}</Table.Cell><Table.Cell>{round(A.y)}</Table.Cell></Table.Row>
          <Table.Row><Table.Cell>B</Table.Cell><Table.Cell>{round(B.x)}</Table.Cell><Table.Cell>{round(B.y)}</Table.Cell></Table.Row>
          <Table.Row><Table.Cell>C</Table.Cell><Table.Cell>{round(C.x)}</Table.Cell><Table.Cell>{round(C.y)}</Table.Cell></Table.Row>
        </Table.Body>
      </Table.Root>

      {/* Tableau des centres remarquables */}
      <Text fontWeight="bold" mt={6}>Centres remarquables du triangle</Text>
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Centre</Table.ColumnHeader>
            <Table.ColumnHeader>Coordonnées (x, y)</Table.ColumnHeader>
            <Table.ColumnHeader>Rayon (si cercle)</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row><Table.Cell>Circumcentre O</Table.Cell><Table.Cell>({round(O.x)}, {round(O.y)})</Table.Cell><Table.Cell>{round(R)}</Table.Cell></Table.Row>
          <Table.Row><Table.Cell>Centroïde G</Table.Cell><Table.Cell>({round(G.x)}, {round(G.y)})</Table.Cell><Table.Cell>-</Table.Cell></Table.Row>
          <Table.Row><Table.Cell>Incentre I</Table.Cell><Table.Cell>({round(I.x)}, {round(I.y)})</Table.Cell><Table.Cell>{round(inradius)}</Table.Cell></Table.Row>
          <Table.Row><Table.Cell>Orthocentre H</Table.Cell><Table.Cell>({round(H.x)}, {round(H.y)})</Table.Cell><Table.Cell>-</Table.Cell></Table.Row>
        </Table.Body>
      </Table.Root>

      {/* Section théorique en LaTeX avec valeurs dynamiques */}
      <Text fontWeight="bold" mt={6} fontSize="lg">Caractérisations complexes (formules dynamiques)</Text>
      <Stack direction="column" gap={3} mt={2}>
        <Text><strong>Alignement :</strong></Text>
        <BlockMath math={`\\frac{z_C - z_A}{z_B - z_A} = ${re.toFixed(3)} + ${im.toFixed(3)}i`} />

        <Text><strong>Module :</strong></Text>
        <BlockMath math={`|z_C - z_A| / |z_B - z_A| = ${mod}`} />

        <Text><strong>Argument :</strong></Text>
        <BlockMath math={`\\arg\\left(\\frac{z_C - z_A}{z_B - z_A}\\right) = ${argDeg}^\\circ`} />

        <Text><strong>Cercle circonscrit :</strong></Text>
        <BlockMath math={`|z - z_A| = |z - z_B| = |z - z_C| \\quad (O(${round(O.x)},${round(O.y)}), R=${round(R)})`} />

        <Text><strong>Cercle inscrit :</strong></Text>
        <BlockMath math={`|z - I| = r \\quad (I(${round(I.x)},${round(I.y)}), r=${round(inradius)})`} />

        <Text><strong>Centroïde :</strong></Text>
        <BlockMath math={`G = \\frac{z_A + z_B + z_C}{3} = (${round(G.x)}, ${round(G.y)})`} />

        <Text><strong>Orthocentre :</strong></Text>
        <BlockMath math={`H = (${round(H.x)}, ${round(H.y)})`} />
      </Stack>
    </Stack>
  )
}
