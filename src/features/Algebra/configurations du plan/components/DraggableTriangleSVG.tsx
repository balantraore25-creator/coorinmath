import { useState, useCallback, useEffect } from "react"
import { Badge, Stack, Text, Button } from "@chakra-ui/react"
import { useColorModeValue } from "@/components/ui/color-mode"
import { motion } from "framer-motion"

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

  // Ratio (zC - zA)/(zB - zA)
  const re = (C.x - A.x) / (B.x - A.x)
  const im = (-(C.y - A.y)) / (B.x - A.x)
  const argDeg = round((Math.atan2(im, re) * 180) / Math.PI)
  const mod = round(Math.sqrt(re * re + im * im))

  // Modes
  const [mode, setMode] = useState<"progression"|"challenge"|"libre">("libre")

  // Progression
  const [level, setLevel] = useState(0)
  const [success, setSuccess] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (mode!=="progression") return
    if (level === 0 && mod <= 1) setSuccess(true)
    else if (level === 1 && Math.abs(argDeg - 90) < 5) setSuccess(true)
    else setSuccess(false)
  }, [mode, level, mod, argDeg])

  useEffect(() => {
    if (mode==="progression" && success) {
      setScore(prev => prev + 1)
      setTimeout(() => {
        setLevel(prev => prev + 1)
        setSuccess(false)
      }, 1500)
    }
  }, [success, mode])

  // Challenge
  const [challengeActive, setChallengeActive] = useState(false)
  const [challengeLevel, setChallengeLevel] = useState<number|null>(null)
  const [challengeSuccess, setChallengeSuccess] = useState(false)
  const [challengeScore, setChallengeScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)

  const pickRandomLevel = () => {
    const randomIndex = Math.floor(Math.random() * 2)
    setChallengeLevel(randomIndex)
    setChallengeSuccess(false)
  }
  const startChallenge = () => {
    setChallengeActive(true)
    setChallengeScore(0)
    setTimeLeft(60)
    pickRandomLevel()
  }

  useEffect(() => {
    if (mode!=="challenge" || challengeLevel===null) return
    if (challengeLevel === 0 && mod <= 1) setChallengeSuccess(true)
    else if (challengeLevel === 1 && Math.abs(argDeg - 90) < 5) setChallengeSuccess(true)
    else setChallengeSuccess(false)
  }, [mode, challengeLevel, mod, argDeg])

  useEffect(() => {
    if (mode==="challenge" && challengeSuccess) {
      setChallengeScore(prev => prev + 1)
      setTimeout(() => pickRandomLevel(), 1000)
    }
  }, [challengeSuccess, mode])

  useEffect(() => {
    if (mode!=="challenge" || !challengeActive) return
    if (timeLeft <= 0) {
      setChallengeActive(false)
      return
    }
    const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [mode, challengeActive, timeLeft])

  return (
    <Stack direction="column" gap={4} align="start">
      <Text fontSize="lg" fontWeight="bold">Exploration interactive du triangle</Text>

      {/* Choix du mode */}
      <Stack direction="row" gap={2}>
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

      {/* SVG principal */}
      <svg
        viewBox="-200 -200 400 400"
        width="100%"
        height="400px"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor: dragging ? "grabbing" : "default" }}
      >
        {/* Grille identique à DraggablePointsSVG */}
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
          animate={{ points: `${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${A.x},${A.y}` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />

        {/* Points interactifs */}
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

        {/* Arc pédagogique si argument ≈ 90° */}
        {Math.abs(argDeg - 90) < 5 && (
          <>
            <motion.path
              d={`M ${A.x} ${A.y} L ${B.x} ${B.y} A 40 40 0 0 1 ${C.x} ${C.y}`}
              fill="rgba(255,165,0,0.2)"
              stroke="orange"
              strokeWidth={2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            />
                        <motion.text
              x={A.x+20}
              y={A.y-20}
              fontSize="12"
              fill="orange"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              90°
            </motion.text>
          </>
        )}
      </svg>

      {/* Feedback Progression */}
      {mode==="progression" && (
        <Stack direction="column" gap={2} mt={2}>
          {level < 2 ? (
            <>
              <Text>
                {level === 0 && "Niveau 1 : |ratio| ≤ 1"}
                {level === 1 && "Niveau 2 : Argument ≈ 90°"}
              </Text>
              <Text fontSize="sm" color={success ? "green.600":"red.600"}>
                {success ? "✅ Bravo !" : "❌ Continue…"}
              </Text>
            </>
          ) : (
            <Text fontWeight="bold" color="green.600">🎉 Progression terminée !</Text>
          )}
          <Badge colorScheme="purple">Score: {score}</Badge>
        </Stack>
      )}

      {/* Feedback Challenge */}
      {mode==="challenge" && (
        <Stack direction="column" gap={2} mt={2}>
          {!challengeActive ? (
            <Button colorScheme="blue" onClick={startChallenge}>
              Démarrer le challenge
            </Button>
          ) : (
            <>
              <Text>Temps restant : {timeLeft}s</Text>
              <Text>Score : {challengeScore}</Text>
              {challengeLevel!==null && (
                <Text>
                  {challengeLevel === 0 && "Objectif: |ratio| ≤ 1"}
                  {challengeLevel === 1 && "Objectif: Argument ≈ 90°"}
                </Text>
              )}
              <Text fontSize="sm" color={challengeSuccess ? "green.600":"red.600"}>
                {challengeSuccess ? "✅ Bravo !" : "❌ Continue…"}
              </Text>
            </>
          )}
          {!challengeActive && timeLeft<=0 && (
            <Text fontWeight="bold" color="purple.600">
              🎉 Challenge terminé ! Score final : {challengeScore}
            </Text>
          )}
        </Stack>
      )}

      {/* Feedback Libre */}
      {mode==="libre" && (
        <Stack direction="column" gap={2} mt={2}>
          <Text>Mode libre activé : explore le triangle et observe les propriétés géométriques.</Text>
          <Stack direction="row" gap={4} flexWrap="wrap">
            <Badge colorScheme="purple">ratio = {round(re)} + {round(im)} i</Badge>
            <Badge colorScheme="orange">arg = {argDeg}°</Badge>
            <Badge colorScheme="teal">|ratio| = {mod}</Badge>
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}

