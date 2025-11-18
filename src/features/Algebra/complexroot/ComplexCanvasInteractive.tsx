"use client";

import React, { useState, useEffect } from "react";
import { Stage, Layer, Line, Circle, Arc, Text as KonvaText } from "react-konva";
import { Box, Text, VStack, Button } from "@chakra-ui/react";
import { MultiHalo } from "./MultiHalo";
import type { Point } from "../types";

// --- Fonctions utilitaires ---
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

function computeAngleOZW(z: Point, w: Point): number {
  const v1 = { x: -z.x, y: -z.y }; // ZO
  const v2 = { x: w.x - z.x, y: w.y - z.y }; // ZW

  const dot = v1.x * v2.x + v1.y * v2.y;
  const norm1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const norm2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

  if (norm1 === 0 || norm2 === 0) return 0;
  return (Math.acos(dot / (norm1 * norm2)) * 180) / Math.PI;
}

// Transition de couleur progressive
function interpolateColor(angle: number, progress: number): string {
  const startColor = { r: 0, g: 255, b: 0 }; // vert
  const midColor = { r: 255, g: 165, b: 0 }; // orange
  const endColor = { r: 255, g: 0, b: 0 };   // rouge

  let targetColor = startColor;
  if (angle < 90) targetColor = startColor;
  else if (angle < 150) targetColor = midColor;
  else targetColor = endColor;

  const r = Math.round(startColor.r + (targetColor.r - startColor.r) * progress);
  const g = Math.round(startColor.g + (targetColor.g - startColor.g) * progress);
  const b = Math.round(startColor.b + (targetColor.b - startColor.b) * progress);

  return `rgb(${r},${g},${b})`;
}

interface ComplexCanvasInteractiveProps {
  z: Point;
  w: Point;
}

export const ComplexCanvasInteractive: React.FC<ComplexCanvasInteractiveProps> = ({ z, w }) => {
  const [studentPositions, setStudentPositions] = useState<Point[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [errorIndex, setErrorIndex] = useState<number | null>(null);
  const [showFormulas, setShowFormulas] = useState<boolean>(true);

  // Animation progressive de l’arc
  const [arcProgress, setArcProgress] = useState<number>(0);
  useEffect(() => {
    if (arcProgress < 1) {
      const timer = setInterval(() => {
        setArcProgress((prev) => Math.min(prev + 0.05, 1));
      }, 50);
      return () => clearInterval(timer);
    }
  }, [arcProgress]);

  const safeW = 500;
  const safeH = 500;
  const unit = safeW / 17;
  const center = safeW / 2;

  const powers = computePowers(w, 4);

  const handleDragEnd = (idx: number, e: any) => {
    const newX = Math.round((e.target.x() - center) / unit);
    const newY = Math.round(-(e.target.y() - center) / unit);
    const newPositions = [...studentPositions];
    newPositions[idx] = { x: newX, y: newY };
    setStudentPositions(newPositions);

    const product = multiplyComplex(z, powers[idx]);
    if (newX === product.x && newY === product.y) {
      setScore((prev) => prev + 1);
      setCurrentStep((prev) => Math.max(prev, idx + 1));
      setErrorIndex(null);
      setArcProgress(0); // relance l’animation
    } else {
      setErrorIndex(idx);
      setTimeout(() => setErrorIndex(null), 1000);
    }
  };

  const handleReplay = () => {
    setStudentPositions([]);
    setCurrentStep(0);
    setScore(0);
    setErrorIndex(null);
    setArcProgress(0);
  };

  return (
    <Box display="flex" gap={6}>
      <Box flex="1">
        <Stage width={safeW} height={safeH} style={{ backgroundColor: "#fff" }}>
          <Layer>
            <Circle x={center + z.x * unit} y={center - z.y * unit} radius={10} fill="red" />
            <MultiHalo x={center + z.x * unit} y={center - z.y * unit} color="red" count={3} minRadius={12} maxRadius={28} speed={0.8} visible />

            {powers.map((p, idx) => {
              if (idx > currentStep) return null;
              const product = multiplyComplex(z, p);
              const px = center + product.x * unit;
              const py = center - product.y * unit;

              const studentPos = studentPositions[idx];
              const isCorrect = studentPos && studentPos.x === product.x && studentPos.y === product.y;
              const isError = errorIndex === idx;

              return (
                <React.Fragment key={idx}>
                  <Circle
                    x={studentPos ? center + studentPos.x * unit : 80}
                    y={studentPos ? center - studentPos.y * unit : safeH - 50 - idx * 40}
                    radius={10}
                    fill={isError ? "red" : isCorrect ? "green" : "blue"}
                    draggable
                    onDragEnd={(e) => handleDragEnd(idx, e)}
                  />

                  {isCorrect && (
                    <>
                      <Line points={[center + z.x * unit, center - z.y * unit, center, center]} stroke="orange" strokeWidth={2} />
                      <Line points={[center + z.x * unit, center - z.y * unit, px, py]} stroke="orange" strokeWidth={2} />

                      {(() => {
                        const angleOZW = computeAngleOZW(z, product);
                        const angleZO = (Math.atan2(-z.y, -z.x) * 180) / Math.PI;
                        const arcColor = interpolateColor(angleOZW, arcProgress);

                        // Rayon animé : grandit avec arcProgress
                        const innerR = 15 + 10 * arcProgress;
                        const outerR = 20 + 15 * arcProgress;

                        return (
                          <>
                            <Arc
                              x={center + z.x * unit}
                              y={center - z.y * unit}
                              innerRadius={innerR}
                              outerRadius={outerR}
                              angle={angleOZW * arcProgress}
                              rotation={angleZO}
                              stroke={arcColor}
                              strokeWidth={3}
                              opacity={0.8}
                            />
                            <KonvaText
                              text={`∠OZW = ${angleOZW.toFixed(2)}°`}
                              x={center + z.x * unit + 15}
                              y={center - z.y * unit - 15}
                              fontSize={12}
                              fill={arcColor}
                            />
                          </>
                        );
                      })()}
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </Layer>
        </Stage>

        <Button mt={2} colorScheme="purple" onClick={() => setShowFormulas(!showFormulas)}>
          {showFormulas ? "Masquer les formules" : "Afficher les formules"}
        </Button>
      </Box>

      <Box minW="300px" p={4} bg="gray.50" border="1px solid #ddd" borderRadius="md">
        <Text fontSize="lg" fontWeight="bold" mb={3}>Multiplication complexe</Text>
        <VStack align="start" gap={2}>
          <Text>z = {z.x} + i{z.y}</Text>
          <Text>w = {w.x} + i{w.y}</Text>
          {powers.map((p, idx) => {
            if (idx > currentStep) return null;
            const product = multiplyComplex(z, p);
            const angleOZW = computeAngleOZW(z, product);

            return (
              <Text key={idx}>
                                z·w^{idx + 1} = {product.x} + i{product.y} | ∠OZW = {angleOZW.toFixed(2)}°
              </Text>
            );
          })}
        </VStack>

        {currentStep === powers.length && (
          <Box mt={4} p={2} bg="green.100" borderRadius="md">
            <Text fontWeight="bold">
              Score final : {score}/{powers.length} boules placées correctement 🎉
            </Text>
            <Button mt={2} colorScheme="blue" onClick={handleReplay}>
              🔄 Rejouer
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
