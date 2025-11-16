import React, { useMemo, useState } from "react";
import { Stage, Layer } from "react-konva";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import { GridLayer } from "./Stage + Layer (Konva)/GridLayer";
import { AxisLabels } from "./Stage + Layer (Konva)/AxisLabels";
import { BaseVector } from "./Stage + Layer (Konva)/BaseVector";
import { DraggablePoint } from "./Stage + Layer (Konva)/DraggablePoint (boules interactives)/DraggablePoint";
import { FeedbackPanel } from "./FeedbackPanel (panneau latéral statique)/FeedbackPanel";
import { DynamicFormulaPanel } from "./DynamicFormulaPanel (panneau dynamique)/DynamicFormulaPanel";

// Types
type Point = { x: number; y: number };

// Constantes
const unit = 50;
const size = 500;
const center = size / 2;
const colors = ["green", "red", "blue", "orange", "purple"];

// Hook animation simple
function useVectorAnimation(selectedIdx: number | null, placed: Record<number, boolean>, argumentDeg: number) {
  const [vectorProgress, setVectorProgress] = useState(0);
  const [arcProgress, setArcProgress] = useState(0);

  React.useEffect(() => {
    if (selectedIdx !== null && placed[selectedIdx]) {
      setVectorProgress(0);
      setArcProgress(0);
      const step = () => {
        setVectorProgress((p) => Math.min(p + 0.02, 1));
        setArcProgress((a) => Math.min(a + 2, argumentDeg));
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, [selectedIdx, placed, argumentDeg]);

  return { vectorProgress, arcProgress };
}

// Hook synchronisation étapes
function useStepAnimation(selectedIdx: number | null, placed: Record<number, boolean>) {
  const [currentStep, setCurrentStep] = useState(0);

  React.useEffect(() => {
    if (selectedIdx !== null && placed[selectedIdx]) {
      setCurrentStep(0);
      const interval = setInterval(() => {
        setCurrentStep((s) => Math.min(s + 1, 3));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [selectedIdx, placed]);

  return currentStep;
}

export const ComplexCanvas: React.FC = () => {
  const [z, setZ] = useState<Point>({ x: 2, y: 1 }); // 🔹 z est maintenant modifiable
  const [placed, setPlaced] = useState<Record<number, boolean>>({});
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const panelDirection = useBreakpointValue({ base: "column", md: "row" });

  const module = useMemo(() => Math.sqrt(z.x ** 2 + z.y ** 2), [z.x, z.y]);
  const argument = useMemo(() => Math.atan2(z.y, z.x), [z.x, z.y]);
  const argumentDeg = useMemo(() => (argument * 180) / Math.PI, [argument]);

  const points = useMemo<Point[]>(
    () => [
      { x: z.x, y: z.y },       // boule verte (modifiable)
      { x: -z.y, y: z.x },
      { x: -z.x, y: -z.y },
      { x: z.y, y: -z.x },
      { x: z.x, y: z.y },
    ],
    [z.x, z.y]
  );

  const placedCount = useMemo(
    () => Object.entries(placed).filter(([k, v]) => v && Number(k) < 4).length,
    [placed]
  );
  const totalCount = 4;

  const { vectorProgress, arcProgress } = useVectorAnimation(selectedIdx, placed, argumentDeg);
  const currentStep = useStepAnimation(selectedIdx, placed);

  return (
    <Box display="flex" flexDirection={panelDirection} gap={6}>
      <Box flex="1">
        <Stage width={size} height={size + 140} style={{ backgroundColor: "#fff" }}>
          <Layer>
            <GridLayer size={size} unit={unit} center={center} />
            <AxisLabels size={size} center={center} />
            <BaseVector z={z} unit={unit} center={center} />

            {points.map((p, idx) => (
              <DraggablePoint
                key={idx}
                p={p}
                idx={idx}
                color={colors[idx]}
                placed={!!placed[idx]}
                onPlace={(i) => setPlaced((prev) => ({ ...prev, [i]: true }))}
                onSelect={setSelectedIdx}
                selectedIdx={selectedIdx}
                vectorProgress={vectorProgress}
                arcProgress={arcProgress}
                currentStep={currentStep}
                unit={unit}
                center={center}
                size={size}
                // 🔹 Ajout : mise à jour de z quand la boule verte est déplacée
                onDragMove={
                  idx === 0
                    ? (newPoint: Point) => setZ(newPoint)
                    : undefined
                }
              />
            ))}
          </Layer>
        </Stage>
      </Box>

      <Box>
        <FeedbackPanel
          z={z}
          module={module}
          argumentDeg={argumentDeg}
          placedCount={placedCount}
          totalCount={totalCount}
        />
        <DynamicFormulaPanel z={z} placed={placed} />
      </Box>
    </Box>
  );
};
