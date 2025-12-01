import { useState, useCallback } from "react"
import {
  Badge,
  Stack,
  Text,
  Slider,
  SliderTrack,
  SliderRange,
  SliderThumb,
} from "@chakra-ui/react"
import { useColorModeValue } from "@/components/ui/color-mode"
import { motion } from "framer-motion"

interface Point { x: number; y: number }

export const DraggablePointsSVG = () => {
  const grid = useColorModeValue("#e2e8f0", "#2d3748")
  const accent = "#3182ce"
  const accent2 = "#dd6b20"

  const [A, setA] = useState<Point>({ x: 40, y: 100 })
  const [B, setB] = useState<Point>({ x: 140, y: 100 })
  const [C, setC] = useState<Point>({ x: 90, y: 40 })
  const [D, setD] = useState<Point>({ x: 120, y: 60 })
  const [dragging, setDragging] = useState<string | null>(null)

  const [highlightX, setHighlightX] = useState<number | null>(null)
  const [highlightY, setHighlightY] = useState<number | null>(null)
  const [nearGrid, setNearGrid] = useState<string | null>(null)

  const handleMouseDown = (p: string) => () => setDragging(p)
  const handleMouseUp = () => setDragging(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    let x = e.clientX - rect.left
    let y = e.clientY - rect.top

    const vb = e.currentTarget.viewBox.baseVal
    const minX = vb.x, minY = vb.y
    const maxX = vb.x + vb.width, maxY = vb.y + vb.height

    x = Math.max(minX, Math.min(maxX, x))
    y = Math.max(minY, Math.min(maxY, y))

    const gridSize = 20
    const snapX = Math.round(x / gridSize) * gridSize
    const snapY = Math.round(y / gridSize) * gridSize

    setHighlightX(Math.abs(x - snapX) < 8 ? snapX : null)
    setHighlightY(Math.abs(y - snapY) < 8 ? snapY : null)
    setNearGrid(Math.abs(x - snapX) < 8 && Math.abs(y - snapY) < 8 ? dragging : null)

    if (Math.abs(x - snapX) < 5) x = snapX
    if (Math.abs(y - snapY) < 5) y = snapY

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
  const cocyclic = Math.abs(distD - radius) < 5

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
    <Stack direction="column" gap={3} align="start">
      {/* SVG principal */}
      <svg viewBox="0 0 200 150" width="100%" height="200px"
        onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}
        style={{ cursor: dragging ? "grabbing" : "default" }}>
        
        {/* Grille */}
        {Array.from({ length: 10 }).map((_, i) => {
          const x = i * 20
          return <line key={`gx${i}`} x1={x} y1={0} x2={x} y2={150}
            stroke={highlightX === x ? "orange" : grid}
            strokeWidth={highlightX === x ? 2 : 0.5}/>
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const y = i * 20
          return <line key={`gy${i}`} x1={0} y1={y} x2={200} y2={y}
            stroke={highlightY === y ? "orange" : grid}
            strokeWidth={highlightY === y ? 2 : 0.5}/>
        })}

        {/* Cercle circonscrit */}
        {!aligned && radius > 0 && (
          <motion.circle cx={center.x} cy={center.y} r={radius}
            stroke={cocyclic ? "green" : "red"} fill="none" strokeDasharray="4"
            animate={cocyclic ? { r: [radius-2, radius+2, radius-2] } : { r: radius }}
            transition={cocyclic ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : {}}/>
        )}
        {!aligned && radius > 0 && (
          <>
            <circle cx={center.x} cy={center.y} r={4} fill="purple" />
            <text x={center.x+6} y={center.y-6} fontSize="10" fill="purple">O</text>
          </>
        )}

        {/* Points */}
        {[{P:A,name:"A",color:accent},{P:B,name:"B",color:accent},{P:C,name:"C",color:accent2},{P:D,name:"D",color:accent2}]
          .map(({P,name,color})=>(
            <g key={name}>
              {nearGrid === name && (
                <motion.circle cx={P.x} cy={P.y} r={12} fill="none" stroke="gold" strokeWidth={2}
                  animate={{ opacity: [0.6, 0.2, 0.6] }} transition={{ duration: 1, repeat: Infinity }}/>
              )}
              <motion.circle cx={P.x} cy={P.y} r={5} fill={color}
                onMouseDown={handleMouseDown(name)}
                animate={{ cx: P.x, cy: P.y, r: dragging===name ? [5,8,5] : 5 }}
                transition={{ duration: 0.4, ease: "easeOut" }} whileHover={{ r: 7 }}/>
              <text x={P.x+6} y={P.y-6} fontSize="10" fill="black">{name}</text>
            </g>
          ))}
      </svg>

      {/* Badges */}
      <Stack direction="row" gap={4} flexWrap="wrap">
        <Badge colorScheme={aligned ? "green":"gray"}>Alignés (A,B,C): {aligned?"Oui":"Non"}</Badge>
                <Badge colorScheme={cocyclic ? "green":"red"}>
          Cocycliques (A,B,C,D): {cocyclic ? "Oui" : "Non"}
        </Badge>
        <Badge colorScheme="blue">
          Rapport complexe: {ratioRe.toFixed(3)} + {ratioIm.toFixed(3)} i
        </Badge>
        <Badge colorScheme="purple">
          |ratio| = {module.toFixed(3)}
        </Badge>
        <Badge colorScheme="orange">
          arg(ratio) = {argument.toFixed(2)}°
        </Badge>
      </Stack>

      {/* Plan complexe avec cercle unité */}
      <svg viewBox="-1.5 -1.5 3 3" width="220" height="220" style={{ border: "1px solid #ccc", marginTop: "10px" }}>
        {/* Axes */}
        <line x1={-1.5} y1={0} x2={1.5} y2={0} stroke="black" strokeWidth={0.02}/>
        <line x1={0} y1={-1.5} x2={0} y2={1.5} stroke="black" strokeWidth={0.02}/>

        {/* Cercle unité */}
        <circle cx={0} cy={0} r={1} stroke="gray" fill="none" strokeDasharray="4"/>

        {/* Arc pour l’argument */}
        <path
          d={`M 0 0 L 1 0 A 1 1 0 ${argument>180?1:0} ${argument<0?0:1} ${Math.cos(argument*Math.PI/180)} ${-Math.sin(argument*Math.PI/180)} Z`}
          fill="rgba(255,165,0,0.2)" stroke="orange" strokeWidth={0.02}
        />

        {/* Vecteur du rapport complexe */}
        <line
          x1={0} y1={0}
          x2={ratioRe} y2={-ratioIm}
          stroke={module <= 1 ? "green" : "red"}
          strokeWidth={0.05}
          markerEnd="url(#arrow)"
        />

        {/* Point du rapport */}
        <circle cx={ratioRe} cy={-ratioIm} r={0.07} fill={module <= 1 ? "green" : "red"} />

        {/* Étiquette du module */}
        <text x={ratioRe+0.1} y={-ratioIm-0.1} fontSize="0.15" fill="blue">
          |z| = {module.toFixed(2)}
        </text>

        {/* Définition flèche */}
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5"
            orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L10,5 L0,10 Z" fill="blue" />
          </marker>
        </defs>
      </svg>

      {/* Panneau interactif avec sliders Chakra v3 */}
      <Stack direction="column" gap={4} width="100%" maxW="400px">
        {[
          {label:"A", point:A, setter:setA},
          {label:"B", point:B, setter:setB},
          {label:"C", point:C, setter:setC},
          {label:"D", point:D, setter:setD},
        ].map(({label,point,setter})=>(
          <Stack key={label} direction="column" gap={2}>
            <Text fontWeight="bold">Point {label}</Text>

            {/* Slider X */}
            <Text>X = {point.x.toFixed(0)}</Text>
            <Slider.Root
              min={0}
              max={200}
              value={[point.x]}
              onValueChange={(details) => setter({ ...point, x: details.value[0] })}
            >
              <SliderTrack>
                <SliderRange />
              </SliderTrack>
              <SliderThumb index={0} />
            </Slider.Root>

            {/* Slider Y */}
            <Text>Y = {point.y.toFixed(0)}</Text>
            <Slider.Root
              min={0}
              max={150}
              value={[point.y]}
              onValueChange={(details) => setter({ ...point, y: details.value[0] })}
            >
              <SliderTrack>
                <SliderRange />
              </SliderTrack>
              <SliderThumb index={0} />
            </Slider.Root>
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}
