import React, { useState } from "react";
import { Stage, Layer, Line, Text, Circle } from "react-konva";
import { Box, Button } from "@chakra-ui/react";
import type Konva from "konva";

export type Point = { x: number; y: number };

interface Props {
  points: { A: Point; B: Point; C: Point };
}

export const ComplexCanvas: React.FC<Props> = ({ points }) => {
  const [studentPoints, setStudentPoints] = useState<{ [key: string]: Point }>({});

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
      {/* Stage couvrant -6 à +6 → 13 cases × 40px = 520px */}
      <Stage width={520} height={520} style={{ backgroundColor: "#fafafa" }}>
        <Layer>
          {/* Grille verticale */}
          {[...Array(13)].map((_, i) => {
            const x = i * 40;
            return (
              <Line
                key={`v${i}`}
                points={[x, 0, x, 520]}
                stroke="#ccc"
                strokeWidth={1}
              />
            );
          })}

          {/* Grille horizontale */}
          {[...Array(13)].map((_, i) => {
            const y = i * 40;
            return (
              <Line
                key={`h${i}`}
                points={[0, y, 520, y]}
                stroke="#ccc"
                strokeWidth={1}
              />
            );
          })}

          {/* Axes orthonormés centrés en O(0;0) */}
          <Line points={[0, 260, 520, 260]} stroke="black" strokeWidth={2} /> {/* Axe Re(z) */}
          <Line points={[260, 0, 260, 520]} stroke="black" strokeWidth={2} /> {/* Axe Im(z) */}

          {/* Labels des axes */}
          <Text text="Re(z)" x={480} y={245} fontSize={16} fontStyle="bold" />
          <Text text="Im(z)" x={270} y={10} fontSize={16} fontStyle="bold" />

          {/* Graduations sur l’axe horizontal */}
          {[...Array(13)].map((_, i) => {
            const x = i * 40;
            const value = i - 6;
            return (
              <Text
                key={`vx${i}`}
                text={`${value}`}
                x={x}
                y={265}
                fontSize={12}
                fill="black"
              />
            );
          })}

          {/* Graduations sur l’axe vertical */}
          {[...Array(13)].map((_, i) => {
            const y = i * 40;
            const value = 6 - i;
            return (
              <Text
                key={`vy${i}`}
                text={`${value}`}
                x={265}
                y={y}
                fontSize={12}
                fill="black"
              />
            );
          })}

          {/* Boules A, B, C visibles dès le départ */}
          {(["A", "B", "C"] as const).map((label, idx) => {
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
              />
            );
          })}

          {/* Instructions */}
          <Text text={`A : z = ${points.A.x} + i${points.A.y}`} x={10} y={10} fill="red" />
          <Text text={`B : z = ${points.B.x} + i${points.B.y}`} x={10} y={30} fill="blue" />
          <Text text={`C : z = ${points.C.x} + i${points.C.y}`} x={10} y={50} fill="green" />
          <Text text="Glisse chaque boule pour placer le point" x={10} y={70} />
        </Layer>
      </Stage>
      <Button mt={4} colorScheme="blue" onClick={validate}>
        Valider
      </Button>
    </Box>
  );
};
