import React from "react";
import type { Point } from "../types";

interface ComplexPlacementProps {
  points: { A: Point; B: Point; C: Point };
}

export const ComplexPlacement: React.FC<ComplexPlacementProps> = ({ points }) => {
  return (
    <div>
      {Object.entries(points).map(([label, { x, y }]) => (
        <div key={label}>
          {label} = ({x}, {y})
        </div>
      ))}
    </div>
  );
};
