import { useState, useCallback, useEffect } from "react"
import { Badge, Stack, Text, Button } from "@chakra-ui/react"
import { useColorModeValue } from "@/components/ui/color-mode"
import { motion } from "framer-motion"

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

  // Modes
  const [mode, setMode] = useState<"progression"|"challenge"|"libre">("libre")

  // Progression
  const [level, setLevel] = useState(0)
  const [success, setSuccess] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (mode!=="progression") return
    if (level === 0 && aligned) setSuccess(true)
    else if (level === 1 && cocyclic) setSuccess(true)
    else if (level === 2 && module <= 1) setSuccess(true)
    else if (level === 3 && Math.abs(argument - 90) < 5) setSuccess(true)
    else setSuccess(false)
  }, [mode, level, aligned, cocyclic, module, argument])

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
    const randomIndex = Math.floor(Math.random() * 4)
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
    if (challengeLevel === 0 && aligned) setChallengeSuccess(true)
    else if (challengeLevel === 1 && cocyclic) setChallengeSuccess(true)
    else if (challengeLevel === 2 && module <= 1) setChallengeSuccess(true)
    else if (challengeLevel === 3 && Math.abs(argument - 90) < 5) setChallengeSuccess(true)
    else setChallengeSuccess(false)
  }, [mode, challengeLevel, aligned, cocyclic, module, argument])

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
      <Text fontSize="lg" fontWeight="bold">Exploration interactive du plan</Text>

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
        {/* Grille */}
        {Array.from({ length: 21 }).map((_, i) => {
          const x = (i-10) * 20
          return <line key={`gx${i}`} x1={x} y1={-200} x2={x} y2={200} stroke={grid} strokeWidth={0.5}/>
        })}
        {Array.from({ length: 21 }).map((_, i) => {
          const y = (i-10) * 20
                    return <line key={`gy${i}`} x1={-200} y1={y} x2={200} y2={y} stroke={grid} strokeWidth={0.5}/>
        })}

        {/* Points interactifs reliés à handleMouseDown */}
        {[{P:A,name:"A"},{P:B,name:"B"},{P:C,name:"C"},{P:D,name:"D"}].map(({P,name})=>(
          <g key={name}>
            <circle
              cx={P.x}
              cy={P.y}
              r={5}
              fill="blue"
              onMouseDown={handleMouseDown(name)}
            />
            <text x={P.x+6} y={P.y-6} fontSize="10" fill="black">{name}</text>
          </g>
        ))}

        {/* Cercle et centre animés si cocycliques */}
        {cocyclic && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.circle
              cx={center.x}
              cy={center.y}
              r={radius}
              stroke={mode==="progression" ? "blue" : mode==="challenge" ? "orange" : "red"}
              strokeWidth={1}
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5 }}
            />
            <motion.circle
              cx={center.x}
              cy={center.y}
              r={4}
              fill={mode==="progression" ? "blue" : mode==="challenge" ? "orange" : "red"}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.text
              x={center.x+6}
              y={center.y-6}
              fontSize="10"
              fill={mode==="progression" ? "blue" : mode==="challenge" ? "orange" : "red"}
              initial={{ opacity: 0, y: center.y }}
              animate={{ opacity: 1, y: center.y-6 }}
              transition={{ duration: 0.8 }}
            >
              O
            </motion.text>
          </motion.g>
        )}
      </svg>

      {/* Tableau dynamique si cocycliques */}
      {cocyclic && (
        <Stack direction="column" gap={2} mt={2}>
          <Text fontWeight="bold" color="red.600">Données du cercle circonscrit</Text>
          <Stack direction="row" gap={4}>
            <Badge colorScheme="blue">Centre O: ({center.x.toFixed(2)}, {center.y.toFixed(2)})</Badge>
            <Badge colorScheme="green">Rayon: {radius.toFixed(2)}</Badge>
          </Stack>
        </Stack>
      )}

      {/* Feedback Progression */}
      {mode==="progression" && (
        <Stack direction="column" gap={2} mt={2}>
          {level < 4 ? (
            <>
              <Text>
                {level === 0 && "Niveau 1 : Aligner A, B, C"}
                {level === 1 && "Niveau 2 : Cocycliques A, B, C, D"}
                {level === 2 && "Niveau 3 : Module du rapport ≤ 1"}
                {level === 3 && "Niveau 4 : Argument ≈ 90°"}
              </Text>
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
                  {challengeLevel === 0 && "Objectif: Aligner A, B, C"}
                  {challengeLevel === 1 && "Objectif: Cocycliques A, B, C, D"}
                  {challengeLevel === 2 && "Objectif: Module du rapport ≤ 1"}
                  {challengeLevel === 3 && "Objectif: Argument ≈ 90°"}
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
          <Text>Mode libre activé : explore les points et observe les propriétés géométriques.</Text>
          <Stack direction="row" gap={4}>
            <Badge colorScheme={aligned ? "green":"gray"}>
              Alignés (A,B,C): {aligned ? "Oui":"Non"}
            </Badge>
            <Badge colorScheme={cocyclic ? "green":"red"}>
              Cocycliques (A,B,C,D): {cocyclic ? "Oui":"Non"}
            </Badge>
            <Badge colorScheme="blue">
              Rapport complexe: {ratioRe.toFixed(3)} + {ratioIm.toFixed(3)} i
            </Badge>
            <Badge colorScheme="purple">|ratio| = {module.toFixed(3)}</Badge>
            <Badge colorScheme="orange">arg(ratio) = {argument.toFixed(2)}°</Badge>
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}
