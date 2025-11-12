import React, { useState } from "react";
import { Stage, Layer, Line, Circle } from "react-konva";
import { Box, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import type Konva from "konva";
import { Text as KonvaText } from "react-konva";

export type Point = { x: number; y: number };

const MotionLine = motion(Line);
const MotionText = motion(KonvaText);
const MotionCircle = motion(Circle);

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
          {/* Grille animée */}
          {[...Array(13)].map((_, i) => {
            const pos = i * 40;
            return (
              <>
                <MotionLine
                  key={`v${i}`}
                  points={[pos, 0, pos, 520]}
                  stroke="#ddd"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                />
                <MotionLine
                  key={`h${i}`}
                  points={[0, pos, 520, pos]}
                  stroke="#ddd"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                />
              </>
            );
          })}

          {/* Axes animés */}
          <MotionLine
            points={[0, 260, 520, 260]}
            stroke="black"
            strokeWidth={2}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          />
          <MotionLine
            points={[260, 0, 260, 520]}
            stroke="black"
            strokeWidth={2}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          />

          {/* Labels des axes */}
          <MotionText
            text="Re(z)"
            x={480}
            y={245}
            fontSize={16}
            fontStyle="bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
          <MotionText
            text="Im(z)"
            x={270}
            y={20}
            fontSize={16}
            fontStyle="bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />

          {/* Graduations horizontales */}
          {[...Array(13)].map((_, i) => {
            const x = i * 40;
            const value = i - 6;
            return (
              <MotionText
                key={`vx${i}`}
                text={`${value}`}
                x={x}
                y={275}
                fontSize={12}
                fill="black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              />
            );
          })}

          {/* Graduations verticales */}
          {[...Array(13)].map((_, i) => {
            const y = i * 40;
            const value = 6 - i;
            return (
              <MotionText
                key={`vy${i}`}
                text={`${value}`}
                x={270}
                y={y}
                fontSize={12}
                fill="black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              />
            );
          })}

          {/* Boules A, B, C animées et draggables */}
          {(["A", "B", "C"] as const).map((label, idx) => {
            const color = ["red", "blue", "green"][idx];
            const student = studentPoints[label] ?? points[label];
            const x = 260 + student.x * 40;
            const y = 260 - student.y * 40;

            return (
              <MotionCircle
                key={label}
                x={x}
                y={y}
                radius={10}
                fill={color}
                draggable
                onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => handleDragEnd(e, label)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
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
