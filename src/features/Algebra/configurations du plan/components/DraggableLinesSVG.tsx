import { useState, useCallback, useEffect } from "react"
import {
  Badge,
  Stack,
  Text,
  Button,
  Table,
} from "@chakra-ui/react"
import { useColorModeValue } from "@/components/ui/color-mode"
import { motion } from "framer-motion"

interface Point {
  x: number
  y: number
}

const round = (x: number, p = 2) => Number(x.toFixed(p))

const levels = [
  { id: 1, goal: "parallel", label: "Rends les droites parallèles" },
  { id: 2, goal: "perp", label: "Rends les droites perpendiculaires" },
  { id: 3, goal: "angle", label: "Fais un angle ≈ 45°", targetAngle: 45 },
  { id: 4, goal: "isosceles", label: "Construis un triangle isocèle (AB = AC)" },
]

export const DraggableLinesSVG = () => {
  const grid = useColorModeValue("#e2e8f0", "#2d3748")
  const accentAB = "#3182ce"
  const accentCD = "#dd6b20"

  // Points initiaux dans un repère centré
  const [A, setA] = useState<Point>({ x: -2, y: 0 })
  const [B, setB] = useState<Point>({ x: 2, y: 0 })
  const [C, setC] = useState<Point>({ x: -1, y: 2 })
  const [D, setD] = useState<Point>({ x: 3, y: 2 })
  const [dragging, setDragging] = useState<string | null>(null)

  const handleMouseDown = (p: string) => () => setDragging(p)
  const handleMouseUp = () => setDragging(null)
  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 10 - 5
    const y = ((e.clientY - rect.top) / rect.height) * 10 - 5
    const newPoint = { x, y }
    if (dragging === "A") setA(newPoint)
    if (dragging === "B") setB(newPoint)
    if (dragging === "C") setC(newPoint)
    if (dragging === "D") setD(newPoint)
  }, [dragging])

  // Vecteurs
  const vAB = { x: B.x - A.x, y: B.y - A.y }
  const vCD = { x: D.x - C.x, y: D.y - C.y }
  const dot = vAB.x * vCD.x + vAB.y * vCD.y
  const cross = vAB.x * vCD.y - vAB.y * vCD.x
  const angleDeg = round(((Math.atan2(cross, dot) * 180) / Math.PI + 360) % 360)
  const isParallel = Math.abs(cross) < 1e-2
  const isPerp = Math.abs(dot) < 1e-2

  // Affixes complexes
  const zA = { re: A.x, im: A.y }
  const zB = { re: B.x, im: B.y }
  const zC = { re: C.x, im: C.y }
  const zD = { re: D.x, im: D.y }

  const complexDiv = (num: { re: number; im: number }, den: { re: number; im: number }) => {
    const denom = den.re ** 2 + den.im ** 2
    return {
      re: round((num.re * den.re + num.im * den.im) / denom),
      im: round((num.im * den.re - num.re * den.im) / denom),
    }
  }

  // Rapport parallélisme
  const parallelRatio = complexDiv(
    { re: zD.re - zC.re, im: zD.im - zC.im },
    { re: zB.re - zA.re, im: zB.im - zA.im }
  )

  // Rapport perpendicularité
  const perpRatio = complexDiv(
    { re: zB.re - zA.re, im: zB.im - zA.im },
    { re: zD.re - zC.re, im: zD.im - zC.im }
  )

  // Modes
  const [mode, setMode] = useState<"progression"|"challenge"|"libre">("libre")
  const [currentLevel, setCurrentLevel] = useState(0)
  const [success, setSuccess] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (mode!=="progression") return
    const level = levels[currentLevel]
    if (!level) return

    if (level.goal === "parallel" && isParallel) setSuccess(true)
    else if (level.goal === "perp" && isPerp) setSuccess(true)
    else if (level.goal === "angle" && Math.abs(angleDeg - (level.targetAngle ?? 0)) < 5) setSuccess(true)
    else if (level.goal === "isosceles") {
      const distAB = Math.hypot(A.x-B.x, A.y-B.y)
      const distAC = Math.hypot(A.x-C.x, A.y-C.y)
      setSuccess(Math.abs(distAB - distAC) < 0.2)
    } else setSuccess(false)
  }, [mode, currentLevel, isParallel, isPerp, angleDeg, A, B, C])

  useEffect(() => {
    if (mode==="progression" && success) {
      setScore(prev => prev + 1)
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1)
        setSuccess(false)
      }, 1500)
    }
  }, [success, mode])

  return (
    <Stack direction="column" gap={3} align="start">
      {/* SVG principal */}
      <svg
        viewBox="-5 -5 10 10"
        width="100%"
        height="300px"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor: dragging ? "grabbing" : "default" }}
      >
        {/* Grille */}
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`gx${i}`} x1={-5 + i} y1={-5} x2={-5 + i} y2={5} stroke={grid} strokeWidth={0.02}/>
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`gy${i}`} x1={-5} y1={-5 + i} x2={5} y2={-5 + i} stroke={grid} strokeWidth={0.02}/>
        ))}

        {/* Axes */}
        <line x1={-5} y1={0} x2={5} y2={0} stroke="black" strokeWidth={0.05}/>
        <line x1={0} y1={-5} x2={0} y2={5} stroke="black" strokeWidth={0.05}/>

        {/* Droite AB */}
        <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={accentAB} strokeWidth={0.1}/>
        {[{P:A,name:"A"},{P:B,name:"B"}].map(({P,name})=>(
          <motion.circle key={name} cx={P.x} cy={P.y} r={0.15} fill={accentAB}
            onMouseDown={handleMouseDown(name)}
            animate={{ cx: P.x, cy: P.y, r: dragging===name ? [0.15,0.25,0.15] : 0.15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={{ r: 0.2 }}
          />
        ))}

               {/* Droite CD */}
        <line x1={C.x} y1={C.y} x2={D.x} y2={D.y} stroke={accentCD} strokeWidth={0.1}/>
        {[{P:C,name:"C"},{P:D,name:"D"}].map(({P,name})=>(
          <motion.circle key={name} cx={P.x} cy={P.y} r={0.15} fill={accentCD}
            onMouseDown={handleMouseDown(name)}
            animate={{ cx: P.x, cy: P.y, r: dragging===name ? [0.15,0.25,0.15] : 0.15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={{ r: 0.2 }}
          />
        ))}

        {/* Arc angle */}
        <path
          d={`M ${A.x} ${A.y} 
              L ${A.x + vAB.x*0.3} ${A.y + vAB.y*0.3}
              A 1 1 0 0 1 ${A.x + vCD.x*0.3} ${A.y + vCD.y*0.3}
              Z`}
          fill="rgba(255,165,0,0.2)" stroke="orange" strokeWidth={0.05}
        />
        <text x={A.x+0.5} y={A.y-0.5} fontSize="0.4" fill="orange">θ={angleDeg}°</text>
      </svg>

      {/* Choix du mode */}
      <Stack direction="row" gap={2} mt={3}>
        <Button size="sm" colorScheme={mode==="progression"?"blue":"gray"} onClick={() => setMode("progression")}>
          Progression
        </Button>
        <Button size="sm" colorScheme={mode==="challenge"?"blue":"gray"} onClick={() => setMode("challenge")}>
          Challenge
        </Button>
        <Button size="sm" colorScheme={mode==="libre"?"blue":"gray"} onClick={() => setMode("libre")}>
          Libre
        </Button>
      </Stack>

      {/* Feedback progression */}
      {mode==="progression" && (
        <Stack direction="column" gap={2} mt={2}>
          {currentLevel < levels.length ? (
            <>
              <Text>{levels[currentLevel].label}</Text>
              <Text fontSize="sm" color={success ? "green.600":"red.600"}>
                {success ? "✅ Bravo !" : "❌ Continue…"}
              </Text>
            </>
          ) : (
            <Text fontWeight="bold" color="green.600">🎉 Félicitations, progression terminée !</Text>
          )}
          <Badge colorScheme="purple">Score: {score}</Badge>
        </Stack>
      )}

      {/* Feedback libre */}
      {mode==="libre" && (
        <Stack direction="column" gap={2} mt={2}>
          <Text>Mode libre activé : explore les points et observe les propriétés des droites.</Text>
          <Stack direction="row" gap={4}>
            <Badge colorScheme="purple">θ = {angleDeg}°</Badge>
            <Badge colorScheme={isParallel ? "green":"gray"}>Parallèles: {isParallel ? "Oui":"Non"}</Badge>
            <Badge colorScheme={isPerp ? "green":"gray"}>Perpendiculaires: {isPerp ? "Oui":"Non"}</Badge>
          </Stack>
        </Stack>
      )}

      {/* 🔹 Caractérisations complexes */}
      <Text fontWeight="bold" mt={4}>Caractérisations complexes</Text>

      <Table.ScrollArea>
        <Table.Root size="sm" variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Propriété</Table.ColumnHeader>
              <Table.ColumnHeader>Rapport complexe</Table.ColumnHeader>
              <Table.ColumnHeader>Partie réelle</Table.ColumnHeader>
              <Table.ColumnHeader>Partie imaginaire</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell>Parallélisme (AB ∥ CD)</Table.Cell>
              <Table.Cell>(zD - zC) / (zB - zA)</Table.Cell>
              <Table.Cell>{parallelRatio.re}</Table.Cell>
              <Table.Cell>{parallelRatio.im}</Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell>Perpendicularité (AB ⟂ CD)</Table.Cell>
              <Table.Cell>(zB - zA) / (zD - zC)</Table.Cell>
              <Table.Cell>{perpRatio.re}</Table.Cell>
              <Table.Cell>{perpRatio.im}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      <Stack direction="row" gap={4} mt={2}>
        <Badge colorScheme={Math.abs(parallelRatio.im) < 1e-2 ? "green":"gray"}>
          Parallèles: {Math.abs(parallelRatio.im) < 1e-2 ? "Oui":"Non"}
        </Badge>
        <Badge colorScheme={Math.abs(perpRatio.re) < 1e-2 ? "green":"gray"}>
          Perpendiculaires: {Math.abs(perpRatio.re) < 1e-2 ? "Oui":"Non"}
        </Badge>
      </Stack>
    </Stack>
  )
}
