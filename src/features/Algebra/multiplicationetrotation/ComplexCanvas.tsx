"use client"

import React, { useState, useEffect } from "react";
import { Stage, Layer, Line, Circle, Arc, Text as KonvaText } from "react-konva";
import {
  Box,
  Text,
  VStack,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useMotionValue, animate } from "framer-motion";
import type Konva from "konva";
import type { Point } from "../types";
import { useContainerSize } from "../components/useContainerSize";
import { MultiHalo } from "./MultiHalo";
import { useAngle } from "./hooks/useAngle";
import { TrigCircleAnimated } from "./TrigCircleAnimated";
import { Toggle } from "./Toggle";

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
  const [speed] = useState(1); // ✅ vitesse fixe ou modifiable ailleurs
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [showDegrees, setShowDegrees] = useState(true);

  const unit = size.width / 17;
  const center = size.width / 2;
  const panelDirection = useBreakpointValue({ base: "column", md: "row" });

  useEffect(() => {
    setStudentPoints(points);
    setVisibleLines(0);
    setAxisProgress(0);
    setPointProgress({});
    setSelectedLabel(null);
  }, [points]);

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

  const selectedPoint = selectedLabel ? studentPoints[selectedLabel] : null;
  const { module, angleRad, angleDeg, cosTheta, sinTheta } = selectedPoint
    ? useAngle(selectedPoint.x, selectedPoint.y)
    : { module: null, angleRad: 0, angleDeg: 0, cosTheta: 1, sinTheta: 0 };

  const angleValue = useMotionValue(showDegrees ? angleDeg : angleRad);
  useEffect(() => {
    const target = showDegrees ? angleDeg : angleRad;
    const controls = animate(angleValue, target, { duration: 0.6, ease: "easeInOut" });
    return controls.stop;
  }, [showDegrees, angleDeg, angleRad]);

  const angleDisplay = showDegrees
    ? `${angleValue.get().toFixed(2)}°`
    : `${angleValue.get().toFixed(3)} rad`;

  return (
    <Box
      ref={ref}
      width="100%"
      maxW="100%"
      mx="auto"
      display="flex"
      flexDirection={panelDirection}
      gap={6}
    >
      {/* Canvas */}
      <Box flex="1">
        <Stage width={size.width} height={size.height} style={{ backgroundColor: "#fff" }}>
          <Layer>
            {[...Array(visibleLines || 0)].map((_, i) => {
              const pos = i * unit;
              return (
                <>
                  <Line key={`v${i}`} points={[pos, 0, pos, size.height]} stroke="#ddd" strokeWidth={1} />
                  <Line key={`h${i}`} points={[0, pos, size.width, pos]} stroke="#ddd" strokeWidth={1} />
                </>
              );
            })}
            {axisProgress > 0 && (
              <>
                <Line points={[0, center, size.width, center]} stroke="black" strokeWidth={2} />
                <Line points={[center, 0, center, size.height]} stroke="black" strokeWidth={2} />
                <KonvaText text="Réel" x={size.width - 40} y={center - 20} fontSize={14} fontStyle="bold" fill="black" />
                <KonvaText text="Imaginaire pur" x={center + 10} y={10} fontSize={14} fontStyle="bold" fill="black" rotation={90} />
              </>
            )}
            {(["A", "B", "C"] as const).map((label, idx) => {
              const color = ["red", "blue", "green"][idx];
              const p = studentPoints[label];
              const x = center + p.x * unit;
              const y = center - p.y * unit;
              const prog = pointProgress[label] ?? 0;
              const isSelected = selectedLabel === label;

              return (
                <>
                  {isSelected && (
                    <>
                      <MultiHalo x={x} y={y} color={color} count={3} minRadius={12} maxRadius={28} speed={0.8} visible />
                      <Line points={[center, center, x, y]} stroke={color} strokeWidth={2} opacity={0.8} />
                      <Arc x={center} y={center} innerRadius={20} outerRadius={25} angle={angleValue.get()} rotation={0} fill={`${color}33`} stroke={color} strokeWidth={2} opacity={0.7} />
                      <KonvaText text={angleDisplay} x={center + 35} y={center - 15} fontSize={12} fill={color} />
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
      </Box>

      {/* Panneau latéral + cercle trigonométrique */}
      <Box minW="300px" p={4} bg="gray.50" border="1px solid #ddd" borderRadius="md" shadow="md">
        <Text fontSize="lg" fontWeight="bold" mb={3}>Étapes de calcul</Text>
        {selectedPoint ? (
          <VStack align="start" gap={2}>
            <Text>① Coordonnée : z = {selectedPoint.x} + i{selectedPoint.y}</Text>
            <Text>② Module : {module?.toFixed(2)}</Text>
            <Text>③ cos θ = {cosTheta.toFixed(3)}, sin θ = {sinTheta.toFixed(3)}</Text>
            <Text>④ Argument = {angleDisplay}</Text>
            <Text>
              ⑤ Forme trigonométrique : z = {module?.toFixed(2)} (cos({angleDisplay}) + i·sin({angleDisplay}))
            </Text>
            <Text>
              ⑥ Forme polaire : z = {module?.toFixed(2)} · e^(i{angleDisplay})
            </Text>
          </VStack>
        ) : (
          <Text>Aucune boule sélectionnée</Text>
        )}

                <HStack mt={4}>
          <Text fontSize="sm">Deg</Text>
          <Toggle checked={showDegrees} onChange={setShowDegrees} />
          <Text fontSize="sm">Rad</Text>
        </HStack>
      </Box>

      {/* Visualisation cercle trigonométrique */}
      {selectedPoint && (
        <TrigCircleAnimated
          x={selectedPoint.x}
          y={selectedPoint.y}
          showDegrees={showDegrees}
          onToggle={() => setShowDegrees(!showDegrees)}
        />
      )}
    </Box>
  );
};
