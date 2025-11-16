import React from "react";
import { Line, Rect, Text } from "react-konva";

type GridLayerProps = {
  size: number;
  unit: number;
  center: number;
};

export const GridLayer: React.FC<GridLayerProps> = ({ size, unit, center }) => {
  const steps = Math.floor(size / unit);

  return (
    <>
      {Array.from({ length: steps + 1 }).map((_, i) => {
        const pos = i * unit;
        const isMajor = i % 5 === 0; // toutes les 5 lignes = majeures

        return (
          <React.Fragment key={i}>
            {/* Lignes verticales */}
            <Line
              points={[pos, 0, pos, size]}
              stroke={isMajor ? "#000" : "#ccc"}
              strokeWidth={isMajor ? 2 : 1}
            />
            {/* Lignes horizontales */}
            <Line
              points={[0, pos, size, pos]}
              stroke={isMajor ? "#000" : "#ccc"}
              strokeWidth={isMajor ? 2 : 1}
            />
          </React.Fragment>
        );
      })}

      {/* Axes principaux */}
      <Line points={[0, center, size, center]} stroke="red" strokeWidth={2} />
      <Line points={[center, 0, center, size]} stroke="blue" strokeWidth={2} />

      {/* Labels du centre */}
      <Rect x={center - 10} y={center - 10} width={20} height={18} fill="white" />
      <Text x={center - 6} y={center - 8} text="0" fontSize={12} fill="black" />
    </>
  );
};
