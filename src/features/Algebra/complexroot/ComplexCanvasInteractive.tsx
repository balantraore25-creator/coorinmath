"use client";

import React, { useState } from "react";
import { Stage, Layer, Line, Circle, Arc, Text as KonvaText } from "react-konva";
import { Box, Text, VStack, Button } from "@chakra-ui/react";
import { MultiHalo } from "./MultiHalo";
import { useAngle } from "./hooks/useAngle";
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
  };

  return (
    <Box display="flex" gap={6}>
      {/* Canevas */}
      <Box flex="1">
        <Stage width={safeW} height={safeH} style={{ backgroundColor: "#fff" }}>
          <Layer>
            {/* ✅ Légende affichant w */}
            <KonvaText
              text={`w = ${w.x} + i${w.y}`}
              x={10}
              y={10}
              fontSize={16}
              fill="blue"
              fontStyle="bold"
            />

            {/* ✅ Formules dynamiques affichées si showFormulas = true */}
            {showFormulas &&
              powers.map((p, idx) => {
                if (idx > currentStep) return null;
                const product = multiplyComplex(z, p);
                return (
                  <KonvaText
                    key={idx}
                    text={`z · w^${idx + 1} = ${product.x} + i${product.y}`}
                    x={10}
                    y={40 + idx * 20}
                    fontSize={14}
                    fill="purple"
                    fontStyle="bold"
                  />
                );
              })}

            {/* Grille + axes */}
            {[...Array(17)].map((_, i) => {
              const pos = i * unit;
              return (
                <React.Fragment key={i}>
                  <Line points={[pos, 0, pos, safeH]} stroke="#ddd" strokeWidth={1} />
                  <Line points={[0, pos, safeW, pos]} stroke="#ddd" strokeWidth={1} />
                </React.Fragment>
              );
            })}
            <Line points={[0, center, safeW, center]} stroke="black" strokeWidth={2} />
            <Line points={[center, 0, center, safeH]} stroke="black" strokeWidth={2} />

            {/* Boule de z */}
            <Circle x={center + z.x * unit} y={center - z.y * unit} radius={10} fill="red" />
            <MultiHalo x={center + z.x * unit} y={center - z.y * unit} color="red" count={3} minRadius={12} maxRadius={28} speed={0.8} visible />

            {/* Boules des produits z·w^n */}
            {powers.map((p, idx) => {
              if (idx > currentStep) return null;
              const product = multiplyComplex(z, p);
              const px = center + product.x * unit;
              const py = center - product.y * unit;

              const { angleDeg } = useAngle(product);

              const studentPos = studentPositions[idx];
              const isCorrect = studentPos && studentPos.x === product.x && studentPos.y === product.y;
              const isError = errorIndex === idx;

              return (
                <React.Fragment key={idx}>
                  <Circle
                    x={studentPos ? center + studentPos.x * unit : 80}
                    y={studentPos ? center - studentPos.y * unit : safeH - 50 - idx * 40}
                    radius={10}
                    fill={isCorrect ? "green" : "blue"}
                    draggable
                    onDragEnd={(e) => handleDragEnd(idx, e)}
                  />
                  {isError && (
                    <MultiHalo
                      x={studentPos ? center + studentPos.x * unit : 80}
                      y={studentPos ? center - studentPos.y * unit : safeH - 50 - idx * 40}
                      color="red"
                      count={2}
                      minRadius={15}
                      maxRadius={30}
                      speed={1.2}
                      visible
                    />
                  )}
                  <KonvaText
                    text={
                      isCorrect
                        ? "✅ Correct !"
                        : studentPos
                        ? "❌ Mauvais endroit, réessayez"
                        : "Déplacez la boule ici"
                    }
                    x={px + 15}
                    y={py + 15}
                    fontSize={12}
                    fill={isCorrect ? "green" : "red"}
                  />
                  {isCorrect && (
                    <>
                      <Line points={[center + z.x * unit, center - z.y * unit, px, py]} stroke="orange" strokeWidth={2} />
                      <Arc x={center} y={center} innerRadius={40} outerRadius={45} angle={angleDeg} rotation={0} stroke="orange" strokeWidth={2} opacity={0.7} />
                      <KonvaText text={rotationMessage(angleDeg)} x={px + 15} y={py - 15} fontSize={12} fill="orange" />
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </Layer>
        </Stage>

        {/* ✅ Bouton pour masquer/afficher les formules */}
        <Button mt={2} colorScheme="purple" onClick={() => setShowFormulas(!showFormulas)}>
          {showFormulas ? "Masquer les formules" : "Afficher les formules"}
        </Button>
      </Box>

      {/* Panneau latéral */}
      <Box minW="300px" p={4} bg="gray.50" border="1px solid #ddd" borderRadius="md">
        <Text fontSize="lg" fontWeight="bold" mb={3}>Multiplication complexe</Text>
                <VStack align="start" gap={2}>
          <Text>z = {z.x} + i{z.y}</Text>
          <Text>w = {w.x} + i{w.y}</Text>
          {powers.map((p, idx) => {
            if (idx > currentStep) return null;
            const product = multiplyComplex(z, p);
            const { module, angleDeg } = useAngle(product);

            return (
              <Text key={idx}>
                z·w^{idx + 1} = {product.x} + i{product.y} | Module = {module.toFixed(2)} | Angle = {angleDeg.toFixed(2)}° → {rotationMessage(angleDeg)}
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
