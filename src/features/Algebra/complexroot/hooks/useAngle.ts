import { useMemo } from "react";

export function useAngle(x: number, y: number) {
  return useMemo(() => {
    const module = Math.sqrt(x * x + y * y);
    const angleRad = Math.atan2(y, x);
    const angleDeg = angleRad * 180 / Math.PI;
    const cosTheta = module !== 0 ? x / module : 1;
    const sinTheta = module !== 0 ? y / module : 0;

    return { module, angleRad, angleDeg, cosTheta, sinTheta };
  }, [x, y]);
}
