import { useState, useCallback } from "react"
import { Badge, Stack } from "@chakra-ui/react"
import { useColorModeValue } from "@/components/ui/color-mode";
import { motion } from "framer-motion"

interface Point { x: number; y: number }
const round = (x: number, p = 3) => Number(x.toFixed(p))

export const DraggableTriangleSVG = () => {
  const grid = useColorModeValue("#e2e8f0", "#2d3748")
  const accent = "#3182ce"
  const accent2 = "#dd6b20"

  const [A, setA] = useState<Point>({ x: 40, y: 100 })
  const [B, setB] = useState<Point>({ x: 140, y: 100 })
  const [C, setC] = useState<Point>({ x: 90, y: 40 })
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
  }, [dragging])

  // Ratio (zC - zA)/(zB - zA)
  const re = (C.x - A.x) / (B.x - A.x)
  const im = (-(C.y - A.y)) / (B.x - A.x)
  const argDeg = round((Math.atan2(im, re) * 180) / Math.PI)
  const mod = round(Math.sqrt(re * re + im * im))

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

        {/* Triangle */}
        <motion.polyline
          points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${A.x},${A.y}`}
          fill="none"
          stroke={accent}
          strokeWidth={2}
          animate={{ points: `${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${A.x},${A.y}` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />

        {[{P:A,name:"A",color:accent},{P:B,name:"B",color:accent},{P:C,name:"C",color:accent2}]
          .map(({P,name,color})=>(
            <g key={name}>
              <motion.circle
                cx={P.x} cy={P.y} r={5} fill={color}
                onMouseDown={handleMouseDown(name)}
                animate={{ cx: P.x, cy: P.y }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                whileHover={{ r: 7 }}
              />
              <text x={P.x+6} y={P.y-6} fontSize="10" fill="black">{name}</text>
            </g>
          ))}
      </svg>

      <Stack direction="row" gap={4} flexWrap="wrap">
        <Badge colorScheme="purple">ratio = {round(re)} + {round(im)} i</Badge>
        <Badge colorScheme="orange">arg = {argDeg}°</Badge>
        <Badge colorScheme="teal">|ratio| = {mod}</Badge>
      </Stack>
    </Stack>
  )
}
