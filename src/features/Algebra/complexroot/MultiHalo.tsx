import React, { useEffect, useState } from "react";
import { Circle } from "react-konva";

interface MultiHaloProps {
  x: number;
  y: number;
  color?: string;
  count?: number; // nombre de cercles
  minRadius?: number;
  maxRadius?: number;
  speed?: number;
  visible?: boolean;
}

export const MultiHalo: React.FC<MultiHaloProps> = ({
  x,
  y,
  color = "dodgerblue",
  count = 3,
  minRadius = 12,
  maxRadius = 28,
  speed = 0.8,
  visible = true,
}) => {
  const [radii, setRadii] = useState<number[]>(Array(count).fill(minRadius));
  const [growing, setGrowing] = useState<boolean[]>(Array(count).fill(true));

  useEffect(() => {
    if (!visible) return;
    let frameId: number;

    const animate = () => {
      setRadii((prev) =>
        prev.map((r, i) => {
          const grow = growing[i];
          if (grow && r < maxRadius + i * 5) return r + speed;
          if (!grow && r > minRadius + i * 3) return r - speed;
          setGrowing((g) => {
            const newG = [...g];
            newG[i] = !grow;
            return newG;
          });
          return r;
        })
      );
      frameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frameId);
  }, [visible, growing, maxRadius, minRadius, speed]);

  if (!visible) return null;

  return (
    <>
      {radii.map((radius, i) => (
        <Circle
          key={i}
          x={x}
          y={y}
          radius={radius}
          stroke={color}
          strokeWidth={1.5}
          opacity={0.3 - i * 0.05}
        />
      ))}
    </>
  );
};
