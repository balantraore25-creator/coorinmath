import { useMemo } from "react";
import type { Point } from "./../../types";

interface AngleResult {
  module: number;
  angleRad: number;
  angleDeg: number;
  cosTheta: number;
  sinTheta: number;
}

export function useAngle(point: Point): AngleResult {
  return useMemo(() => {
    const { x, y } = point;
    const module = Math.sqrt(x * x + y * y);
    const angleRad = Math.atan2(y, x);
    const angleDeg = (angleRad * 180) / Math.PI;
    const cosTheta = module !== 0 ? x / module : 1;
    const sinTheta = module !== 0 ? y / module : 0;

    return { module, angleRad, angleDeg, cosTheta, sinTheta };
  }, [point.x, point.y]);
}
