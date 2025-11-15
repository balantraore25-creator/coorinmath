import React from "react";
import { Line } from "react-konva";

type BaseVectorProps = {
  z: { x: number; y: number };
  unit: number;
  center: number;
};

export const BaseVector: React.FC<BaseVectorProps> = ({ z, unit, center }) => (
  <Line
    points={[
      center,
      center,
      center + z.x * unit,
      center - z.y * unit
    ]}
    stroke="#000"
    strokeWidth={2}
    dash={[6, 4]}
  />
);
