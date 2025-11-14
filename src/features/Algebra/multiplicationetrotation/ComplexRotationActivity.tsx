import React, { useMemo } from "react";
import { Stage, Layer, Line, Text as KonvaText } from "react-konva";
import { Box, Text } from "@chakra-ui/react";
import { ComplexCanvas } from "./ComplexCanvas";

type Point = { x: number; y: number };

interface TriangleProps {
  points: { A: Point; B: Point; C: Point };
  color?: string;
  unit?: number;
  center?: number;
}

// Composant Triangle correctement typé
const Triangle: React.FC<TriangleProps> = ({ points, color = "#444", unit = 50, center = 250 }) => {
  const toCanvas = (p: Point) => ({ x: center + p.x * unit, y: center - p.y * unit });
  const A = toCanvas(points.A);
  const B = toCanvas(points.B);
  const C = toCanvas(points.C);

  return (
    <>
      <Line
        points={[A.x, A.y, B.x, B.y, C.x, C.y, A.x, A.y]}
        stroke={color}
        strokeWidth={2}
        closed
      />
      <KonvaText text="A" x={A.x + 4} y={A.y - 16} fontSize={12} fill={color} />
      <KonvaText text="B" x={B.x + 4} y={B.y - 16} fontSize={12} fill={color} />
      <KonvaText text="C" x={C.x + 4} y={C.y - 16} fontSize={12} fill={color} />
    </>
  );
};

export const ComplexRotationActivity: React.FC = () => {
  // Exemple: triangle basé sur z et ses rotations
  const z: Point = { x: 2, y: 1 };
  const z_i: Point = useMemo(() => ({ x: -z.y, y: z.x }), [z.x, z.y]);
  const z_i2: Point = useMemo(() => ({ x: -z.x, y: -z.y }), [z.x, z.y]);

  const unit = 50;
  const size = 500;
  const center = size / 2;

  return (
    <Box display="flex" flexDirection="column" gap={6}>
      <Text fontSize="xl" fontWeight="bold">
        Rotation complexe: z et ses puissances de i
      </Text>

      {/* Canvas interactif principal */}
      <ComplexCanvas />

      {/* Démonstration géométrique supplémentaire */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={2}>
          Triangle formé par z, z·i, z·i²
        </Text>
        <Stage width={size} height={size} style={{ backgroundColor: "#fff" }}>
          <Layer>
            {/* Axes */}
            <Line points={[0, center, size, center]} stroke="#000" strokeWidth={2} />
            <Line points={[center, 0, center, size]} stroke="#000" strokeWidth={2} />

            {/* Triangle */}
            <Triangle
              points={{ A: z, B: z_i, C: z_i2 }}
              color="#8A2BE2"
              unit={unit}
              center={center}
            />
          </Layer>
        </Stage>
      </Box>
    </Box>
  );
};
