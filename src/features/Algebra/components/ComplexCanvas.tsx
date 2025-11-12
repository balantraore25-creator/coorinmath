import React, { useState } from "react";
import { Stage, Layer, Line, Text, Circle } from "react-konva";
import { Box, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import type Konva from "konva";

export type Point = { x: number; y: number };

const MotionCircle = motion(Circle);
const MotionText = motion(Text);
const MotionLine = motion(Line);

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
      {/* Stage dimension : -6 à +6 → 13 cases × 40px = 520px */}
      <Stage width={520} height={520}>
        <Layer>
          {/* Axes */}
          <MotionLine
            points={[0, 260, 520, 260]}
            stroke="black"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          />
          <MotionLine
            points={[260, 0, 260, 520]}
            stroke="black"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          />

          {/* Grille + graduations animées */}
          {[...Array(13)].map((_, i) => {
            const x = i * 40;
            const value = i - 6;
            return (
              <>
                <MotionLine
                  key={`v${i}`}
                  points={[x, 0, x, 520]}
                  stroke="#ddd"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                />
                <MotionText
                  key={`vx${i}`}
                  text={`${value}`}
                  x={x}
                  y={265}
                  fontSize={12}
                  fill="black"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                />
              </>
            );
          })}
          {[...Array(13)].map((_, i) => {
            const y = i * 40;
            const value = 6 - i;
            return (
              <>
                <MotionLine
                  key={`h${i}`}
                  points={[0, y, 520, y]}
                  stroke="#ddd"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                />
                <MotionText
                  key={`vy${i}`}
                  text={`${value}`}
                  x={265}
                  y={y}
                  fontSize={12}
                  fill="black"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                />
              </>
            );
          })}

          {/* Boules A, B, C visibles dès le départ */}
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
