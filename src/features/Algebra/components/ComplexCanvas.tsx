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
          {/* Grille avec ligne centrale épaissie pour les axes */}
          {[...Array(13)].map((_, i) => {
            const pos = i * 40;
            const isCentral = i === 6; // ligne centrale
            return (
              <>
                <Line
                  key={`v${i}`}
                  points={[pos, 0, pos, 520]}
                  stroke={isCentral ? "black" : "#ddd"}
                  strokeWidth={isCentral ? 2 : 1}
                />
                <Line
                  key={`h${i}`}
                  points={[0, pos, 520, pos]}
                  stroke={isCentral ? "black" : "#ddd"}
                  strokeWidth={isCentral ? 2 : 1}
                />
              </>
            );
          })}

          {/* Labels des axes */}
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

          {/* Boules A, B, C */}
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

          {/* Instructions avec couleurs correspondantes */}
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
