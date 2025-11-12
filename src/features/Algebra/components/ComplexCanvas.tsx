import React from "react";
import { Stage, Layer, Line, Circle, Text as KonvaText } from "react-konva";
import { Box } from "@chakra-ui/react";

export const ComplexCanvas: React.FC = () => {
  const unit = 40; // 1 unité = 40px
  const size = 17 * unit; // de -8 à +8 → 17 divisions
  const center = size / 2; // centre O(0,0)

  // Point z = 3 - 5i
  const point = { x: 3, y: -5 };
  const px = center + point.x * unit;
  const py = center - point.y * unit;

  return (
    <Box>
      <Stage width={size} height={size} style={{ backgroundColor: "#fff" }}>
        <Layer>
          {/* Grille avec axes confondus aux lignes centrales */}
          {[...Array(17)].map((_, i) => {
            const pos = i * unit;
            const isCentral = i === 8;
            return (
              <>
                <Line
                  key={`v${i}`}
                  points={[pos, 0, pos, size]}
                  stroke={isCentral ? "black" : "#ddd"}
                  strokeWidth={isCentral ? 2 : 1}
                />
                <Line
                  key={`h${i}`}
                  points={[0, pos, size, pos]}
                  stroke={isCentral ? "black" : "#ddd"}
                  strokeWidth={isCentral ? 2 : 1}
                />
              </>
            );
          })}

          {/* Labels des axes */}
          <KonvaText text="axe des réels" x={size - 100} y={center + 5} fontSize={16} />
          <KonvaText text="axe des imaginaires purs" x={center + 10} y={20} fontSize={16} />

          {/* Graduations horizontales (x) */}
          {[...Array(17)].map((_, i) => {
            const x = i * unit;
            const value = i - 8;
            if (value !== 0) {
              return (
                <KonvaText
                  key={`vx${i}`}
                  text={`${value}`}
                  x={x}
                  y={center + 15}
                  fontSize={12}
                  fill="black"
                />
              );
            }
            return null;
          })}

          {/* Graduations verticales (y) */}
          {[...Array(17)].map((_, i) => {
            const y = i * unit;
            const value = 8 - i;
            if (value !== 0) {
              return (
                <KonvaText
                  key={`vy${i}`}
                  text={`${value}`}
                  x={center + 10}
                  y={y}
                  fontSize={12}
                  fill="black"
                />
              );
            }
            return null;
          })}

          {/* Point z = 3 - 5i */}
          <Circle x={px} y={py} radius={8} fill="red" />

          {/* Segment vertical en pointillés */}
          <Line
            points={[px, center, px, py]}
            stroke="red"
            dash={[6, 6]}
            strokeWidth={2}
          />

          {/* Segment horizontal en pointillés */}
          <Line
            points={[center, py, px, py]}
            stroke="red"
            dash={[6, 6]}
            strokeWidth={2}
          />

          {/* Coordonnées affichées */}
          <KonvaText
            text={`z = 3 - 5i → Coordonnées (3, -5)`}
            x={10}
            y={10}
            fill="red"
            fontSize={14}
          />
        </Layer>
      </Stage>
    </Box>
  );
};
