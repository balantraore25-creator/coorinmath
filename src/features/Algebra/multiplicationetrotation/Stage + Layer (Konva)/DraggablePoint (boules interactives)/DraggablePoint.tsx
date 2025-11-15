import React from "react";
import { Circle, Line, Arc, Text as KonvaText, Group } from "react-konva";
import { motion } from "framer-motion";
import { MultiHalo } from "./../../../moduleetargument/MultiHalo";

type Point = { x: number; y: number };

type DraggablePointProps = {
  p: Point;
  idx: number;
  color: string;
  placed: boolean;
  onPlace: (idx: number) => void;
  onSelect: (idx: number) => void;
  selectedIdx: number | null;
  vectorProgress: number;
  arcProgress: number;
  currentStep: number;
  unit: number;
  center: number;
  size: number;
};

export const DraggablePoint: React.FC<DraggablePointProps> = ({
  p, idx, color, placed, onPlace, onSelect,
  selectedIdx, vectorProgress, arcProgress, currentStep,
  unit, center, size
}) => {
  const startX = 80 + idx * 80;
  const startY = size + 80;
  const targetX = center + p.x * unit;
  const targetY = center - p.y * unit;

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.2 }}>
        <Group>
          <Circle
            x={startX}
            y={startY}
            radius={12}
            fill={color}
            draggable
            onDragEnd={(e) => {
              const node = e.target;
              const nearTarget = Math.abs(node.x() - targetX) < 20 && Math.abs(node.y() - targetY) < 20;
              if (nearTarget) {
                onPlace(idx);
                node.position({ x: targetX, y: targetY });
              } else {
                node.position({ x: startX, y: startY });
              }
            }}
            onClick={() => onSelect(idx)}
          />
        </Group>
      </motion.div>

      {placed && selectedIdx === idx && (
        <>
          {currentStep >= 0 && (
            <Line
              points={[center, center, center + (targetX - center) * vectorProgress, center + (targetY - center) * vectorProgress]}
              stroke={color}
              strokeWidth={2}
            />
          )}
          {currentStep >= 2 && (
            <Arc x={center} y={center} innerRadius={20} outerRadius={25} angle={arcProgress} stroke={color} strokeWidth={2} />
          )}
          {currentStep >= 3 && (
            <>
              <MultiHalo x={targetX} y={targetY} color={color} count={3} minRadius={12} maxRadius={28} speed={0.8} visible />
              <KonvaText text={`Bravo ! Tu as bien placé z·i^${idx}`} x={center - 120} y={size - 24} fontSize={16} fontStyle="bold" fill={color} />
            </>
          )}
        </>
      )}
    </>
  );
};
