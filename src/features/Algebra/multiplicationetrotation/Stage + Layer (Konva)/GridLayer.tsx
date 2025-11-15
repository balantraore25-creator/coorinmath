import React from "react";
import { Line } from "react-konva";

type GridLayerProps = {
  size: number;
  unit: number;
  center: number;
};

export const GridLayer: React.FC<GridLayerProps> = ({ size, unit, center }) => (
  <>
    {Array.from({ length: Math.floor(size / unit) + 1 }).map((_, i) => (
      <React.Fragment key={i}>
        {/* Lignes verticales */}
        <Line points={[i * unit, 0, i * unit, size]} stroke="#ddd" strokeWidth={1} />
        {/* Lignes horizontales */}
        <Line points={[0, i * unit, size, i * unit]} stroke="#ddd" strokeWidth={1} />
      </React.Fragment>
    ))}
    {/* Axes */}
    <Line points={[0, center, size, center]} stroke="black" strokeWidth={2} />
    <Line points={[center, 0, center, size]} stroke="black" strokeWidth={2} />
  </>
);
