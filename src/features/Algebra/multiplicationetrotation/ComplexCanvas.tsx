import React, { useMemo, useState } from "react";
import { Stage, Layer } from "react-konva";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import { GridLayer } from "./Stage + Layer (Konva)/GridLayer";
import { AxisLabels } from "./Stage + Layer (Konva)/AxisLabels";
import { BaseVector } from "./Stage + Layer (Konva)/BaseVector";
import { DraggablePoint } from "./Stage + Layer (Konva)/DraggablePoint (boules interactives)/DraggablePoint";
import { FeedbackPanel } from "./FeedbackPanel (panneau latéral statique)/FeedbackPanel";
import { DynamicFormulaPanel } from "./DynamicFormulaPanel (panneau dynamique)/DynamicFormulaPanel";

type Point = { x: number; y: number };

const unit = 50;
const size = 500;
const center = size / 2;
const colors = ["green", "red", "blue", "orange", "purple"];

export const ComplexCanvas: React.FC = () => {
  const [z, setZ] = useState<Point>({ x: 2, y: 1 });
  const [placed, setPlaced] = useState<Record<number, boolean>>({});
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [k, setK] = useState<number>(0); // 🔹 synchronisation avec le panel

  const panelDirection = useBreakpointValue({ base: "column", md: "row" });

  const module = useMemo(() => Math.sqrt(z.x ** 2 + z.y ** 2), [z.x, z.y]);
  const argument = useMemo(() => Math.atan2(z.y, z.x), [z.x, z.y]);
  const argumentDeg = useMemo(() => (argument * 180) / Math.PI, [argument]);

  // Appliquer rotation par i^k
  const rotatedPoint = useMemo<Point>(() => {
    const angle = k * Math.PI / 2;
    const r = Math.sqrt(z.x ** 2 + z.y ** 2);
    const theta = Math.atan2(z.y, z.x);
    return {
      x: r * Math.cos(theta + angle),
      y: r * Math.sin(theta + angle),
    };
  }, [z, k]);

  return (
    <Box display="flex" flexDirection={panelDirection} gap={6}>
      <Box flex="1">
        <Stage width={size} height={size} style={{ backgroundColor: "#fff" }}>
          <Layer>
            <GridLayer size={size} unit={unit} center={center} />
            <AxisLabels size={size} center={center} />
            <BaseVector z={z} unit={unit} center={center} />

            <DraggablePoint
              p={rotatedPoint}
              idx={0}
              color={colors[0]}
              placed={!!placed[0]}
              onPlace={(i) => setPlaced((prev) => ({ ...prev, [i]: true }))}
              onSelect={setSelectedIdx}
              selectedIdx={selectedIdx}
              vectorProgress={0}
              arcProgress={0}
              currentStep={0}
              unit={unit}
              center={center}
              size={size}
              onDragMove={(newPoint: Point) => setZ(newPoint)}
            />
          </Layer>
        </Stage>
      </Box>

      <Box>
        <FeedbackPanel
          z={z}
          module={module}
          argumentDeg={argumentDeg}
          placedCount={Object.values(placed).filter(Boolean).length}
          totalCount={1}
        />
        <DynamicFormulaPanel
          selectedPoints={[z]}
          placed={placed}
          k={k}
          onKChange={setK}
        />
      </Box>
    </Box>
  );
};
