import React, { useState, useEffect } from "react";
import { Stage, Layer, Line, Circle, Arc, Text as KonvaText } from "react-konva";
import {
  Box,
  Text,
  VStack,
  Collapsible,
  HStack,
  useBreakpointValue,
  Switch,
  Slider,
} from "@chakra-ui/react";
import { motion, useMotionValue, animate } from "framer-motion";
import type Konva from "konva";
import type { Point } from "../types";
import { useContainerSize } from "../components/useContainerSize";
import { MultiHalo } from "./MultiHalo";

interface Props {
  points: { A: Point; B: Point; C: Point };
}

type StudentPoints = Record<string, Point>;
type ProgressMap = Record<string, number>;

export const ComplexCanvas: React.FC<Props> = ({ points }) => {
  const { ref, size } = useContainerSize();
  const [studentPoints, setStudentPoints] = useState<StudentPoints>(points);
  const [visibleLines, setVisibleLines] = useState(0);
  const [axisProgress, setAxisProgress] = useState(0);
  const [pointProgress, setPointProgress] = useState<ProgressMap>({});
  const [speed, setSpeed] = useState(1);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [showDegrees, setShowDegrees] = useState(true);

  const unit = size.width / 17;
  const center = size.width / 2;
  const panelDirection = useBreakpointValue({ base: "column", md: "row" });

  // Reset states
  useEffect(() => {
    setStudentPoints(points);
    setVisibleLines(0);
    setAxisProgress(0);
    setPointProgress({});
    setSelectedLabel(null);
  }, [points]);

  // Animation intro
  useEffect(() => {
    let frameId: number;
    const animateGrid = () => {
      let i = 0;
      const step = () => {
        i++;
        setVisibleLines(i);
        if (i < 17) frameId = requestAnimationFrame(step);
        else animateAxes();
      };
      step();
    };
    const animateAxes = () => {
      let t = 0;
      const step = () => {
        t += 0.05;
        setAxisProgress(Math.min(t, 1));
        if (t < 1) frameId = requestAnimationFrame(step);
        else animatePoints();
      };
      step();
    };
    const animatePoints = () => {
      (["A", "B", "C"] as const).forEach((label, idx) => {
        let p = 0;
        const step = () => {
          p += 0.05;
          setPointProgress((prev) => ({ ...prev, [label]: Math.min(p, 1) }));
          if (p < 1) requestAnimationFrame(step);
        };
        setTimeout(step, (idx * 300) / speed);
      });
    };
    animateGrid();
    return () => cancelAnimationFrame(frameId);
  }, [speed, points]);

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, label: string) => {
    const node = e.target;
    const newX = Math.round((node.x() - center) / unit);
    const newY = Math.round(-(node.y() - center) / unit);
    setStudentPoints((prev) => ({ ...prev, [label]: { x: newX, y: newY } }));
    setSelectedLabel(label);
  };

  const getCoords = (label: string) => studentPoints[label];
  const selectedPoint = selectedLabel ? studentPoints[selectedLabel] : null;
  const module = selectedPoint ? Math.sqrt(selectedPoint.x ** 2 + selectedPoint.y ** 2) : null;

  // cos/sin + reconstruction
  const cosTheta = module && module !== 0 ? selectedPoint!.x / module : 1;
  const sinTheta = module && module !== 0 ? selectedPoint!.y / module : 0;
  const theta = Math.atan2(sinTheta, cosTheta);

  // Motion value pour interpolation
  const angleValue = useMotionValue(showDegrees ? (theta * 180) / Math.PI : theta);

  useEffect(() => {
    const target = showDegrees ? (theta * 180) / Math.PI : theta;
    const controls = animate(angleValue, target, { duration: 0.6, ease: "easeInOut" });
    return controls.stop;
  }, [showDegrees, theta]);

  const angleDisplay = showDegrees
    ? `${angleValue.get().toFixed(2)}°`
    : `${theta.toFixed(3)} rad`;

  return (
    <Box ref={ref} width="100%" maxW="100%" mx="auto" display="flex" flexDirection={panelDirection} gap={6}>
      {/* Canvas */}
      <Box flex="1">
        <Stage width={size.width} height={size.height} style={{ backgroundColor: "#fff" }}>
          <Layer>
            {/* Grille */}
            {[...Array(visibleLines)].map((_, i) => {
              const pos = i * unit;
              return (
                <>
                  <Line key={`v${i}`} points={[pos, 0, pos, size.height]} stroke="#ddd" strokeWidth={1} />
                  <Line key={`h${i}`} points={[0, pos, size.width, pos]} stroke="#ddd" strokeWidth={1} />
                </>
              );
            })}

            {/* Axes */}
            {axisProgress > 0 && (
              <>
                <Line points={[0, center, size.width, center]} stroke="black" strokeWidth={2} />
                <Line points={[center, 0, center, size.height]} stroke="black" strokeWidth={2} />
                <KonvaText text="Réel" x={size.width - 40} y={center - 20} fontSize={14} fontStyle="bold" fill="black" />
                <KonvaText text="Imaginaire pur" x={center + 10} y={10} fontSize={14} fontStyle="bold" fill="black" rotation={90} />
              </>
            )}

            {/* Points */}
            {(["A", "B", "C"] as const).map((label, idx) => {
              const color = ["red", "blue", "green"][idx];
              const p = getCoords(label);
              const x = center + p.x * unit;
              const y = center - p.y * unit;
              const prog = pointProgress[label] ?? 0;
              const isSelected = selectedLabel === label;

              return (
                <>
                  {isSelected && (
                    <>
                      <MultiHalo x={x} y={y} color={color} count={3} minRadius={12} maxRadius={28} speed={0.8} visible={true} />
                      <Line points={[x, y, x, center]} stroke={color} dash={[4, 4]} />
                      <Line points={[x, y, center, y]} stroke={color} dash={[4, 4]} />
                      <KonvaText text={`${p.x}`} x={x - 10} y={center + 5} fontSize={12} fill={color} />
                      <KonvaText text={`${p.y}`} x={center + 5} y={y - 10} fontSize={12} fill={color} />
                      <Line points={[center, center, x, y]} stroke={color} strokeWidth={2} opacity={0.8} />

                      {/* Arc animé */}
                      <Arc
                        x={center}
                        y={center}
                        innerRadius={20}
                        outerRadius={25}
                        angle={angleValue.get()}
                        rotation={0}
                        stroke={color}
                        strokeWidth={2}
                        opacity={0.7}
                      />
                      <KonvaText
                        text={angleDisplay}
                        x={center + 35}
                        y={center - 15}
                        fontSize={12}
                        fill={color}
                      />
                    </>
                  )}
                  <Circle
                    key={label}
                    x={x}
                    y={y}
                    radius={10 * Math.max(prog, 0.0001)}
                    fill={color}
                    draggable
                    onDragEnd={(e) => handleDragEnd(e, label)}
                    onClick={() => setSelectedLabel(label)}
                  />
                </>
              );
            })}
          </Layer>
        </Stage>

        {/* Slider vitesse (Chakra UI v3) */}
        <Box mt={4} px={[2, 4, 6]}>
          <Text mb={2} fontSize={["sm", "md"]}>
            Vitesse de l’animation : {speed.toFixed(1)}x
          </Text>
          <Slider.Root
            min={0.5}
            max={2}
            step={0.1}
            value={[speed]}
            onValueChange={(details) => setSpeed(details.value[0])}
          >
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb index={0} />
          </Slider.Root>
        </Box>
      </Box>

            {/* Panneau latéral */}
      <Collapsible.Root open={!!selectedPoint}>
        <Collapsible.Content>
          <Box
            minW="220px"
            p={4}
            bg="gray.50"
            border="1px solid #ddd"
            borderRadius="md"
            shadow="md"
          >
            <HStack justify="space-between" mb={3}>
              <Text fontSize="lg" fontWeight="bold">
                Étapes de calcul
              </Text>
              <HStack>
                <Text fontSize="sm">Deg</Text>
                <Switch.Root
                  checked={showDegrees}
                  onCheckedChange={(details) => setShowDegrees(details.checked)}
                >
                  <Switch.HiddenInput />
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch.Root>
                <Text fontSize="sm">Rad</Text>
              </HStack>
            </HStack>

            {selectedPoint ? (
              <VStack align="start" gap={2}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Text>Coordonnée : z = {selectedPoint.x} + i{selectedPoint.y}</Text>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Text>
                    Module : √({selectedPoint.x}² + {selectedPoint.y}²) = {module?.toFixed(2)}
                  </Text>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Text>
                    cos θ = {cosTheta.toFixed(3)}, sin θ = {sinTheta.toFixed(3)}
                  </Text>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Text>
                    Argument reconstruit par atan2(sin, cos) = {angleDisplay}
                  </Text>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <Text fontWeight="semibold">Forme trigonométrique :</Text>
                  <Text>
                    z = {module?.toFixed(2)} (cos({angleDisplay}) + i·sin({angleDisplay}))
                  </Text>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <Text fontWeight="semibold">Forme polaire :</Text>
                  <Text>
                    z = {module?.toFixed(2)} · e^{"i" + angleDisplay}
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
