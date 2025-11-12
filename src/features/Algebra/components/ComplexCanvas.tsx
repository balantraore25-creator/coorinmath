import React, { useState, useEffect } from "react";
import { Stage, Layer, Line, Circle, Text as KonvaText } from "react-konva";
import { Box, Button } from "@chakra-ui/react";
import type Konva from "konva";

export type Point = { x: number; y: number };

interface Props {
  points: { A: Point; B: Point; C: Point };
}

export const ComplexCanvas: React.FC<Props> = ({ points }) => {
  const [studentPoints, setStudentPoints] = useState<{ [key: string]: Point }>({});
  const [visibleLines, setVisibleLines] = useState(0); // compteur pour la grille
  const [progress, setProgress] = useState<{ [key: string]: number }>({});

  const unit = 40; // 1 unité = 40px
  const size = 17 * unit; // de -8 à +8 → 17 divisions
  const center = size / 2; // centre O(0,0)

  // Animation progressive de la grille
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= 17) {
        clearInterval(interval);
      }
    }, 100); // une ligne toutes les 100ms
    return () => clearInterval(interval);
  }, []);

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, label: string) => {
    const node = e.target;
    const newX = Math.round((node.x() - center) / unit);
    const newY = Math.round(-(node.y() - center) / unit);
    setStudentPoints({ ...studentPoints, [label]: { x: newX, y: newY } });

    // Lance l'animation des segments
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

  const validate = () => {
    const results = Object.entries(points).map(([label, p]) => {
      const student = studentPoints[label];
      if (!student) return `${label}: non placé ❌`;
      return student.x === p.x && student.y === p.y
        ? `${label}: correct ✅`
        : `${label}: attendu (${p.x},${p.y}), obtenu (${student.x},${student.y}) ❌`;
    });
    alert(results.join("\n"));
  };

  const getCoords = (label: string, defaultPoint: Point) => {
    const p = studentPoints[label] ?? defaultPoint;
    return { x: p.x, y: p.y };
  };

  return (
    <Box>
      <Stage width={size} height={size} style={{ backgroundColor: "#fff" }}>
        <Layer>
          {/* Grille progressive avec axes confondus */}
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

          {/* Labels des axes */}
          {visibleLines >= 17 && (
            <>
              <KonvaText text="axe des réels" x={size - 120} y={center + 5} fontSize={16} />
              <KonvaText text="axe des imaginaires purs" x={center + 10} y={20} fontSize={16} />
            </>
          )}

          {/* Graduations horizontales */}
          {visibleLines >= 17 &&
            [...Array(17)].map((_, i) => {
              const x = i * unit;
              const value = i - 8;
              if (value !== 0) {
                return (
                  <KonvaText
                    key={`vx${i}`}
                    text={`${value}`}
                    x={x}
                    y={center + 15}
                    fontSize={12}
                    fill="black"
                  />
                );
              }
              return null;
            })}

          {/* Graduations verticales */}
          {visibleLines >= 17 &&
            [...Array(17)].map((_, i) => {
              const y = i * unit;
              const value = 8 - i;
              if (value !== 0) {
                return (
                  <KonvaText
                    key={`vy${i}`}
                    text={`${value}`}
                    x={center + 10}
                    y={y}
                    fontSize={12}
                    fill="black"
                  />
                );
              }
              return null;
            })}

          {/* Boules A, B, C avec segments pointillés animés */}
          {visibleLines >= 17 &&
            (["A", "B", "C"] as const).map((label, idx) => {
              const color = ["red", "blue", "green"][idx];
              const p = getCoords(label, points[label]);
              const x = center + p.x * unit;
              const y = center - p.y * unit;
              const prog = progress[label] ?? 1; // 1 = segment complet

              return (
                <>
                  {/* Segment vertical animé */}
                  <Line
                    points={[x, center, x, center + (y - center) * prog]}
                    stroke={color}
                    dash={[6, 6]}
                    strokeWidth={2}
                  />
                  {/* Segment horizontal animé */}
                  <Line
                    points={[center, y, center + (x - center) * prog, y]}
                    stroke={color}
                    dash={[6, 6]}
                    strokeWidth={2}
                  />

                  {/* Boule draggable */}
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
          {visibleLines >= 17 && (() => {
            const A = getCoords("A", points.A);
            const B = getCoords("B", points.B);
            const C = getCoords("C", points.C);
            return (
              <>
                <KonvaText
                  text={`A : z = ${A.x} + i${A.y}  → Coordonnées (${A.x}, ${A.y})`}
                  x={10}
                  y={10}
                  fill="red"
                  fontSize={14}
                />
                <KonvaText
                  text={`B : z = ${B.x} + i${B.y}  → Coordonnées (${B.x}, ${B.y})`}
                  x={10}
                  y={30}
                  fill="blue"
                  fontSize={14}
                />
                <KonvaText
                  text={`C : z = ${C.x} + i${C.y}  → Coordonnées (${C.x}, ${C.y})`}
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

      <Button mt={4} colorScheme="blue" onClick={validate}>
        Valider
      </Button>
    </Box>
  );
};

