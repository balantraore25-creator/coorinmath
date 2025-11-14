import React, { useEffect, useState } from "react";
import { Circle } from "react-konva";

interface HaloProps {
  x: number;
  y: number;
  color?: string;
  minRadius?: number;
  maxRadius?: number;
  speed?: number;
  visible?: boolean;
}

export const Halo: React.FC<HaloProps> = ({
  x,
  y,
  color = "dodgerblue",
  minRadius = 12,
  maxRadius = 28,
  speed = 0.8,
  visible = true,
}) => {
  const [radius, setRadius] = useState(minRadius);
  const [growing, setGrowing] = useState(true);

  useEffect(() => {
    if (!visible) return;
    let frameId: number;

    const animate = () => {
      setRadius((prev) => {
        if (growing && prev < maxRadius) return prev + speed;
        if (!growing && prev > minRadius) return prev - speed;
        setGrowing(!growing);
        return prev;
      });
      frameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frameId);
  }, [visible, growing, maxRadius, minRadius, speed]);

  if (!visible) return null;

  return (
    <Circle
      x={x}
      y={y}
      radius={radius}
      stroke={color}
      strokeWidth={2}
      opacity={0.4}
    />
  );
};
