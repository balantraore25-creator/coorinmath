"use client";

import React from "react";
import { Stage, Layer, Line, Circle, Arc, Text as KonvaText } from "react-konva";
import { Box, Text, VStack } from "@chakra-ui/react";
import { MultiHalo } from "./MultiHalo";
import { useAngle } from "./hooks/useAngle";
import type { Point } from "../types";

// 🔢 Multiplication de complexes
function multiplyComplex(a: Point, b: Point): Point {
  return { x: a.x * b.x - a.y * b.y, y: a.x * b.y + a.y * b.x };
}

// 🔢 Calcul des puissances de w
function computePowers(w: Point, n: number): Point[] {
  const powers: Point[] = [];
  let current = { ...w };
  for (let i = 1; i <= n; i++) {
    powers.push(current);
    current = multiplyComplex(current, w);
  }
  return powers;
}

// 📐 Message pédagogique
function rotationMessage(angleDeg: number): string {
  const a = Math.round(angleDeg) % 360;
  if (a === 90) return "Rotation de 90°";
  if (a === 180) return "Symétrie centrale (180°)";
  if (a === 270 || a === -90) return "Rotation de 270° ou -90°";
  if (a === 0) return "Retour au point de départ (360°)";
  return `Rotation de ${a}°`;
}

interface ComplexCanvasProps {
  z: Point;
  w: Point;
}

export const ComplexCanvas: React.FC<ComplexCanvasProps> = ({ z, w }) => {
  const safeW = 500;
  const safeH = 500;
  const unit = safeW / 17;
  const center = safeW / 2;

  // 🎲 Puissances de w
  const powers = computePowers(w, 4);

  return (
    <Box display="flex" gap={6}>
      {/* Canevas */}
      <Box flex="1">
        <Stage width={safeW} height={safeH} style={{ backgroundColor: "#fff" }}>
          <Layer>
            {/* Boule de z */}
            <Circle
              x={center + z.x * unit}
              y={center - z.y * unit}
              radius={10}
              fill="red"
            />
            <MultiHalo
              x={center + z.x * unit}
              y={center - z.y * unit}
              color="red"
              count={3}
              minRadius={12}
              maxRadius={28}
              speed={0.8}
              visible
            />

            {/* Boules des produits z·w^n */}
            {powers.map((p, idx) => {
              const product = multiplyComplex(z, p);
              const px = center + product.x * unit;
              const py = center - product.y * unit;
              const { angleDeg } = useAngle(product.x, product.y);

              return (
                <React.Fragment key={idx}>
                  {/* Boule bleue pour z·w^n */}
                  <Circle x={px} y={py} radius={10} fill="blue" />
                  <MultiHalo
                    x={px}
                    y={py}
                    color="blue"
                    count={2}
                    minRadius={10}
                    maxRadius={20}
                    speed={0.6}
                    visible
                  />

                  {/* Flèche entre z et z·w^n */}
                  <Line
                    points={[
                      center + z.x * unit,
                      center - z.y * unit,
                      px,
                      py,
                    ]}
                    stroke="orange"
                    strokeWidth={2}
                  />

                  {/* Arc de rotation */}
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

                  {/* Message pédagogique */}
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

      {/* Panneau latéral */}
      <Box minW="300px" p={4} bg="gray.50" border="1px solid #ddd" borderRadius="md">
        <Text fontSize="lg" fontWeight="bold" mb={3}>
          Multiplication complexe
        </Text>
        <VStack align="start" gap={2}>
          <Text>z = {z.x} + i{z.y}</Text>
          <Text>w = {w.x} + i{w.y}</Text>
          {powers.map((p, idx) => {
            const product = multiplyComplex(z, p);
            const { module, angleDeg } = useAngle(product.x, product.y);
            return (
              <Text key={idx}>
                z·w^{idx + 1} = {product.x} + i{product.y} | Module = {module.toFixed(2)} | Angle = {angleDeg.toFixed(2)}° → {rotationMessage(angleDeg)}
              </Text>
            );
          })}
        </VStack>
      </Box>
    </Box>
  );
};
