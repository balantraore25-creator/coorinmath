import React, { useState } from "react";
import { Stage, Layer, Line, Text, Circle } from "react-konva";
import { Box, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import type Konva from "konva";

export type Point = { x: number; y: number };

const MotionCircle = motion(Circle);

interface Props {
  points: { A: Point; B: Point; C: Point };
}

export const ComplexCanvas: React.FC<Props> = ({ points }) => {
  const [studentPoints, setStudentPoints] = useState<{ [key: string]: Point }>({});

  // Typage explicite
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, label: string) => {
    const node = e.target;
    const newX = Math.round((node.x() - 250) / 40);
    const newY = Math.round(-(node.y() - 250) / 40);
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
      <Stage width={500} height={500}>
        <Layer>
          {/* Axes */}
          <Line points={[0, 250, 500, 250]} stroke="black" />
          <Line points={[250, 0, 250, 500]} stroke="black" />

          {/* Grille + graduations */}
          {[...Array(11)].map((_, i) => {
            const x = i * 40;
            return (
              <>
                <Line key={`v${i}`} points={[x, 0, x, 500]} stroke="#ddd" />
                <Text key={`vx${i}`} text={`${i - 6}`} x={x} y={255} fontSize={12} fill="black" />
              </>
            );
          })}
          {[...Array(11)].map((_, i) => {
            const y = i * 40;
            return (
              <>
                <Line key={`h${i}`} points={[0, y, 500, y]} stroke="#ddd" />
                <Text key={`vy${i}`} text={`${6 - i}`} x={255} y={y} fontSize={12} fill="black" />
              </>
            );
          })}

          {/* Points A, B, C avec animation */}
          {(["A", "B", "C"] as const).map((label, idx) => {
            const color = ["red", "blue", "green"][idx];
            const student = studentPoints[label];
            const x = student ? 250 + student.x * 40 : 250;
            const y = student ? 250 - student.y * 40 : 250;

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

          {/* Instructions avec couleurs correspondantes */}
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
