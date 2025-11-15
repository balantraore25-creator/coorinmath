import React from "react";
import { Text as KonvaText } from "react-konva";

type AxisLabelsProps = {
  size: number;
  center: number;
};

export const AxisLabels: React.FC<AxisLabelsProps> = ({ size, center }) => (
  <>
    <KonvaText text="Réel" x={size - 40} y={center - 20} fontSize={14} fontStyle="bold" />
    <KonvaText text="Imaginaire pur" x={center + 10} y={10} fontSize={14} rotation={90} />
  </>
);
