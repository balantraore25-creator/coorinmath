import React, { useEffect, useMemo, useRef, useState } from "react";
import { Stage, Layer, Line, Circle, Arc, Text as KonvaText } from "react-konva";
import { Box, Text, Button, useBreakpointValue } from "@chakra-ui/react";
import { MultiHalo } from "../moduleetargument/MultiHalo";

type Point = { x: number; y: number };

const unit = 50;
const size = 500;
const center = size / 2;

export const ComplexCanvas: React.FC = () => {
  // Coordonnée aléatoire bornée entre -3 et 3
  const randomCoord = () => Math.floor(Math.random() * 7) - 3;

  const [z, setZ] = useState<Point>({ x: randomCoord(), y: randomCoord() });
  const [placed, setPlaced] = useState<Record<number, boolean>>({});
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const panelDirection = useBreakpointValue({ base: "column", md: "row" });

  const points = useMemo<Point[]>(
    () => [
      { x: z.x, y: z.y },
      { x: -z.y, y: z.x },
      { x: -z.x, y: -z.y },
      { x: z.y, y: -z.x },
      { x: z.x, y: z.y },
    ],
    [z.x, z.y]
  );

  const colors = ["green", "red", "blue", "orange", "purple"];

  const [vectorProgress, setVectorProgress] = useState(0);
  const [arcProgress, setArcProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (selectedIdx !== null && placed[selectedIdx]) {
      setVectorProgress(0);
      setArcProgress(0);
      let frame = 0;
      const step = () => {
        frame++;
        // Ease-out pour l’arc
        const easedArc = 360 * (1 - Math.pow(0.95, frame));
        setVectorProgress((p) => Math.min(p + 0.02, 1));
        setArcProgress(Math.min(easedArc, 360));
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }
  }, [selectedIdx, placed]);

  const toCanvas = (p: Point) => ({
    x: center + p.x * unit,
    y: center - p.y * unit,
  });

  const regenerateZ = () => {
    setZ({ x: randomCoord(), y: randomCoord() });
    setPlaced({});
    setSelectedIdx(null);
  };

  return (
    <Box display="flex" flexDirection={panelDirection} gap={6}>
      <Box flex="1">
        <Stage width={size} height={size + 140} style={{ backgroundColor: "#fff" }}>
          <Layer>
            {/* Grille 7x7 */}
            {Array.from({ length: 8 }).map((_, i) => (
              <React.Fragment key={i}>
                <Line
                  points={[i * (size / 7), 0, i * (size / 7), size]}
                  stroke="#ddd"
                  strokeWidth={1}
                />
                <Line
                  points={[0, i * (size / 7), size, i * (size / 7)]}
                  stroke="#ddd"
                  strokeWidth={1}
                />
              </React.Fragment>
            ))}

            {/* Axes */}
            <Line points={[0, center, size, center]} stroke="black" strokeWidth={2} />
            <Line points={[center, 0, center, size]} stroke="black" strokeWidth={2} />

            <KonvaText text="Réel" x={size - 40} y={center - 20} fontSize={14} fontStyle="bold" />
            <KonvaText text="Imaginaire pur" x={center + 10} y={10} fontSize={14} rotation={90} />

            {points.map((p, idx) => {
              const { x: targetX, y: targetY } = toCanvas(p);
              const isPlaced = !!placed[idx];

              return (
                <React.Fragment key={idx}>
                  <Circle
                    x={80 + idx * 80}
                    y={size + 80}
                    radius={12}
                    fill={colors[idx]}
                    draggable
                    onDragEnd={(e) => {
                      const node = e.target;
                      const newX = node.x();
                      const newY = node.y();
                      if (Math.abs(newX - targetX) < 20 && Math.abs(newY - targetY) < 20) {
                        setPlaced((prev) => ({ ...prev, [idx]: true }));
                        node.position({ x: targetX, y: targetY });
                      } else {
                        node.position({ x: 80 + idx * 80, y: size + 80 });
                      }
                    }}
                    onClick={() => setSelectedIdx(idx)}
                  />

                  {isPlaced && (
                    <>
                      {/* Trait pointillé vers l'origine */}
                      <Line
                        points={[center, center, targetX, targetY]}
                        stroke={colors[idx]}
                        dash={[6, 4]}
                      />

                      {/* Vecteur animé progressif */}
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

                      {/* Arc ease-out animé */}
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

                      {/* Valeur de l'angle */}
                      <KonvaText
                        text={`${((Math.atan2(p.y, p.x) * 180) / Math.PI).toFixed(1)}°`}
                        x={center + 30}
                        y={center - 30}
                        fontSize={14}
                        fill={colors[idx]}
                      />

                      <MultiHalo
                        x={targetX}
                        y={targetY}
                        color={colors[idx]}
                        count={3}
                        minRadius={12}
                        maxRadius={28}
                        speed={0.8}
                        visible
                      />
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </Layer>
        </Stage>
      </Box>

      {/* Panneau latéral */}
      <Box minW={{ base: "100%", md: "280px" }} p={4} bg="gray.50" border="1px solid #ddd" borderRadius="md" shadow="md">
        <Text fontSize="lg" fontWeight="bold" mb={3}>Étapes de calcul</Text>
        {selectedIdx !== null && placed[selectedIdx] && (
          <>
            <Text>Coordonnée : {points[selectedIdx].x} + i{points[selectedIdx].y}</Text>
            <Text>
              Module : √({points[selectedIdx].x}² + {points[selectedIdx].y}²) ={" "}
              {Math.sqrt(points[selectedIdx].x**2 + points[selectedIdx].y**2).toFixed(2)}
            </Text>
            <Text>
              Argument : arctan({points[selectedIdx].y}/{points[selectedIdx].x}) ={" "}
              {((Math.atan2(points[selectedIdx].y, points[selectedIdx].x) * 180) / Math.PI).toFixed(2)}°
            </Text>
          </>
        )}

        <Box mt={4}>
          <Button colorScheme="teal" onClick={regenerateZ}>
            🎲 Nouveau z
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
