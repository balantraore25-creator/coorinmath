import { useState, useCallback, useEffect } from "react"
import { Badge, Stack, Text, Button } from "@chakra-ui/react"
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

  // Vecteurs
  const vAB = { x: B.x - A.x, y: B.y - A.y }
  const vCD = { x: D.x - C.x, y: D.y - C.y }
  const dot = vAB.x * vCD.x + vAB.y * vCD.y
  const cross = vAB.x * vCD.y - vAB.y * vCD.x
  const angleDeg = round((Math.atan2(cross, dot) * 180) / Math.PI)
  const isParallel = Math.abs(cross) < 1e-2
  const isPerp = Math.abs(dot) < 1e-2

  // Modes
  const [mode, setMode] = useState<"progression"|"challenge"|"libre">("libre")

  // Progression
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
      const distAB = Math.sqrt((A.x-B.x)**2 + (A.y-B.y)**2)
      const distAC = Math.sqrt((A.x-C.x)**2 + (A.y-C.y)**2)
      setSuccess(Math.abs(distAB - distAC) < 5)
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

  // Challenge
  const [challengeActive, setChallengeActive] = useState(false)
  const [challengeLevel, setChallengeLevel] = useState<number|null>(null)
  const [challengeSuccess, setChallengeSuccess] = useState(false)
  const [challengeScore, setChallengeScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)

  const pickRandomLevel = () => {
    const randomIndex = Math.floor(Math.random() * levels.length)
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
    const level = levels[challengeLevel]

    if (level.goal === "parallel" && isParallel) setChallengeSuccess(true)
    else if (level.goal === "perp" && isPerp) setChallengeSuccess(true)
    else if (level.goal === "angle" && Math.abs(angleDeg - (level.targetAngle ?? 0)) < 5) setChallengeSuccess(true)
    else if (level.goal === "isosceles") {
      const distAB = Math.sqrt((A.x-B.x)**2 + (A.y-B.y)**2)
      const distAC = Math.sqrt((A.x-C.x)**2 + (A.y-C.y)**2)
      setChallengeSuccess(Math.abs(distAB - distAC) < 5)
    } else setChallengeSuccess(false)
  }, [mode, challengeLevel, isParallel, isPerp, angleDeg, A, B, C])

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
    <Stack direction="column" gap={3} align="start">
      {/* SVG principal */}
      <svg
        viewBox="0 0 200 150"
        width="100%"
        height="220px"
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

        {/* Droite AB */}
        <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={accentAB} strokeWidth={2}/>
        {[{P:A,name:"A"},{P:B,name:"B"}].map(({P,name})=>(
          <motion.circle key={name} cx={P.x} cy={P.y} r={5} fill={accentAB}
            onMouseDown={handleMouseDown(name)}
            animate={{ cx: P.x, cy: P.y, r: dragging===name ? [5,8,5] : 5 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={{ r: 7 }}
          />
        ))}

        {/* Droite CD */}
        <line x1={C.x} y1={C.y} x2={D.x} y2={D.y} stroke={accentCD} strokeWidth={2}/>
                {[{P:C,name:"C"},{P:D,name:"D"}].map(({P,name})=>(
          <motion.circle key={name} cx={P.x} cy={P.y} r={5} fill={accentCD}
            onMouseDown={handleMouseDown(name)}
            animate={{ cx: P.x, cy: P.y, r: dragging===name ? [5,8,5] : 5 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={{ r: 7 }}
          />
        ))}

        {/* Arc angle */}
        <path
          d={`M ${A.x} ${A.y} 
              L ${A.x + vAB.x*0.3} ${A.y + vAB.y*0.3}
              A 30 30 0 0 1 ${A.x + vCD.x*0.3} ${A.y + vCD.y*0.3}
              Z`}
          fill="rgba(255,165,0,0.2)" stroke="orange" strokeWidth={1}
        />
        <text x={A.x+15} y={A.y-10} fontSize="12" fill="orange">θ={angleDeg}°</text>
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

      {/* Feedback selon le mode */}
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

      {mode==="challenge" && (
        <Stack direction="column" gap={2} mt={2}>
          {!challengeActive ? (
            <Button colorScheme="blue" onClick={startChallenge}>Démarrer le challenge</Button>
          ) : (
            <>
              <Text>Temps restant : {timeLeft}s</Text>
              <Text>Score : {challengeScore}</Text>
              {challengeLevel!==null && <Text>{levels[challengeLevel].label}</Text>}
              <Text fontSize="sm" color={challengeSuccess ? "green.600":"red.600"}>
                {challengeSuccess ? "✅ Bravo !" : "❌ Continue…"}
              </Text>
            </>
          )}
          {!challengeActive && timeLeft<=0 && (
            <Text fontWeight="bold" color="purple.600">🎉 Challenge terminé ! Score final : {challengeScore}</Text>
          )}
        </Stack>
      )}

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
    </Stack>
  )
}
