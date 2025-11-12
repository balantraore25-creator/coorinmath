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
  const [visibleAxes, setVisibleAxes] = useState(false);
  const [visibleCircles, setVisibleCircles] = useState(false);
  const [scale, setScale] = useState(0.5);

  // Animation progressive de la grille
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= 13) {
        clearInterval(interval);
        setVisibleAxes(true);
        // après les axes, on lance les boules
        setTimeout(() => {
          setVisibleCircles(true);
          // rebond simple
          let step = 0.1;
          const bounce = setInterval(() => {
            setScale((s) => {
              const next = s + step;
              if (next >= 1.2) step = -0.1;
              if (next <= 1) {
                clearInterval(bounce);
                return 1;
              }
              return next;
            });
              return 1;
          }, 100);
        }, 500);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, label: string) => {
    const node = e.target;
    const newX = Math.round((node.x() - 260) / 40);
    const newY = Math.round(-(node.y() - 260) / 40);
    setStudentPoints({ ...studentPoints, [label]: { x: newX, y: newY } });
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

  return (
    <Box>
      <Stage width={520} height={520} style={{ backgroundColor: "#fff" }}>
        <Layer>
          {/* Grille progressive */}
          {[...Array(visibleLines)].map((_, i) => {
            const pos = i * 40;
            return (
              <>
                <Line key={`v${i}`} points={[pos, 0, pos, 520]} stroke="#ddd" />
                <Line key={`h${i}`} points={[0, pos, 520, pos]} stroke="#ddd" />
              </>
            );
          })}

          {/* Axes et labels */}
          {visibleAxes && (
            <>
              <Line points={[0, 260, 520, 260]} stroke="black" strokeWidth={2} />
              <Line points={[260, 0, 260, 520]} stroke="black" strokeWidth={2} />
              <KonvaText text="Re(z)" x={480} y={245} fontSize={16} fontStyle="bold" />
              <KonvaText text="Im(z)" x={270} y={20} fontSize={16} fontStyle="bold" />
              {/* Graduations horizontales */}
              {[...Array(13)].map((_, i) => {
                const x = i * 40;
                const value = i - 6;
                return (
                  <KonvaText
                    key={`vx${i}`}
                    text={`${value}`}
                    x={x}
                    y={275}
                    fontSize={12}
                    fill="black"
                  />
                );
              })}
              {/* Graduations verticales */}
              {[...Array(13)].map((_, i) => {
                const y = i * 40;
                const value = 6 - i;
                return (
                  <KonvaText
                    key={`vy${i}`}
                    text={`${value}`}
                    x={270}
                    y={y}
                    fontSize={12}
                    fill="black"
                  />
                );
              })}
            </>
          )}

          {/* Boules A, B, C avec fondu + rebond */}
          {visibleCircles &&
            (["A", "B", "C"] as const).map((label, idx) => {
              const color = ["red", "blue", "green"][idx];
              const student = studentPoints[label] ?? points[label];
              const x = 260 + student.x * 40;
              const y = 260 - student.y * 40;

              return (
                <Circle
                  key={label}
                  x={x}
                  y={y}
                  radius={10}
                  fill={color}
                  draggable
                  onDragEnd={(e) => handleDragEnd(e, label)}
                  opacity={1}
                  scaleX={scale}
                  scaleY={scale}
                />
              );
            })}
        </Layer>
      </Stage>

      <Button mt={4} colorScheme="blue" onClick={validate}>
        Valider
      </Button>
    </Box>
  );
};
