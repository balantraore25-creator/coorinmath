import React, { useState, useEffect } from "react";
import { Stage, Layer, Line, Circle, Text as KonvaText } from "react-konva";
import {
  Box,
  Button,
  Text,
  Slider,
} from "@chakra-ui/react";
import type Konva from "konva";
import type { Point } from "../types";

interface Props {
  points: { A: Point; B: Point; C: Point };
  phase: number; // 1 = intro, 2 = placement, 3 = validation
  onValidate?: () => void;
}

export const ComplexCanvas: React.FC<Props> = ({ points, phase, onValidate }) => {
  const [studentPoints, setStudentPoints] = useState<{ [key: string]: Point }>({});
  const [visibleLines, setVisibleLines] = useState(0);
  const [axisProgress, setAxisProgress] = useState(0);
  const [graduationProgress, setGraduationProgress] = useState(0);
  const [pointProgress, setPointProgress] = useState<{ [key: string]: number }>({});
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [speed, setSpeed] = useState(1); // vitesse contrôlée par le slider

  const unit = 40;
  const size = 17 * unit;
  const center = size / 2;

  // Timeline orchestrée
  useEffect(() => {
    if (phase === 1) {
      let i = 0;
      const gridInterval = setInterval(() => {
        i++;
        setVisibleLines(i);
        if (i >= 17) {
          clearInterval(gridInterval);

          // Axes animés
          let t = 0;
          const axisInterval = setInterval(() => {
            t += 0.05;
            if (t >= 1) {
              t = 1;
              clearInterval(axisInterval);

              // Graduations
              let g = 0;
              const gradInterval = setInterval(() => {
                g++;
                setGraduationProgress(g);
                if (g >= 17) {
                  clearInterval(gradInterval);

                  // Points séquentiels
                  (["A", "B", "C"] as const).forEach((label, idx) => {
                    let p = 0;
                    const pointInterval = setInterval(() => {
                      p += 0.1;
                      if (p >= 1) {
                        p = 1;
                        clearInterval(pointInterval);
                      }
                      setPointProgress((prev) => ({ ...prev, [label]: p }));
                    }, (80 + idx * 150) / speed);
                  });
                }
              }, 150 / speed);
            }
            setAxisProgress(t);
          }, 50 / speed);
        }
      }, 100 / speed);

      return () => clearInterval(gridInterval);
    }
  }, [phase, speed]);

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, label: string) => {
    const node = e.target;
    const newX = Math.round((node.x() - center) / unit);
    const newY = Math.round(-(node.y() - center) / unit);
    setStudentPoints({ ...studentPoints, [label]: { x: newX, y: newY } });

    setProgress({ ...progress, [label]: 0 });
    let t = 0;
    const interval = setInterval(() => {
      t += 0.1;
      if (t >= 1) {
        t = 1;
        clearInterval(interval);
      }
      setProgress((prev) => ({ ...prev, [label]: t }));
    }, 50);
  };

  const getCoords = (label: string, defaultPoint: Point) => {
    const p = studentPoints[label] ?? defaultPoint;
    return { x: p.x, y: p.y };
  };

  return (
    <Box>
      <Stage width={size} height={size} style={{ backgroundColor: "#fff" }}>
        <Layer>
          {/* Grille progressive */}
          {[...Array(visibleLines)].map((_, i) => {
            const pos = i * unit;
            return (
              <>
                <Line key={`v${i}`} points={[pos, 0, pos, size]} stroke="#ddd" strokeWidth={1} />
                <Line key={`h${i}`} points={[0, pos, size, pos]} stroke="#ddd" strokeWidth={1} />
              </>
            );
          })}

          {/* Axes animés */}
          {axisProgress > 0 && (
            <>
              <Line points={[0, center, axisProgress * size, center]} stroke="black" strokeWidth={2} />
              <Line points={[center, 0, center, axisProgress * size]} stroke="black" strokeWidth={2} />
              {axisProgress === 1 && (
                <>
                  <Circle x={center} y={center} radius={5} fill="black" />
                  <KonvaText text="(0,0)" x={center + 8} y={center + 8} fontSize={12} />
                  <KonvaText text="axe des réels" x={size - 120} y={center + 5} fontSize={16} />
                  <KonvaText text="axe des imaginaires purs" x={center + 10} y={20} fontSize={16} />
                </>
              )}
            </>
          )}

          {/* Graduations animées */}
          {graduationProgress > 0 && (
            <>
              {[...Array(graduationProgress)].map((_, i) => {
                const x = i * unit;
                const value = i - 8;
                return value !== 0 ? (
                  <KonvaText key={`vx${i}`} text={`${value}`} x={x} y={center + 15} fontSize={12} />
                ) : null;
              })}
              {[...Array(graduationProgress)].map((_, i) => {
                const y = i * unit;
                const value = 8 - i;
                return value !== 0 ? (
                  <KonvaText key={`vy${i}`} text={`${value}`} x={center + 10} y={y} fontSize={12} />
                ) : null;
              })}
            </>
          )}

          {/* Points avec halo et zoom progressif */}
          {phase >= 2 &&
            (["A", "B", "C"] as const).map((label, idx) => {
              const color = ["red", "blue", "green"][idx];
              const p = getCoords(label, points[label]);
              const x = center + p.x * unit;
              const y = center - p.y * unit;
              const prog = pointProgress[label] ?? 0;

              return (
                <>
                  {prog > 0 && (
                    <Circle
                      x={x}
                      y={y}
                      radius={15 * prog}
                      stroke={color}
                      strokeWidth={2}
                      opacity={0.4 * (1 - prog)}
                    />
                  )}
                  <Circle
                    key={label}
                    x={x}
                    y={y}
                    radius={10 * prog}
                    fill={color}
                    draggable
                    onDragEnd={(e) => handleDragEnd(e, label)}
                  />
                </>
              );
            })}
        </Layer>
      </Stage>

      {/* Slider interactif pour la vitesse */}
      <Box mt={4}>
        <Text mb={2}>Vitesse de l’animation : {speed.toFixed(1)}x</Text>
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

      {/* Bouton de validation en phase 3 */}
      {phase === 3 && (
        <Button mt={4} colorScheme="blue" onClick={onValidate}>
          Valider
        </Button>
      )}
    </Box>
  );
};
