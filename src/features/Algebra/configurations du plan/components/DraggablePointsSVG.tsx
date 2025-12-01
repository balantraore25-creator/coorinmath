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

  const [A, setA] = useState<Point>({ x: -40, y: 40 })
  const [B, setB] = useState<Point>({ x: 40, y: 40 })
  const [C, setC] = useState<Point>({ x: 0, y: -40 })
  const [D, setD] = useState<Point>({ x: 20, y: 20 })
  const [dragging, setDragging] = useState<string | null>(null)

  const [highlightX, setHighlightX] = useState<number | null>(null)
  const [highlightY, setHighlightY] = useState<number | null>(null)
  const [nearGrid, setNearGrid] = useState<string | null>(null)

  const handleMouseDown = (p: string) => () => setDragging(p)
  const handleMouseUp = () => setDragging(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    let x = e.clientX - rect.left - 100
    let y = e.clientY - rect.top - 100

    const gridSize = 10
    const snapX = Math.round(x / gridSize) * gridSize
    const snapY = Math.round(y / gridSize) * gridSize

    setHighlightX(Math.abs(x - snapX) < 5 ? snapX : null)
    setHighlightY(Math.abs(y - snapY) < 5 ? snapY : null)
    setNearGrid(Math.abs(x - snapX) < 5 && Math.abs(y - snapY) < 5 ? dragging : null)

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
      <svg viewBox="-100 -100 200 200" width="100%" height="300px"
        onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}
        style={{ cursor: dragging ? "grabbing" : "default" }}>
        
        {/* Grille dense */}
        {Array.from({ length: 21 }).map((_, i) => {
          const x = (i-10) * 10
          return <line key={`gx${i}`} x1={x} y1={-100} x2={x} y2={100}
            stroke={highlightX === x ? "orange" : grid}
            strokeWidth={highlightX === x ? 2 : 0.5}/>
        })}
        {Array.from({ length: 21 }).map((_, i) => {
          const y = (i-10) * 10
          return <line key={`gy${i}`} x1={-100} y1={y} x2={100} y2={y}
            stroke={highlightY === y ? "orange" : grid}
            strokeWidth={highlightY === y ? 2 : 0.5}/>
        })}

        {/* Repère orthonormé avec graduations numérotées */}
        <line x1={-100} y1={0} x2={100} y2={0} stroke="black" strokeWidth={1} markerEnd="url(#arrowX)" />
        <line x1={0} y1={100} x2={0} y2={-100} stroke="black" strokeWidth={1} markerEnd="url(#arrowY)" />
        {Array.from({ length: 21 }).map((_, i) => {
          const x = (i-10) * 10
          return (
            <>
              <line key={`tickX${i}`} x1={x} y1={-2} x2={x} y2={2} stroke="black" strokeWidth={1} />
              {x !== 0 && <text x={x-5} y={15} fontSize="8" fill="black">{(i-10)/2}</text>}
            </>
          )
        })}
        {Array.from({ length: 21 }).map((_, i) => {
          const y = (i-10) * 10
          return (
            <>
              <line key={`tickY${i}`} x1={-2} y1={y} x2={2} y2={y} stroke="black" strokeWidth={1} />
              {y !== 0 && <text x={-20} y={y+3} fontSize="8" fill="black">{-(i-10)/2}</text>}
            </>
          )
        })}
        <text x={95} y={-5} fontSize="10" fill="black">x</text>
        <text x={5} y={-95} fontSize="10" fill="black">y</text>

        <defs>
          <marker id="arrowX" markerWidth="10" markerHeight="10" refX="5" refY="5"
            orient="auto" markerUnits="strokeWidth">
                       <path d="M0,0 L10,5 L0,10 Z" fill="black" />
          </marker>
        </defs>

        {/* Points interactifs avec coordonnées en unités */}
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
              
              {/* Nom du point */}
              <text x={P.x+6} y={P.y-6} fontSize="10" fill="black">{name}</text>
              
              {/* Coordonnées en unités mathématiques */}
              <text x={P.x+6} y={P.y+12} fontSize="9" fill="blue">
                ({(P.x/20).toFixed(1)}, {(-P.y/20).toFixed(1)})
              </text>
            </g>
          ))}
      </svg>

      {/* Badges */}
      <Stack direction="row" gap={4} flexWrap="wrap">
        <Badge colorScheme={aligned ? "green":"gray"}>Alignés (A,B,C): {aligned?"Oui":"Non"}</Badge>
        <Badge colorScheme={cocyclic ? "green":"red"}>Cocycliques (A,B,C,D): {cocyclic?"Oui":"Non"}</Badge>
        <Badge colorScheme="blue">Rapport complexe: {ratioRe.toFixed(3)} + {ratioIm.toFixed(3)} i</Badge>
        <Badge colorScheme="purple">|ratio| = {module.toFixed(3)}</Badge>
        <Badge colorScheme="orange">arg(ratio) = {argument.toFixed(2)}°</Badge>
      </Stack>

      {/* Plan complexe avec cercle unité */}
      <svg viewBox="-1.5 -1.5 3 3" width="220" height="220" style={{ border: "1px solid #ccc", marginTop: "10px" }}>
        <line x1={-1.5} y1={0} x2={1.5} y2={0} stroke="black" strokeWidth={0.02}/>
        <line x1={0} y1={-1.5} x2={0} y2={1.5} stroke="black" strokeWidth={0.02}/>
        <circle cx={0} cy={0} r={1} stroke="gray" fill="none" strokeDasharray="4"/>
        <path
          d={`M 0 0 L 1 0 A 1 1 0 ${argument>180?1:0} ${argument<0?0:1} ${Math.cos(argument*Math.PI/180)} ${-Math.sin(argument*Math.PI/180)} Z`}
          fill="rgba(255,165,0,0.2)" stroke="orange" strokeWidth={0.02}
        />
        <line x1={0} y1={0} x2={ratioRe} y2={-ratioIm}
          stroke={module <= 1 ? "green" : "red"} strokeWidth={0.05} markerEnd="url(#arrow)" />
        <circle cx={ratioRe} cy={-ratioIm} r={0.07} fill={module <= 1 ? "green" : "red"} />
        <text x={ratioRe+0.1} y={-ratioIm-0.1} fontSize="0.15" fill="blue">|z| = {module.toFixed(2)}</text>
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
            <Text>X = {(point.x/20).toFixed(1)} unités</Text>
            <Slider.Root
              min={-100}
              max={100}
              step={10}
              value={[point.x]}
              onValueChange={(details) => setter({ ...point, x: details.value[0] })}
            >
              <SliderTrack><SliderRange /></SliderTrack>
              <SliderThumb index={0} />
            </Slider.Root>
            <Text>Y = {(-point.y/20).toFixed(1)} unités</Text>
            <Slider.Root
              min={-100}
              max={100}
              step={10}
              value={[point.y]}
              onValueChange={(details) => setter({ ...point, y: details.value[0] })}
            >
              <SliderTrack><SliderRange /></SliderTrack>
              <SliderThumb index={0} />
            </Slider.Root>
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}
