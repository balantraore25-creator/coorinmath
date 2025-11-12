import React from "react";
import type { Point } from "../types";   // ✅ import propre
import { ComplexPlacement } from "./ComplexPlacement";

export const ComplexCoordinates: React.FC = () => {
  const points: { A: Point; B: Point; C: Point } = {
    A: { x: 3, y: -5 },
    B: { x: -2, y: 4 },
    C: { x: 1, y: 2 },
  };

  return <ComplexPlacement />;
};
