import React, { useState, useEffect } from "react";
import { Stage, Layer, Line, Circle } from "react-konva";
import { Box, Text, Slider, VStack, Collapsible } from "@chakra-ui/react";
import type Konva from "konva";
import type { Point } from "../types";
import { useContainerSize } from "../components/useContainerSize";
import { Halo } from "./Halo";

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

  const unit = size.width / 17;
  const center = size.width / 2;

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
  const module =
    selectedPoint !== null
      ? Math.sqrt(selectedPoint.x ** 2 + selectedPoint.y ** 2)
      : null;
  const argument =
    selectedPoint !== null ? Math.atan2(selectedPoint.y, selectedPoint.x) : null;

  return (
    <Box ref={ref} width="100%" maxW="100%" mx="auto" display="flex" gap={6}>
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
              </>
            )}

            {/* Points + halo */}
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
                    <Halo
                      x={x}
                      y={y}
                      color={color}
                      minRadius={12}
                      maxRadius={28}
                      speed={0.8}
                      visible={true}
                    />
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

        {/* Slider vitesse */}
        <Box mt={4} px={[2, 4, 6]}>
          <Text mb={2} fontSize={["sm", "md"]}>
            Vitesse de l’animation : {speed.toFixed(1)}x
          </Text>
          <Slider.Root
            min={0.5}
            max={2}
            step={0.1}
            value={[speed]}
            onValueChange={(details: { value: number[] }) => setSpeed(details.value[0])}
          >
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb index={0}>
              <Slider.ValueText />
            </Slider.Thumb>
          </Slider.Root>
        </Box>
      </Box>

      {/* Panneau latéral animé avec Collapsible v3 */}
      <Collapsible.Root open={!!selectedPoint}>
        <Collapsible.Content>
          <Box
            minW="220px"
            p={4}
            bg="gray.50"
            border="1px solid #ddd"
            borderRadius="md"
            fontFamily="sans-serif"
            shadow="md"
          >
            <Text fontSize="lg" fontWeight="bold" mb={3}>
              Point sélectionné
            </Text>
            {selectedPoint ? (
              <VStack align="start" gap={2}>
                <Text>
                  Coordonnée : {selectedPoint.x} + i{selectedPoint.y}
                </Text>
                <Text>Module : {module?.toFixed(2)}</Text>
                <Text>
                  Argument :{" "}
                  {argument !== null
                    ? ((argument * 180) / Math.PI).toFixed(2) + "°"
                    : ""}
                </Text>
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
