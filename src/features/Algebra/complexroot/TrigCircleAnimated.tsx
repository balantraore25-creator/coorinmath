"use client";

import React from "react";
import { Stage, Layer, Circle, Line, Arc, Text as KonvaText } from "react-konva";
import { Box } from "@chakra-ui/react";
import { useAngle } from "./hooks/useAngle"; // ✅ nouvelle version qui prend un Point
import type { Point } from "../types";

function multiplyComplex(a: Point, b: Point): Point {
  return { x: a.x * b.x - a.y * b.y, y: a.x * b.y + a.y * b.x };
}

function computePowers(w: Point, n: number): Point[] {
  const powers: Point[] = [];
  let current = { ...w };
  for (let i = 1; i <= n; i++) {
    powers.push(current);
    current = multiplyComplex(current, w);
  }
  return powers;
}

function rotationMessage(angleDeg: number): string {
  const a = Math.round(angleDeg) % 360;
  if (a === 90) return "Rotation de 90°";
  if (a === 180) return "Symétrie centrale (180°)";
  if (a === 270 || a === -90) return "Rotation de 270° ou -90°";
  if (a === 0) return "Retour au point de départ (360°)";
  return `Rotation de ${a}°`;
}

interface TrigCircleAnimatedProps {
  z: Point;
  w: Point;
}

export const TrigCircleAnimated: React.FC<TrigCircleAnimatedProps> = ({ z, w }) => {
  const safeW = 500;
  const safeH = 500;
  const unit = safeW / 17;
  const center = safeW / 2;

  const powers = computePowers(w, 4);

  return (
    <Box>
      <Stage width={safeW} height={safeH} style={{ backgroundColor: "#fff" }}>
        <Layer>
          {/* Boule de z */}
          <Circle x={center + z.x * unit} y={center - z.y * unit} radius={10} fill="red" />

          {/* Boules des produits z·w^n */}
          {powers.map((p, idx) => {
            const product = multiplyComplex(z, p);
            const px = center + product.x * unit;
            const py = center - product.y * unit;

            // ✅ Nouveau appel avec Point
            const { angleDeg } = useAngle(product);

            return (
              <React.Fragment key={idx}>
                <Circle x={px} y={py} radius={10} fill="blue" />
                <Line
                  points={[center + z.x * unit, center - z.y * unit, px, py]}
                  stroke="orange"
                  strokeWidth={2}
                />
                <Arc
                  x={center}
                  y={center}
                  innerRadius={40}
                  outerRadius={45}
                  angle={angleDeg}
                  rotation={0}
                  stroke="orange"
                  strokeWidth={2}
                  opacity={0.7}
                />
                <KonvaText
                  text={rotationMessage(angleDeg)}
                  x={px + 15}
                  y={py - 15}
                  fontSize={12}
                  fill="orange"
                />
              </React.Fragment>
            );
          })}
        </Layer>
      </Stage>
    </Box>
  );
};
