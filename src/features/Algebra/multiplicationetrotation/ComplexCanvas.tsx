import React, { useEffect, useMemo, useRef, useState } from "react";
import { Stage, Layer, Line, Circle, Arc, Text as KonvaText, Group } from "react-konva";
import { Box, Text, useBreakpointValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { MultiHalo } from "../moduleetargument/MultiHalo";

type Point = { x: number; y: number };

const unit = 50;
const size = 500;
const center = size / 2;
const bottomLaneY = size + 80;

const axisColor = "#000";
const gridColor = "#ddd";

export const ComplexCanvas: React.FC = () => {
  // Nombre complexe z (modifiable si besoin)
  const [z] = useState<Point>({ x: 2, y: 1 });

  // État des placements: index -> placé ?
  const [placed, setPlaced] = useState<Record<number, boolean>>({});
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Disposition responsive du panneau latéral
  const panelDirection = useBreakpointValue({ base: "column", md: "row" });

  // Calculs de base
  const module = useMemo(() => Math.sqrt(z.x ** 2 + z.y ** 2), [z.x, z.y]);
  const argument = useMemo(() => Math.atan2(z.y, z.x), [z.x, z.y]); // en radians
  const argumentDeg = useMemo(() => (argument * 180) / Math.PI, [argument]);

  // Puissances successives de i appliquées à z: z * i^k
  const points = useMemo<Point[]>(
    () => [
      { x: z.x, y: z.y }, // k=0 → z
      { x: -z.y, y: z.x }, // k=1 → z*i
      { x: -z.x, y: -z.y }, // k=2 → z*i^2
      { x: z.y, y: -z.x }, // k=3 → z*i^3
      { x: z.x, y: z.y }, // k=4 → z*i^4 = z
    ],
    [z.x, z.y]
  );

  const colors = ["green", "red", "blue", "orange", "purple"];

  // Animation du vecteur et de l’arc quand on a bien placé la boule sélectionnée
  const [vectorProgress, setVectorProgress] = useState(0); // 0 → 1
  const [arcProgress, setArcProgress] = useState(0); // angle en degrés
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (selectedIdx !== null && placed[selectedIdx]) {
      setVectorProgress(0);
      setArcProgress(0);
      const step = () => {
        setVectorProgress((p) => Math.min(p + 0.02, 1));
        setArcProgress((a) => Math.min(a + 2, argumentDeg));
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }
  }, [selectedIdx, placed, argumentDeg]);

  // Compteur de progression (ignore k=4 qui revient à z)
  const placedCount = useMemo(
    () => Object.entries(placed).filter(([k, v]) => v && Number(k) < 4).length,
    [placed]
  );
  const totalCount = 4;

  // Position cible dans le repère pour un point complexe (x, y)
  const toCanvas = (p: Point) => ({
    x: center + p.x * unit,
    y: center - p.y * unit,
  });

  return (
    <Box display="flex" flexDirection={panelDirection} gap={6}>
      {/* Canvas principal */}
      <Box flex="1">
        <Stage width={size} height={size + 140} style={{ backgroundColor: "#fff" }}>
          <Layer>
            {/* Grille */}
            {Array.from({ length: 17 }).map((_, i) => (
              <React.Fragment key={i}>
                <Line points={[i * unit, 0, i * unit, size]} stroke={gridColor} strokeWidth={1} />
                <Line points={[0, i * unit, size, i * unit]} stroke={gridColor} strokeWidth={1} />
              </React.Fragment>
            ))}

            {/* Axes */}
            <Line points={[0, center, size, center]} stroke={axisColor} strokeWidth={2} />
            <Line points={[center, 0, center, size]} stroke={axisColor} strokeWidth={2} />

            {/* Badges d’axes */}
            <KonvaText text="Réel" x={size - 40} y={center - 20} fontSize={14} fontStyle="bold" />
            <KonvaText text="Imaginaire pur" x={center + 10} y={10} fontSize={14} rotation={90} />

            {/* Vecteur initial (module de z) */}
            <Line
              points={[center, center, center + z.x * unit, center - z.y * unit]}
              stroke="#000"
              strokeWidth={2}
              dash={[6, 4]}
            />

            {/* Boules alignées en bas: z et z*i^k */}
            {points.map((p, idx) => {
              const startX = 80 + idx * 80;
              const startY = bottomLaneY;
              const { x: targetX, y: targetY } = toCanvas(p);
              const isPlaced = !!placed[idx];

              return (
                <React.Fragment key={idx}>
                  {/* Wrapper animé (DOM) pour l’apparition progressive */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    // Important: ne pas insérer ce div dans le canvas; on encapsule seulement le rendu React
                  >
                    <Group>
                      <Circle
                        x={startX}
                        y={startY}
                        radius={12}
                        fill={colors[idx]}
                        draggable
                        onDragEnd={(e) => {
                          const node = e.target;
                          const newX = node.x();
                          const newY = node.y();
                          const nearTarget =
                            Math.abs(newX - targetX) < 20 && Math.abs(newY - targetY) < 20;
                          if (nearTarget) {
                            setPlaced((prev) => ({ ...prev, [idx]: true }));
                            node.position({ x: targetX, y: targetY });
                          } else {
                            node.position({ x: startX, y: startY });
                          }
                        }}
                        onClick={() => setSelectedIdx(idx)}
                      />
                    </Group>
                  </motion.div>

                  {/* Effets déclenchés quand la boule est correctement placée et sélectionnée */}
                  {isPlaced && selectedIdx === idx && (
                    <>
                      {/* MultiHalo festif */}
                      <MultiHalo
                        x={targetX}
                        y={targetY}
                        color={colors[idx]}
                        count={3}
                        minRadius={12}
                        maxRadius={28}
                        speed={0.8}
                        visible={true}
                      />

                      {/* Projections sur les axes */}
                      <Line points={[targetX, targetY, targetX, center]} stroke={colors[idx]} dash={[4, 4]} />
                      <Line points={[targetX, targetY, center, targetY]} stroke={colors[idx]} dash={[4, 4]} />
                      <KonvaText text={`${p.x}`} x={targetX - 10} y={center + 5} fontSize={12} fill={colors[idx]} />
                      <KonvaText text={`${p.y}`} x={center + 5} y={targetY - 10} fontSize={12} fill={colors[idx]} />

                      {/* Vecteur animé depuis l’origine jusqu’au point */}
                      <Line
                        points={[
                          center,
                          center,
                          center + (targetX - center) * vectorProgress,
                          center + (targetY - center) * vectorProgress,
                        ]}
                        stroke={colors[idx]}
                        strokeWidth={2}
                      />

                      {/* Arc animé (argument) */}
                      <Arc
                        x={center}
                        y={center}
                        innerRadius={20}
                        outerRadius={25}
                        angle={arcProgress}
                        rotation={0}
                        stroke={colors[idx]}
                        strokeWidth={2}
                      />

                      {/* Feedback textuel dynamique */}
                      <KonvaText
                        text={`Bravo ! Tu as bien placé z·i^${idx}`}
                        x={center - 120}
                        y={size - 24}
                        fontSize={16}
                        fontStyle="bold"
                        fill={colors[idx]}
                      />
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </Layer>
        </Stage>
      </Box>

      {/* Panneau latéral animé (responsive) */}
      <Box
        minW={{ base: "100%", md: "280px" }}
        p={4}
        bg="gray.50"
        border="1px solid #ddd"
        borderRadius="md"
        shadow="md"
      >
        <Text fontSize="lg" fontWeight="bold" mb={3}>
          Étapes de calcul
        </Text>

        {/* Révélation séquentielle des étapes avec Framer Motion */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Text>Coordonnée : z = {z.x} + i{z.y}</Text>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.30 }}>
          <Text>Module : √({z.x}² + {z.y}²) = {module.toFixed(2)}</Text>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Text>Argument : arctan({z.y}/{z.x}) = {argumentDeg.toFixed(2)}°</Text>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.60 }}>
          <Text fontWeight="semibold">Forme trigonométrique :</Text>
          <Text>
            z = {module.toFixed(2)} (cos({argumentDeg.toFixed(2)}°) + i·sin({argumentDeg.toFixed(2)}°))
          </Text>
        </motion.div>

        {/* Compteur de progression */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
          <Box mt={4} p={2} bg="white" border="1px solid #ccc" borderRadius="md">
            <Text fontSize="md" fontWeight="semibold">
              Progression : {placedCount} / {totalCount} boules bien placées
            </Text>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};
