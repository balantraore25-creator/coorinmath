import React, { useState } from "react";
import { Stage, Layer, Line, Circle, Text as KonvaText } from "react-konva";
import { Box, Button } from "@chakra-ui/react";
import type Konva from "konva";

export type Point = { x: number; y: number };

interface Props {
  points: { A: Point; B: Point; C: Point };
}

export const ComplexCanvas: React.FC<Props> = ({ points }) => {
  const [studentPoints, setStudentPoints] = useState<{ [key: string]: Point }>({});
  const [halo, setHalo] = useState<{ [key: string]: boolean }>({});

  const unit = 40; // longueur d'une division
  const size = 13 * unit; // -6 à +6 → 13 divisions
  const center = size / 2; // centre O(0,0)

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, label: string) => {
    const node = e.target;
    const newX = Math.round((node.x() - center) / unit);
    const newY = Math.round(-(node.y() - center) / unit);
    setStudentPoints({ ...studentPoints, [label]: { x: newX, y: newY } });

    // Active le halo pour ce point
    setHalo({ ...halo, [label]: true });
    setTimeout(() => {
      setHalo((prev) => ({ ...prev, [label]: false }));
    }, 600); // halo disparaît après 600ms
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
          {/* Grille avec axes confondus aux lignes centrales */}
          {[...Array(13)].map((_, i) => {
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

          {/* Labels des axes */}
          <KonvaText text="Re(z)" x={size - 40} y={center - 15} fontSize={16} fontStyle="bold" />
          <KonvaText text="Im(z)" x={center + 10} y={20} fontSize={16} fontStyle="bold" />

          {/* Graduations horizontales */}
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

          {/* Graduations verticales */}
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

          {/* Boules A, B, C avec halo animé */}
          {(["A", "B", "C"] as const).map((label, idx) => {
            const color = ["red", "blue", "green"][idx];
            const student = studentPoints[label] ?? points[label];
            const x = center + student.x * unit;
            const y = center - student.y * unit;

            return (
              <>
                {/* Halo animé */}
                {halo[label] && (
                  <Circle
                    x={x}
                    y={y}
                    radius={20}
                    stroke={color}
                    strokeWidth={3}
                    opacity={0.5}
                  />
                )}
                {/* Boule principale */}
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
          {(() => {
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
