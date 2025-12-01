import { useState, useCallback } from "react"
import { Badge, Stack} from "@chakra-ui/react"
import { useColorModeValue } from "@/components/ui/color-mode";
import { motion } from "framer-motion"

interface Point { x: number; y: number }
const round = (x: number, p = 3) => Number(x.toFixed(p))

export const DraggableLinesSVG = () => {
  const grid = useColorModeValue("#e2e8f0", "#2d3748")
  const accentAB = "#3182ce"
  const accentCD = "#dd6b20"

  const [A, setA] = useState<Point>({ x: 40, y: 100 })
  const [B, setB] = useState<Point>({ x: 140, y: 100 })
  const [C, setC] = useState<Point>({ x: 60, y: 40 })
  const [D, setD] = useState<Point>({ x: 160, y: 40 })
  const [dragging, setDragging] = useState<string | null>(null)

  const handleMouseDown = (p: string) => () => setDragging(p)
  const handleMouseUp = () => setDragging(null)
  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const newPoint = { x, y }
    if (dragging === "A") setA(newPoint)
    if (dragging === "B") setB(newPoint)
    if (dragging === "C") setC(newPoint)
    if (dragging === "D") setD(newPoint)
  }, [dragging])

  const vAB = { x: B.x - A.x, y: B.y - A.y }
  const vCD = { x: D.x - C.x, y: D.y - C.y }
  const dot = vAB.x * vCD.x + vAB.y * vCD.y
  const cross = vAB.x * vCD.y - vAB.y * vCD.x
  const angleDeg = round((Math.atan2(cross, dot) * 180) / Math.PI)
  const isParallel = Math.abs(cross) < 1e-2
  const isPerp = Math.abs(dot) < 1e-2

  return (
    <Stack direction="column" gap={3} align="start">
      <svg
        viewBox="0 0 200 150"
        width="100%"
        height="200px"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor: dragging ? "grabbing" : "default" }}
      >
        {/* Grille */}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`gx${i}`} x1={i*20} y1={0} x2={i*20} y2={150} stroke={grid} strokeWidth={0.5}/>
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`gy${i}`} x1={0} y1={i*20} x2={200} y2={i*20} stroke={grid} strokeWidth={0.5}/>
        ))}

        {/* AB */}
        <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={accentAB} strokeWidth={2}/>
        <motion.circle cx={A.x} cy={A.y} r={5} fill={accentAB}
          onMouseDown={handleMouseDown("A")}
          animate={{ cx: A.x, cy: A.y }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          whileHover={{ r: 7 }}
        />
        <motion.circle cx={B.x} cy={B.y} r={5} fill={accentAB}
          onMouseDown={handleMouseDown("B")}
          animate={{ cx: B.x, cy: B.y }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          whileHover={{ r: 7 }}
        />

        {/* CD */}
        <line x1={C.x} y1={C.y} x2={D.x} y2={D.y} stroke={accentCD} strokeWidth={2}/>
        <motion.circle cx={C.x} cy={C.y} r={5} fill={accentCD}
          onMouseDown={handleMouseDown("C")}
          animate={{ cx: C.x, cy: C.y }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          whileHover={{ r: 7 }}
        />
        <motion.circle cx={D.x} cy={D.y} r={5} fill={accentCD}
          onMouseDown={handleMouseDown("D")}
          animate={{ cx: D.x, cy: D.y }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          whileHover={{ r: 7 }}
        />
      </svg>

      <Stack direction="row" gap={4} flexWrap="wrap">
        <Badge colorScheme="purple">θ = {angleDeg}°</Badge>
        <Badge colorScheme={isParallel ? "green" : "gray"}>Parallèles: {isParallel ? "Oui" : "Non"}</Badge>
        <Badge colorScheme={isPerp ? "green" : "gray"}>Perpendiculaires: {isPerp ? "Oui" : "Non"}</Badge>
      </Stack>
    </Stack>
  )
}
