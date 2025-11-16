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
  currentStep: number;   // utilisé pour halo pédagogique
  unit: number;
  center: number;
  size: number;          // utilisé pour limiter le drag
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

  // Rayon pulsant basé sur vectorProgress
  const pulsatingRadius = 6 + vectorProgress * 4;

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

  // Limiter le drag à l'intérieur du canvas
  const dragBoundFunc = (pos: { x: number; y: number }) => {
    const pad = 10;
    return {
      x: Math.min(size - pad, Math.max(pad, pos.x)),
      y: Math.min(size - pad, Math.max(pad, pos.y)),
    };
  };

  return (
    <>
      {/* Halo pédagogique basé sur currentStep */}
      {selectedIdx === idx && currentStep > 0 && (
        <Circle
          x={x}
          y={y}
          radius={pulsatingRadius + currentStep * 2}
          stroke={color}
          strokeWidth={1}
          opacity={0.25}
        />
      )}

      {/* Arc indicatif */}
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

      {/* Boule principale */}
      <Circle
        x={x}
        y={y}
        radius={pulsatingRadius}
        fill={placed ? color : "lightgray"}
        draggable
        dragBoundFunc={dragBoundFunc}
        stroke={selectedIdx === idx ? "black" : undefined}
        strokeWidth={selectedIdx === idx ? 2 : 0}
        onClick={() => onSelect(idx)}
        onDragEnd={(e) => {
          const newPoint: Point = {
            x: (e.target.x() - center) / unit,
            y: -(e.target.y() - center) / unit,
          };
          onDragMove?.(newPoint);
          onPlace(idx);
          onSelect(idx);
        }}
      />

      {/* Label coordonné */}
      {selectedIdx === idx && (
        <>
          <ScaleFade in={!editing} initialScale={0.8}>
            <Text
              x={x + 12}
              y={y - 20}
              text={animatedText}
              fontSize={14}
              fill={color}
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
                radius={24}
                stroke={color}
                strokeWidth={2}
                opacity={0.4}
              />
            )}
          </ScaleFade>

          {/* DrawerRoot corrigé */}
          <DrawerRoot open={editing} onOpenChange={(details) => setEditing(details.open)}>
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
                    onDragMove?.(tempCoord);
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
