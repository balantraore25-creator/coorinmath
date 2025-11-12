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
  const [visibleLines, setVisibleLines] = useState(0);
  const [visibleAxes, setVisibleAxes] = useState(false);
  const [visibleCircles, setVisibleCircles] = useState(false);
  const [scale, setScale] = useState(0.5);

  const unit = 40; // longueur d'une division
  const size = 13 * unit; // -6 à +6 → 13 divisions
  const center = size / 2; // centre O(0,0)

  // Animation progressive
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= 13) {
        clearInterval(interval);
        setVisibleAxes(true);
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
            return () => clearInterval(bounce);
          }, 100);
        }, 500);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, label: string) => {
    const node = e.target;
    const newX = Math.round((node.x() - center) / unit);
    const newY = Math.round(-(node.y() - center) / unit);
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
      <Stage width={size} height={size} style={{ backgroundColor: "#fff" }}>
        <Layer>
          {/* Grille progressive */}
          {[...Array(visibleLines)].map((_, i) => {
            const pos = i * unit;
            const isCentral = i === 6;
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

          {/* Axes et graduations */}
          {visibleAxes && (
            <>
              <KonvaText text="Re(z)" x={size - 40} y={center - 15} fontSize={16} fontStyle="bold" />
              <KonvaText text="Im(z)" x={center + 10} y={20} fontSize={16} fontStyle="bold" />
              {[...Array(13)].map((_, i) => {
                const x = i * unit;
                const value = i - 6;
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
              })}
              {[...Array(13)].map((_, i) => {
                const y = i * unit;
                const value = 6 - i;
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
              })}
            </>
          )}

          {/* Boules A, B, C avec fondu + rebond */}
          {visibleCircles &&
            (["A", "B", "C"] as const).map((label, idx) => {
              const color = ["red", "blue", "green"][idx];
              const student = studentPoints[label] ?? points[label];
              const x = center + student.x * unit;
              const y = center - student.y * unit;

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

          {/* Instructions colorées */}
          <KonvaText
            text={`A : z = ${points.A.x} + i${points.A.y}`}
            x={10}
            y={10}
            fill="red"
            fontSize={14}
          />
          <KonvaText
            text={`B : z = ${points.B.x} + i${points.B.y}`}
            x={10}
            y={30}
            fill="blue"
            fontSize={14}
          />
          <KonvaText
            text={`C : z = ${points.C.x} + i${points.C.y}`}
            x={10}
            y={50}
            fill="green"
            fontSize={14}
          />
          <KonvaText
            text="Glisse chaque boule pour placer le point"
            x={10}
            y={70}
            fill="black"
            fontSize={14}
          />
        </Layer>
      </Stage>

      <Button mt={4} colorScheme="blue" onClick={validate}>
        Valider
      </Button>
    </Box>
  );
};
