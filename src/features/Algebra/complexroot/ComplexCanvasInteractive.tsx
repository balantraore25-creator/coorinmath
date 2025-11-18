"use client";

import React, { useState, useEffect } from "react";
import { Stage, Layer, Line, Circle, Arc, Text as KonvaText } from "react-konva";
import { Box, Text, VStack, Button } from "@chakra-ui/react";
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

function computeAngleZOW(z: Point, w: Point): number {
  const v1 = { x: z.x, y: z.y };
  const v2 = { x: w.x, y: w.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const norm1 = Math.sqrt(v1.x*v1.x + v1.y*v1.y);
  const norm2 = Math.sqrt(v2.x*v2.x + v2.y*v2.y);
  if (norm1 === 0 || norm2 === 0) return 0;
  return (Math.acos(dot / (norm1*norm2)) * 180) / Math.PI;
}

export const ComplexCanvasInteractive: React.FC<{z: Point; w: Point}> = ({ z, w }) => {
  // Responsive dimensions
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const safeW = Math.min(dimensions.width * 0.9, 500);
  const safeH = Math.min(dimensions.height * 0.6, 500);
  const unit = safeW / 17;
  const center = safeW / 2;

  const powers = computePowers(w, 4);

  const [currentStep, setCurrentStep] = useState(0);
  const [animatedPoint, setAnimatedPoint] = useState<Point>(z);
  const [arcProgress, setArcProgress] = useState(0);

  // Animation cumulative
  useEffect(() => {
    if (currentStep === 0) return;

    const start = currentStep === 1 ? z : multiplyComplex(z, powers[currentStep-2]);
    const target = multiplyComplex(z, powers[currentStep-1]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.05;
      if (progress >= 1) {
        progress = 1;
        clearInterval(interval);
      }
      setAnimatedPoint({
        x: start.x + (target.x - start.x) * progress,
        y: start.y + (target.y - start.y) * progress,
      });
      setArcProgress(progress);
    }, 50);

    return () => clearInterval(interval);
  }, [currentStep]);

  return (
    <Box display="flex" flexDirection={{ base: "column", md: "row" }} gap={6}>
      <Box flex="1">
        <Stage width={safeW} height={safeH} style={{ backgroundColor: "#fff" }}>
          <Layer>
            {/* Grille */}
            {[...Array(17)].map((_, i) => {
              const pos = i * unit;
              return (
                <React.Fragment key={i}>
                  <Line points={[pos, 0, pos, safeH]} stroke="#ccc" strokeWidth={1} opacity={0.4} />
                  <Line points={[0, pos, safeW, pos]} stroke="#ccc" strokeWidth={1} opacity={0.4} />
                </React.Fragment>
              );
            })}

            {/* Axes */}
            <Line points={[0, center, safeW, center]} stroke="black" strokeWidth={2} />
            <Line points={[center, 0, center, safeH]} stroke="black" strokeWidth={2} />

            {/* Boule de z */}
            <Circle x={center + z.x*unit} y={center - z.y*unit} radius={10} fill="red" />

            {/* Boule animée */}
            <Circle x={center + animatedPoint.x*unit} y={center - animatedPoint.y*unit} radius={10} fill="green" />

            {/* Traits depuis O */}
            <Line points={[center, center, center + z.x*unit, center - z.y*unit]} stroke="green" />
            <Line points={[center, center, center + animatedPoint.x*unit, center - animatedPoint.y*unit]} stroke="orange" />

            {/* Trajectoire circulaire temporaire */}
            {currentStep > 0 && (
              <Arc
                x={center}
                y={center}
                innerRadius={Math.sqrt(animatedPoint.x**2 + animatedPoint.y**2) * unit - 5}
                outerRadius={Math.sqrt(animatedPoint.x**2 + animatedPoint.y**2) * unit + 5}
                angle={computeAngleZOW(z, animatedPoint) * arcProgress}
                rotation={0}
                stroke="rgba(0,0,255,0.5)"
                strokeWidth={2}
                dash={[6, 4]}
              />
            )}

            {/* Arc dynamique */}
            {currentStep > 0 && (
              <>
                <Arc
                  x={center}
                  y={center}
                  innerRadius={20}
                  outerRadius={30}
                  angle={computeAngleZOW(z, animatedPoint) * arcProgress}
                  rotation={0}
                  stroke="blue"
                  strokeWidth={2}
                />
                <KonvaText
                  text={`∠ZOW^${currentStep} = ${computeAngleZOW(z, animatedPoint).toFixed(2)}°`}
                  x={center+20}
                  y={center-20}
                  fontSize={12}
                  fill="blue"
                />
              </>
            )}
          </Layer>
        </Stage>

        <Button mt={2} colorScheme="purple" onClick={() => setCurrentStep((prev) => Math.min(prev+1, powers.length))}>
          Étape suivante
        </Button>
      </Box>

      {/* Panneau latéral */}
      <Box minW={{ base: "100%", md: "300px" }} p={4} bg="gray.50" border="1px solid #ddd" borderRadius="md">
        <Text fontSize="lg" fontWeight="bold" mb={3} color="purple.700">
          Multiplication dynamique
        </Text>
        <VStack align="start" gap={3}>
          <Text fontSize="md" fontWeight="bold" color="purple.600">
            z = {z.x} + i{z.y}
          </Text>
          <Text fontSize="md" fontWeight="bold" color="purple.600">
            w = {w.x} + i{w.y} (|w| = {Math.sqrt(w.x*w.x + w.y*w.y).toFixed(2)}, arg(w) = {(Math.atan2(w.y, w.x)*180/Math.PI).toFixed(2)}°)
          </Text>
          <Text fontSize="md" color="blue.700">
            Étape actuelle : {currentStep}
          </Text>

          {powers.map((p, idx) => {
            if (idx+1 > currentStep) return null;
            const product = multiplyComplex(z, p);
            const angleZOW = computeAngleZOW(z, product);

            return (
              <Box key={idx} p={2} bg="yellow.50" border="1px solid #ddd" borderRadius="md" w="100%">
                <Text fontWeight="semibold" color="blue.700">
                  Étape {idx+1} : z·w^{idx+1}
                </Text>
                <Text>
                  = {product.x} + i{product.y}
                </Text>
                <Text color="green.600">
                  ∠ZOW^{idx+1} = {angleZOW.toFixed(2)}°
                </Text>
              </Box>
            );
          })}
        </VStack>
      </Box>
    </Box>
  );
};
