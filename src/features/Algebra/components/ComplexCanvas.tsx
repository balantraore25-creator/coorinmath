import React, { useState, useEffect } from "react";
import { Stage, Layer, Line, Circle, Text as KonvaText } from "react-konva";
import { Box, Text, Slider } from "@chakra-ui/react";
import type Konva from "konva";
import type { Point } from "../types";
import { useContainerSize } from "./useContainerSize";

interface Props {
  points: { A: Point; B: Point; C: Point };
}

type StudentPoints = Record<string, Point>;
type ProgressMap = Record<string, number>;

export const ComplexCanvas: React.FC<Props> = ({ points }) => {
  const { ref, size } = useContainerSize();
  const [studentPoints, setStudentPoints] = useState<StudentPoints>(points);
  const [visibleLines, setVisibleLines] = useState(0);
  const [axisProgress, setAxisProgress] = useState(0);
  const [graduationProgress, setGraduationProgress] = useState(0);
  const [pointProgress, setPointProgress] = useState<ProgressMap>({});
  const [labelProgress, setLabelProgress] = useState<ProgressMap>({});
  const [speed, setSpeed] = useState(1);

  const unit = size.width / 17;
  const center = size.width / 2;

  // Reset states and re-initialize from props whenever points change (relaunch)
  useEffect(() => {
    setStudentPoints(points);
    setVisibleLines(0);
    setAxisProgress(0);
    setGraduationProgress(0);
    setPointProgress({});
    setLabelProgress({});
  }, [points]);

  // Timeline auto (intro -> show points)
  useEffect(() => {
    let frameId: number;

    const animateGrid = () => {
      let i = 0;
      const step = () => {
        i++;
        setVisibleLines(i);
        if (i < 17) frameId = requestAnimationFrame(step);
        else animateAxes();
      };
      step();
    };

    const animateAxes = () => {
      let t = 0;
      const step = () => {
        t += 0.05;
        setAxisProgress(Math.min(t, 1));
        if (t < 1) frameId = requestAnimationFrame(step);
        else animateGraduations();
      };
      step();
    };

    const animateGraduations = () => {
      let g = 0;
      const step = () => {
        g++;
        setGraduationProgress(g);
        if (g < 17) frameId = requestAnimationFrame(step);
        else animatePoints();
      };
      step();
    };

    const animatePoints = () => {
      (["A", "B", "C"] as const).forEach((label, idx) => {
        let p = 0;
        const step = () => {
          p += 0.05;
          setPointProgress((prev) => ({ ...prev, [label]: Math.min(p, 1) }));
          if (p < 1) requestAnimationFrame(step);
          else animateLabels(label);
        };
        setTimeout(step, (idx * 300) / speed);
      });
    };

    const animateLabels = (label: string) => {
      let l = 0;
      const step = () => {
        l += 0.05;
        setLabelProgress((prev) => ({ ...prev, [label]: Math.min(l, 1) }));
        if (l < 1) requestAnimationFrame(step);
      };
      step();
    };

    animateGrid();
    return () => cancelAnimationFrame(frameId);
  }, [speed, points]); // depend on points to replay intro on relaunch

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, label: string) => {
    const node = e.target;
    const newX = Math.round((node.x() - center) / unit);
    const newY = Math.round(-(node.y() - center) / unit);
    setStudentPoints((prev) => ({ ...prev, [label]: { x: newX, y: newY } }));
  };

  const getCoords = (label: string) => {
    const p = studentPoints[label];
    return { x: p.x, y: p.y };
  };

  return (
    <Box ref={ref} width="100%" maxW="100%" mx="auto">
      <Box mb={4} p={3} bg="gray.100" borderRadius="md">
        <Text fontSize={["sm", "md", "lg"]} fontWeight="bold">
          Déplace une boule sur le plan pour obtenir ses coordonnées.
        </Text>
      </Box>

      <Stage width={size.width} height={size.height} style={{ backgroundColor: "#fff" }}>
        <Layer>
          {/* Grille */}
          {[...Array(visibleLines)].map((_, i) => {
            const pos = i * unit;
            return (
              <>
                <Line key={`v${i}`} points={[pos, 0, pos, size.height]} stroke="#ddd" strokeWidth={1} />
                <Line key={`h${i}`} points={[0, pos, size.width, pos]} stroke="#ddd" strokeWidth={1} />
              </>
            );
          })}

          {/* Axes */}
          {axisProgress > 0 && (
            <>
              <Line points={[0, center, size.width, center]} stroke="black" strokeWidth={2} />
              <Line points={[center, 0, center, size.height]} stroke="black" strokeWidth={2} />
              {axisProgress === 1 && (
                <>
                  <Circle x={center} y={center} radius={5} fill="black" />
                  <KonvaText text="(0,0)" x={center + 8} y={center + 8} fontSize={12} />
                  <KonvaText text="axe des réels" x={size.width - 120} y={center + 5} fontSize={16} />
                  <KonvaText text="axe des imaginaires purs" x={center + 10} y={20} fontSize={16} />
                </>
              )}
            </>
          )}

          {/* Graduations */}
          {graduationProgress > 0 && (
            <>
              {[...Array(graduationProgress)].map((_, i) => {
                const x = i * unit;
                const value = i - 8;
                return (
                  <KonvaText
                    key={`vx${i}`}
                    text={`${value}`}
                    x={x}
                    y={center + 15}
                    fontSize={12}
                    fill={value === 0 ? "black" : "#444"}
                  />
                );
              })}
              {[...Array(graduationProgress)].map((_, i) => {
                const y = i * unit;
                const value = 8 - i;
                return (
                  <KonvaText
                    key={`vy${i}`}
                    text={`${value}`}
                    x={center + 10}
                    y={y}
                    fontSize={12}
                    fill={value === 0 ? "black" : "#444"}
                  />
                );
              })}
            </>
          )}

          {/* Points + projections */}
          {(["A", "B", "C"] as const).map((label, idx) => {
            const color = ["red", "blue", "green"][idx];
            const p = getCoords(label);
            const x = center + p.x * unit;
            const y = center - p.y * unit;
            const prog = pointProgress[label] ?? 0;
            const lprog = labelProgress[label] ?? 0;

            return (
              <>
                {/* Cercle animé */}
                {prog > 0 && (
                  <Circle
                    x={x}
                    y={y}
                    radius={15 * prog}
                    stroke={color}
                    strokeWidth={2}
                    opacity={0.4 * (1 - prog)}
                  />
                )}
                <Circle
                  key={label}
                  x={x}
                  y={y}
                  radius={10 * Math.max(prog, 0.0001)}
                  fill={color}
                  draggable
                  onDragEnd={(e) => handleDragEnd(e, label)}
                />

                {/* Texte global des coordonnées */}
                <KonvaText
                  text={`${label} : z = ${p.x} + i${p.y} → (${p.x}, ${p.y})`}
                  x={10}
                  y={10 + idx * 20}
                  fill={color}
                  fontSize={14}
                />

                {/* Projections en pointillé + labels avec halo */}
                {prog > 0 && (
                  <>
                    {/* Projection verticale */}
                    <Line
                      points={[x, y, x, center]}
                      stroke={color}
                      strokeWidth={1}
                      dash={[4, 4]}
                      opacity={0.6}
                    />
                    <Circle
                      x={x - 5}
                      y={center + 10}
                      radius={15 * lprog}
                      fill={color}
                      opacity={0.2 * (1 - lprog)}
                    />
                    <KonvaText
                      text={`${p.x}`}
                      x={x - 10}
                                            y={center + 5 + (1 - lprog) * 20}
                      fontSize={12}
                      fill={color}
                      opacity={lprog}
                    />

                    {/* Projection horizontale */}
                    <Line
                      points={[x, y, center, y]}
                      stroke={color}
                      strokeWidth={1}
                      dash={[4, 4]}
                      opacity={0.6}
                    />
                    <Circle
                      x={center + 10}
                      y={y - 5}
                      radius={15 * lprog}
                      fill={color}
                      opacity={0.2 * (1 - lprog)}
                    />
                    <KonvaText
                      text={`${p.y}`}
                      x={center + 5 + (1 - lprog) * 20}
                      y={y - 10}
                      fontSize={12}
                      fill={color}
                      opacity={lprog}
                    />
                  </>
                )}
              </>
            );
          })}
        </Layer>
      </Stage>

      <Box mt={4} px={[2, 4, 6]}>
        <Text mb={2} fontSize={["sm", "md"]}>
          Vitesse de l’animation : {speed.toFixed(1)}x
        </Text>
        <Slider.Root
          min={0.5}
          max={2}
          step={0.1}
          value={[speed]}
          onValueChange={(details: { value: number[] }) => setSpeed(details.value[0])}
        >
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb index={0}>
            <Slider.ValueText />
          </Slider.Thumb>
        </Slider.Root>
      </Box>
    </Box>
  );
};

