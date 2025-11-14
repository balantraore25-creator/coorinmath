import React, { useState, useEffect } from "react";
import { Stage, Layer, Line, Circle, Arc, Text as KonvaText } from "react-konva";
import { Box, Text, VStack, Collapsible, useBreakpointValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { MultiHalo } from "./../moduleetargument/MultiHalo"; // halo multi-cercles

interface Point {
  x: number;
  y: number;
}

const unit = 50;
const center = 250;

export const ChallengeRotation: React.FC = () => {
  const [z] = useState<Point>({ x: 2, y: 1 });
  const [placed, setPlaced] = useState<Record<number, boolean>>({});
  const [selectedPower, setSelectedPower] = useState<number | null>(null);

  const panelDirection = useBreakpointValue({ base: "column", md: "row" });

  const module = Math.sqrt(z.x ** 2 + z.y ** 2);
  const argument = Math.atan2(z.y, z.x);

  const powers: Point[] = [
    { x: z.x, y: z.y }, // z
    { x: -z.y, y: z.x }, // z*i
    { x: -z.x, y: -z.y }, // z*i^2
    { x: z.y, y: -z.x }, // z*i^3
    { x: z.x, y: z.y }, // z*i^4 = z
  ];

  const colors = ["green", "red", "blue", "orange", "purple"];

  const [vectorProgress, setVectorProgress] = useState(0);
  const [arcProgress, setArcProgress] = useState(0);

  useEffect(() => {
    if (selectedPower !== null && placed[selectedPower]) {
      setVectorProgress(0);
      setArcProgress(0);

      let frameId: number;
      const animate = () => {
        setVectorProgress((prev) => Math.min(prev + 0.02, 1));
        setArcProgress((prev) => Math.min(prev + 2, (argument * 180) / Math.PI));
        frameId = requestAnimationFrame(animate);
      };
      animate();
      return () => cancelAnimationFrame(frameId);
    }
  }, [selectedPower, placed, argument]);

  return (
    <Box display="flex" flexDirection={panelDirection} gap={6}>
      {/* Canvas */}
      <Box flex="1">
        <Stage width={500} height={500} style={{ backgroundColor: "#fff" }}>
          <Layer>
            {/* Axes */}
            <Line points={[0, center, 500, center]} stroke="black" strokeWidth={2} />
            <Line points={[center, 0, center, 500]} stroke="black" strokeWidth={2} />

            {/* Badges */}
            <KonvaText text="Réel" x={460} y={center - 20} fontSize={14} fontStyle="bold" />
            <KonvaText text="Imaginaire pur" x={center + 10} y={10} fontSize={14} rotation={90} />

            {/* Boules */}
            {powers.map((p, idx) => {
              const x = center + p.x * unit;
              const y = center - p.y * unit;
              const isPlaced = placed[idx];

              return (
                <>
                  <Circle
                    key={idx}
                    x={x}
                    y={y}
                    radius={12}
                    fill={colors[idx]}
                    draggable
                    onDragEnd={() => setPlaced((prev) => ({ ...prev, [idx]: true }))}
                    onClick={() => setSelectedPower(idx)}
                  />

                  {isPlaced && selectedPower === idx && (
                    <>
                      {/* MultiHalo festif */}
                      <MultiHalo
                        x={x}
                        y={y}
                        color={colors[idx]}
                        count={3}
                        minRadius={12}
                        maxRadius={28}
                        speed={0.8}
                        visible={true}
                      />

                      {/* Projections */}
                      <Line points={[x, y, x, center]} stroke={colors[idx]} dash={[4, 4]} />
                      <Line points={[x, y, center, y]} stroke={colors[idx]} dash={[4, 4]} />
                      <KonvaText text={`${p.x}`} x={x - 10} y={center + 5} fontSize={12} fill={colors[idx]} />
                      <KonvaText text={`${p.y}`} x={center + 5} y={y - 10} fontSize={12} fill={colors[idx]} />

                      {/* Vecteur animé */}
                      <Line
                        points={[
                          center,
                          center,
                          center + (x - center) * vectorProgress,
                          center + (y - center) * vectorProgress,
                        ]}
                        stroke={colors[idx]}
                        strokeWidth={2}
                      />

                      {/* Arc animé */}
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
                        x={center - 100}
                        y={480}
                        fontSize={16}
                        fontStyle="bold"
                        fill={colors[idx]}
                      />
                    </>
                  )}
                </>
              );
            })}
          </Layer>
        </Stage>
      </Box>

      {/* Panneau latéral animé */}
      <Collapsible.Root open={selectedPower !== null}>
        <Collapsible.Content>
          <Box
            minW="220px"
            p={4}
            bg="gray.50"
            border="1px solid #ddd"
            borderRadius="md"
            shadow="md"
          >
            <Text fontSize="lg" fontWeight="bold" mb={3}>
              Étapes de calcul
            </Text>
            {selectedPower !== null ? (
              <VStack align="start" gap={2}>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Text>Coordonnée : z = {z.x} + i{z.y}</Text>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <Text>Module : √({z.x}² + {z.y}²) = {module.toFixed(2)}</Text>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <Text>
                    Argument : arctan({z.y}/{z.x}) = {((argument * 180) / Math.PI).toFixed(2)}°
                  </Text>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                  <Text fontWeight="semibold">Forme trigonométrique :</Text>
                  <Text>
                    z = {module.toFixed(2)} (cos({((argument * 180) / Math.PI).toFixed(2)}°) + i·sin({((argument * 180) / Math.PI).toFixed(2)}°))
                  </Text>
                </motion.div>
              </VStack>
            ) : (
              <Text>Aucune boule sélectionnée</Text>
            )}
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
};
