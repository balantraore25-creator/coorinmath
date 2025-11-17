"use client";

import React, { useState, useEffect } from "react";
import { Stage, Layer, Line, Circle, Arc, Text as KonvaText } from "react-konva";
import { Box, Text, VStack, HStack, useBreakpointValue } from "@chakra-ui/react";
import { useMotionValue, animate } from "framer-motion";
import type Konva from "konva";
import type { Point } from "../types";
import { useContainerSize } from "../components/useContainerSize";
import { MultiHalo } from "./MultiHalo";
import { useAngle } from "./hooks/useAngle";
import { TrigCircleAnimated } from "./TrigCircleAnimated";
import { Toggle } from "./Toggle";

interface Props {
  points?: { A?: Point; B?: Point; C?: Point };
}

type StudentPoints = Record<"A" | "B" | "C", Point>;
type ProgressMap = Record<"A" | "B" | "C", number>;

export const ComplexCanvas: React.FC<Props> = ({ points }) => {
  const safePoints: StudentPoints = {
    A: points?.A ?? { x: 0, y: 0 },
    B: points?.B ?? { x: 0, y: 0 },
    C: points?.C ?? { x: 0, y: 0 },
  };

  const { ref, size } = useContainerSize();
  const [studentPoints, setStudentPoints] = useState<StudentPoints>(safePoints);
  const [visibleLines, setVisibleLines] = useState(0);
  const [axisProgress, setAxisProgress] = useState(0);
  const [pointProgress, setPointProgress] = useState<Partial<ProgressMap>>({});
  const [selectedLabel, setSelectedLabel] = useState<keyof StudentPoints | null>(null);
  const [showDegrees, setShowDegrees] = useState(true);

  const safeW = Number.isFinite(size.width) ? size.width : 0;
  const safeH = Number.isFinite(size.height) ? size.height : 0;
  const unit = safeW / 17;
  const center = safeW / 2;
  const panelDirection = useBreakpointValue({ base: "column", md: "row" });

  useEffect(() => {
    setStudentPoints(safePoints);
  }, [points]);

  // Animations
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
        setTimeout(step, idx * 300);
      });
    };
    animateGrid();
    return () => cancelAnimationFrame(frameId);
  }, []);

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, label: keyof StudentPoints) => {
    const node = e.target;
    const newX = Math.round((node.x() - center) / unit);
    const newY = Math.round(-(node.y() - center) / unit);
    if (isNaN(newX) || isNaN(newY)) return;
    setStudentPoints((prev) => ({ ...prev, [label]: { x: newX, y: newY } }));
    setSelectedLabel(label);
  };

  const selectedPoint: Point | null = selectedLabel ? studentPoints[selectedLabel] : null;

  // Toujours appeler useAngle
  const spX = Number.isFinite(selectedPoint?.x) ? selectedPoint!.x : 0;
  const spY = Number.isFinite(selectedPoint?.y) ? selectedPoint!.y : 0;
  const { module, angleRad, angleDeg, cosTheta, sinTheta } = useAngle(spX, spY);

  const angleValue = useMotionValue(showDegrees ? angleDeg : angleRad);
  useEffect(() => {
    const target = showDegrees ? angleDeg : angleRad;
    const controls = animate(angleValue, target, { duration: 0.6, ease: "easeInOut" });
    return controls.stop;
  }, [showDegrees, angleDeg, angleRad]);

  const angleDisplay = showDegrees
    ? `${angleDeg.toFixed(2)}°`
    : `${angleRad.toFixed(3)} rad`;

  return (
    <Box ref={ref} width="100%" maxW="100%" mx="auto" display="flex" flexDirection={panelDirection} gap={6}>
      {/* Canvas */}
      <Box flex="1">
        <Stage width={safeW} height={safeH} style={{ backgroundColor: "#fff" }}>
          <Layer>
            {/* Grille */}
            {[...Array(visibleLines ?? 0)].map((_, i) => {
              const pos = i * unit;
              return (
                <React.Fragment key={i}>
                  <Line points={[pos, 0, pos, safeH]} stroke="#ddd" strokeWidth={1} />
                  <Line points={[0, pos, safeW, pos]} stroke="#ddd" strokeWidth={1} />
                </React.Fragment>
              );
            })}

            {/* Axes */}
            {axisProgress > 0 && (
              <>
                <Line points={[0, center, safeW, center]} stroke="black" strokeWidth={2} />
                <Line points={[center, 0, center, safeH]} stroke="black" strokeWidth={2} />
                <KonvaText text="Réel" x={safeW - 40} y={center - 20} fontSize={14} fontStyle="bold" fill="black" />
                <KonvaText text="Imaginaire pur" x={center + 10} y={10} fontSize={14} fontStyle="bold" fill="black" rotation={90} />
              </>
            )}

            {/* Points A, B, C */}
            {(["A", "B", "C"] as const).map((label, idx) => {
              const color = ["red", "blue", "green"][idx];
              const p = studentPoints[label];
              if (!p) return null;

              const x = Number.isFinite(center + p.x * unit) ? center + p.x * unit : center;
              const y = Number.isFinite(center - p.y * unit) ? center - p.y * unit : center;
              const prog = pointProgress[label] ?? 0;
              const isSelected = selectedLabel === label;

              return (
                <React.Fragment key={label}>
                  {isSelected && selectedPoint && (
                    <>
                      <MultiHalo x={x} y={y} color={color} count={3} minRadius={12} maxRadius={28} speed={0.8} visible />
                      <Line points={[center, center, x, y]} stroke={color} strokeWidth={2} opacity={0.8} />

                      {/* ✅ Projections sur les axes */}
                      <Line points={[x, y, x, center]} stroke={color} strokeWidth={1} dash={[4, 4]} opacity={0.6} />
                      <Line points={[x, y, center, y]} stroke={color} strokeWidth={1} dash={[4, 4]} opacity={0.6} />

                      {/* ✅ Labels des coordonnées projetées */}
                      <KonvaText text={`x = ${selectedPoint.x}`} x={x + 5} y={center + 5} fontSize={12} fill={color} />
                      <KonvaText text={`y = ${selectedPoint.y}`} x={center + 5} y={y - 15} fontSize={12} fill={color} />

                      <Arc x={center} y={center} innerRadius={20} outerRadius={25} angle={angleValue.get()} rotation={0} fill={`${color}33`} stroke={color} strokeWidth={2} opacity={0.7} />
                      <KonvaText text={angleDisplay} x={center + 35} y={center - 15} fontSize={12} fill={color} />
                    </>
                  )}
                  <Circle
                    x={x}
                    y={y}
                    radius={10 * Math.max(prog, 0.0001)}
                    fill={color}
                    draggable
                                        onDragEnd={(e) => handleDragEnd(e, label)}
                    onClick={() => setSelectedLabel(label)}
                  />
                </React.Fragment>
              );
            })}
          </Layer>
        </Stage>
      </Box>

      {/* Panneau latéral */}
      <Box
        minW="300px"
        p={4}
        bg="gray.50"
        border="1px solid #ddd"
        borderRadius="md"
        shadow="md"
      >
        <Text fontSize="lg" fontWeight="bold" mb={3}>
          Étapes de calcul
        </Text>
        {selectedPoint ? (
          <VStack align="start" gap={2}>
            <Text>① Coordonnée : z = {selectedPoint.x} + i{selectedPoint.y}</Text>
            <Text>② Module : {module.toFixed(2)}</Text>
            <Text>
              ③ cos θ = {cosTheta.toFixed(3)}, sin θ = {sinTheta.toFixed(3)}
            </Text>
            <Text>④ Argument = {angleDisplay}</Text>
            <Text>
              ⑤ Forme trigonométrique : z = {module.toFixed(2)} (cos({angleDisplay}) + i·sin({angleDisplay}))
            </Text>
            <Text>
              ⑥ Forme polaire : z = {module.toFixed(2)} · e^(i{angleDisplay})
            </Text>
            {/* ✅ Projections affichées en texte */}
            <Text>⑦ Projection sur l’axe réel : x = {selectedPoint.x}</Text>
            <Text>⑧ Projection sur l’axe imaginaire : y = {selectedPoint.y}</Text>
          </VStack>
        ) : (
          <Text>Aucune boule sélectionnée</Text>
        )}

        {/* Toggle degrés ↔ radians */}
        <HStack mt={4}>
          <Text fontSize="sm">Deg</Text>
          <Toggle checked={showDegrees} onChange={setShowDegrees} />
          <Text fontSize="sm">Rad</Text>
        </HStack>
      </Box>

      {/* Cercle trigonométrique animé */}
      {selectedPoint &&
        Number.isFinite(selectedPoint.x) &&
        Number.isFinite(selectedPoint.y) && (
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
