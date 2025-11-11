import React, { useState } from "react";
import { Stage, Layer, Line, Circle, Text } from "react-konva";
import { Box, Button } from "@chakra-ui/react";

export type Point = { x: number; y: number };

interface Props {
  points: { A: Point; B: Point; C: Point };
}

export const ComplexCanvas: React.FC<Props> = ({ points }) => {
  const [studentPoints, setStudentPoints] = useState<{ [key: string]: Point }>({});

  const handleClick = (e: any, label: string) => {
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    // Conversion : chaque unité = 40px
    const x = Math.round((pointer.x - 200) / 40);
    const y = Math.round(-(pointer.y - 200) / 40);
    setStudentPoints({ ...studentPoints, [label]: { x, y } });
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
      <Stage width={400} height={400}>
        <Layer>
          {/* Axes */}
          <Line points={[0, 200, 400, 200]} stroke="black" />
          <Line points={[200, 0, 200, 400]} stroke="black" />

          {/* Grille */}
          {[...Array(11)].map((_, i) => (
            <Line key={i} points={[i * 40, 0, i * 40, 400]} stroke="#ddd" />
          ))}
          {[...Array(11)].map((_, i) => (
            <Line key={i + "h"} points={[0, i * 40, 400, i * 40]} stroke="#ddd" />
          ))}

          {/* Points cliquables */}
          {["A", "B", "C"].map((label, idx) => (
            <Circle
              key={label}
              x={200}
              y={200}
              radius={10}
              fill={["red", "blue", "green"][idx]}
              onClick={(e) => handleClick(e, label)}
            />
          ))}

          {/* Instructions */}
          <Text text={`A : z = ${points.A.x} + i${points.A.y}`} x={10} y={10} />
          <Text text={`B : z = ${points.B.x} + i${points.B.y}`} x={10} y={30} />
          <Text text={`C : z = ${points.C.x} + i${points.C.y}`} x={10} y={50} />
          <Text text="Clique sur le cercle pour placer le point" x={10} y={70} />
        </Layer>
      </Stage>
      <Button mt={4} colorScheme="blue" onClick={validate}>
        Valider
      </Button>
    </Box>
  );
};
