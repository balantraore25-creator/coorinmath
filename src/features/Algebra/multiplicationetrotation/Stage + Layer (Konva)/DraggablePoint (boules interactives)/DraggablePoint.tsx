import React, { useState, useEffect } from "react";
import { Circle, Arc, Text } from "react-konva";
import {
  Input,
  Button,
  HStack,
  DrawerRoot,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@chakra-ui/react";
import { ScaleFade } from "@chakra-ui/transition";

type Point = { x: number; y: number };

export interface DraggablePointProps {
  p: Point;
  idx: number;
  color: string;
  placed: boolean;
  onPlace: (i: number) => void;
  onSelect: (i: number) => void;
  selectedIdx: number | null;
  vectorProgress: number;
  arcProgress: number;
  currentStep: number;
  unit: number;
  center: number;
  size: number;
  onDragMove?: (newPoint: Point) => void;
}

export const DraggablePoint: React.FC<DraggablePointProps> = ({
  p,
  idx,
  color,
  placed,
  onPlace,
  onSelect,
  selectedIdx,
  vectorProgress,
  arcProgress,
  currentStep,
  unit,
  center,
  size,
  onDragMove,
}) => {
  const [editing, setEditing] = useState(false);
  const [tempCoord, setTempCoord] = useState<Point>(p);
  const [justValidated, setJustValidated] = useState(false);
  const [animatedText, setAnimatedText] = useState("");

  const x = center + p.x * unit;
  const y = center - p.y * unit;

  const pulseOpacity =
    selectedIdx === idx ? 0.6 + 0.4 * Math.sin(Date.now() / 300) : 1;

  const colorPhase = (Math.sin(Date.now() / 500) + 1) / 2;
  const dynamicColor = `rgba(${Math.round(0 + 255 * colorPhase)}, 255, 0, 1)`;

  const rainbowColors = ["red","orange","yellow","green","blue","indigo","violet"];
  const rainbowSpeed = 200 / Math.max(vectorProgress, 0.1);
  const rainbowIndex = Math.floor((Date.now() / rainbowSpeed) % rainbowColors.length);
  const rainbowColor = rainbowColors[rainbowIndex];

  const pulsatingRadius = size + Math.sin(Date.now() / 300) * (arcProgress / 30);
  const labelScale = 1 + 0.1 * Math.sin(Date.now() / 400);

  useEffect(() => {
    if (!editing && selectedIdx === idx) {
      const fullText = `(${p.x.toFixed(1)}, ${p.y.toFixed(1)})`;
      let i = 0;
      setAnimatedText("");
      const interval = setInterval(() => {
        setAnimatedText(fullText.slice(0, i + 1));
        i++;
        if (i >= fullText.length) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [editing, p.x, p.y, selectedIdx, idx]);

  return (
    <>
      {selectedIdx === idx && (
        <Circle
          x={x}
          y={y}
          radius={14 + vectorProgress * 12}
          stroke={rainbowColor}
          strokeWidth={3}
          opacity={0.4}
        />
      )}

      {selectedIdx === idx && arcProgress > 0 && (
        <Arc
          x={center}
          y={center}
          innerRadius={unit * 0.8}
          outerRadius={unit * 0.9}
          angle={arcProgress}
          rotation={0}
          stroke={color}
          strokeWidth={2}
          opacity={0.5}
        />
      )}

      <Circle
        x={x}
        y={y}
        radius={pulsatingRadius}
        fill={placed ? dynamicColor : "lightgray"}
        draggable
        stroke={selectedIdx === idx ? "black" : undefined}
        strokeWidth={selectedIdx === idx ? 2 : 0}
        opacity={pulseOpacity}
        onClick={() => onSelect(idx)}
        onDragEnd={(e) => {
          const newPoint: Point = {
            x: (e.target.x() - center) / unit,
            y: -(e.target.y() - center) / unit,
          };
          if (onDragMove) {
            onDragMove(newPoint);
          }
          onPlace(idx);
          onSelect(idx);
        }}
      />

      {selectedIdx === idx && currentStep > 0 && (
        <Circle
          x={x}
          y={y}
          radius={8 + currentStep * 2}
          stroke={color}
          strokeWidth={1}
          opacity={0.2}
        />
      )}

      {selectedIdx === idx && (
        <>
          <ScaleFade in={!editing} initialScale={0.8}>
            <Text
              x={x + 12}
              y={y - 20}
              text={animatedText}
              fontSize={14}
              fill={color}
              scaleX={labelScale}
              scaleY={labelScale}
              opacity={0.9}
              onClick={() => {
                setEditing(true);
                setTempCoord(p);
              }}
            />
            {justValidated && (
              <Circle
                x={x + 60}
                y={y - 15}
                radius={40}
                stroke={dynamicColor}
                strokeWidth={2}
                opacity={0.4}
              />
            )}
          </ScaleFade>

          {/* DrawerRoot Chakra UI v3 */}
          <DrawerRoot open={editing} onOpenChange={() => setEditing(false)}>
            <DrawerContent>
              <DrawerHeader>Modifier les coordonnées</DrawerHeader>
              <DrawerBody>
                <HStack gap={2} wrap="wrap">
                  <Input
                    size="sm"
                    width="70px"
                    value={tempCoord.x}
                    onChange={(e) =>
                      setTempCoord({ ...tempCoord, x: Number(e.target.value) })
                    }
                  />
                  <Input
                    size="sm"
                    width="70px"
                    value={tempCoord.y}
                    onChange={(e) =>
                      setTempCoord({ ...tempCoord, y: Number(e.target.value) })
                    }
                  />
                </HStack>
              </DrawerBody>
              <DrawerFooter>
                <Button
                  size="sm"
                  colorScheme="green"
                  mr={2}
                  onClick={() => {
                    setEditing(false);
                    setJustValidated(true);
                    if (onDragMove) onDragMove(tempCoord);
                    setTimeout(() => setJustValidated(false), 800);
                  }}
                >
                  OK
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditing(false)}
                >
                  Annuler
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </DrawerRoot>
        </>
      )}
    </>
  );
};
