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

  // Gestion du drag & drop
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, label: string) => {
    const node = e.target;
    const newX = Math.round((node.x() - 260) / 40);
    const newY = Math.round(-(node.y() - 260) / 40);
    setStudentPoints({ ...studentPoints, [label]: { x: newX, y: newY } });
  };

  // Validation
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
      <Stage width={520} height={520} style={{ backgroundColor: "#fff" }}>
        <Layer>
          {/* Grille */}
          {[...Array(13)].map((_, i) => {
            const pos = i * 40;
            return (
              <>
                <Line key={`v${i}`} points={[pos, 0, pos, 520]} stroke="#ddd" />
                <Line key={`h${i}`} points={[0, pos, 520, pos]} stroke="#ddd" />
              </>
            );
          })}

          {/* Axes orthonormés */}
          <Line points={[0, 260, 520, 260]} stroke="black" strokeWidth={2} /> {/* Axe Re(z) */}
          <Line points={[260, 0, 260, 520]} stroke="black" strokeWidth={2} /> {/* Axe Im(z) */}

          {/* Labels des axes */}
          <Text text="Re(z)" x={480} y={245} fontSize={16} fontStyle="bold" />
          <Text text="Im(z)" x={270} y={20} fontSize={16} fontStyle="bold" />

          {/* Graduations horizontales */}
          {[...Array(13)].map((_, i) => {
            const x = i * 40;
            const value = i - 6;
            return (
              <Text key={`vx${i}`} text={`${value}`} x={x} y={275} fontSize={12} fill="black" />
            );
          })}

          {/* Graduations verticales */}
          {[...Array(13)].map((_, i) => {
            const y = i * 40;
            const value = 6 - i;
            return (
              <Text key={`vy${i}`} text={`${value}`} x={270} y={y} fontSize={12} fill="black" />
            );
          })}

          {/* Boules A, B, C visibles et draggables */}
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
        </Layer>
      </Stage>

      {/* Bouton de validation */}
      <Button mt={4} colorScheme="blue" onClick={validate}>
        Valider
      </Button>
    </Box>
  );
};
