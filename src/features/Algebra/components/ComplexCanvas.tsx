import React, { useState, useEffect } from "react";
import { Stage, Layer, Line, Circle, Text as KonvaText } from "react-konva";
import { Box, Button } from "@chakra-ui/react";
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
  const [progress, setProgress] = useState<{ [key: string]: number }>({});

  const unit = 40;
  const size = 17 * unit;
  const center = size / 2;

  // Animation progressive de la grille (phase 1)
  useEffect(() => {
    if (phase === 1) {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setVisibleLines(i);
        if (i >= 17) clearInterval(interval);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, label: string) => {
    const node = e.target;
    const newX = Math.round((node.x() - center) / unit);
    const newY = Math.round(-(node.y() - center) / unit);
    setStudentPoints({ ...studentPoints, [label]: { x: newX, y: newY } });

    // Animation des segments
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
            const isCentral = i === 8;
            return (
              <>
                <Line
                  key={`v${i}`}
                  points={[pos, 0, pos, size]}
                  stroke={isCentral ? "black" : "#ddd"}
                  strokeWidth={isCentral ? 2 : 1}
                />
                <Line
                  key={`h${i}`}
                  points={[0, pos, size, pos]}
                  stroke={isCentral ? "black" : "#ddd"}
                  strokeWidth={isCentral ? 2 : 1}
                />
              </>
            );
          })}

          {/* Axes et graduations visibles après la grille */}
          {visibleLines >= 17 && (
            <>
              <KonvaText text="axe des réels" x={size - 120} y={center + 5} fontSize={16} />
              <KonvaText text="axe des imaginaires purs" x={center + 10} y={20} fontSize={16} />
              {[...Array(17)].map((_, i) => {
                const x = i * unit;
                const value = i - 8;
                return value !== 0 ? (
                  <KonvaText key={`vx${i}`} text={`${value}`} x={x} y={center + 15} fontSize={12} />
                ) : null;
              })}
              {[...Array(17)].map((_, i) => {
                const y = i * unit;
                const value = 8 - i;
                return value !== 0 ? (
                  <KonvaText key={`vy${i}`} text={`${value}`} x={center + 10} y={y} fontSize={12} />
                ) : null;
              })}
            </>
          )}

          {/* Boules et segments visibles en phase 2 */}
          {phase >= 2 &&
            (["A", "B", "C"] as const).map((label, idx) => {
              const color = ["red", "blue", "green"][idx];
              const p = getCoords(label, points[label]);
              const x = center + p.x * unit;
              const y = center - p.y * unit;
              const prog = progress[label] ?? 1;

              return (
                <>
                  <Line
                    points={[x, center, x, center + (y - center) * prog]}
                    stroke={color}
                    dash={[6, 6]}
                    strokeWidth={2}
                  />
                  <Line
                    points={[center, y, center + (x - center) * prog, y]}
                    stroke={color}
                    dash={[6, 6]}
                    strokeWidth={2}
                  />
                  <Circle
                    key={label}
                    x={x}
                    y={y}
                    radius={10}
                    fill={color}
                    draggable
                    onDragEnd={(e) => handleDragEnd(e, label)}
                  />
                </>
              );
            })}

          {/* Instructions dynamiques */}
          {phase >= 2 && (() => {
            const A = getCoords("A", points.A);
            const B = getCoords("B", points.B);
            const C = getCoords("C", points.C);
            return (
              <>
                <KonvaText
                  text={`A : z = ${A.x} + i${A.y} → Coordonnées (${A.x}, ${A.y})`}
                  x={10}
                  y={10}
                  fill="red"
                  fontSize={14}
                />
                <KonvaText
                  text={`B : z = ${B.x} + i${B.y} → Coordonnées (${B.x}, ${B.y})`}
                  x={10}
                  y={30}
                  fill="blue"
                  fontSize={14}
                />
                <KonvaText
                  text={`C : z = ${C.x} + i${C.y} → Coordonnées (${C.x}, ${C.y})`}
                  x={10}
                  y={50}
                  fill="green"
                  fontSize={14}
                />
              </>
            );
          })()}
        </Layer>
      </Stage>

      {/* Bouton de validation en phase 3 */}
      {phase === 3 && (
        <Button mt={4} colorScheme="blue" onClick={onValidate}>
          Valider
        </Button>
      )}
    </Box>
  );
};
