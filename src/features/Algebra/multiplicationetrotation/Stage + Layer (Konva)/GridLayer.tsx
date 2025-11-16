import React from "react";
import { Line, Rect, Text } from "react-konva";
import { ScaleFade } from "@chakra-ui/transition";

type GridLayerProps = {
  size: number;        // taille totale du canvas
  unit: number;        // espacement entre les lignes
  center: number;      // position du centre (souvent size/2)
  gridColor?: string;  // couleur des lignes mineures
  majorColor?: string; // couleur des lignes majeures
  axisXColor?: string; // couleur de l’axe X
  axisYColor?: string; // couleur de l’axe Y
  labelColor?: string; // couleur des labels
  majorStep?: number;  // intervalle des graduations majeures (ex: 5)
  showLabels?: boolean; // activer/désactiver les labels
  showMinorGrid?: boolean; // activer/désactiver la grille mineure
  animated?: boolean;   // activer/désactiver les animations
};

export const GridLayer: React.FC<GridLayerProps> = ({
  size,
  unit,
  center,
  gridColor = "#eee",
  majorColor = "#aaa",
  axisXColor = "red",
  axisYColor = "blue",
  labelColor = "black",
  majorStep = 5,
  showLabels = true,
  showMinorGrid = true,
  animated = true,
}) => {
  const halfSize = size / 2;
  const steps = Math.floor(size / unit);

  return (
    <>
      {/* Grille */}
      {Array.from({ length: steps * 2 + 1 }).map((_, i) => {
        const pos = -halfSize + i * unit;
        const coord = Math.round(pos / unit);
        const isMajor = coord % majorStep === 0;

        return (
          <React.Fragment key={i}>
            {/* Lignes verticales */}
            {(showMinorGrid || isMajor) && (
              <Line
                points={[center + pos, 0, center + pos, size]}
                stroke={isMajor ? majorColor : gridColor}
                strokeWidth={isMajor ? 1.5 : 1}
              />
            )}
            {/* Lignes horizontales */}
            {(showMinorGrid || isMajor) && (
              <Line
                points={[0, center + pos, size, center + pos]}
                stroke={isMajor ? majorColor : gridColor}
                strokeWidth={isMajor ? 1.5 : 1}
              />
            )}

            {/* Labels sur les axes pour graduations majeures */}
            {showLabels && isMajor && coord !== 0 && (
              animated ? (
                <ScaleFade in={true} initialScale={0.9} transition={{ enter: { delay: i * 0.05 } }}>
                  <>
                    {/* Axe X */}
                    <Rect
                      x={center + pos - 12}
                      y={center + 2}
                      width={24}
                      height={18}
                      fill="white"
                    />
                    <Text
                      x={center + pos - 8}
                      y={center + 4}
                      text={coord.toString()}
                      fontSize={12}
                      fill={labelColor}
                    />

                    {/* Axe Y */}
                    <Rect
                      x={center + 2}
                      y={center - pos - 12}
                      width={24}
                      height={18}
                      fill="white"
                    />
                    <Text
                      x={center + 6}
                      y={center - pos - 10}
                      text={coord.toString()}
                      fontSize={12}
                      fill={labelColor}
                    />
                  </>
                </ScaleFade>
              ) : (
                <>
                  <Rect
                    x={center + pos - 12}
                    y={center + 2}
                    width={24}
                    height={18}
                    fill="white"
                  />
                  <Text
                    x={center + pos - 8}
                    y={center + 4}
                    text={coord.toString()}
                    fontSize={12}
                    fill={labelColor}
                  />
                  <Rect
                    x={center + 2}
                    y={center - pos - 12}
                    width={24}
                    height={18}
                    fill="white"
                  />
                  <Text
                    x={center + 6}
                    y={center - pos - 10}
                    text={coord.toString()}
                    fontSize={12}
                    fill={labelColor}
                  />
                </>
              )
            )}
          </React.Fragment>
        );
      })}

      {/* Axes principaux */}
      <Line points={[0, center, size, center]} stroke={axisXColor} strokeWidth={2} />
      <Line points={[center, 0, center, size]} stroke={axisYColor} strokeWidth={2} />

      {/* Label du centre */}
      {showLabels && (
        animated ? (
          <ScaleFade in={true} initialScale={0.8} transition={{ enter: { delay: 0.2 } }}>
            <>
              <Rect x={center - 10} y={center - 10} width={20} height={18} fill="white" />
              <Text
                x={center - 6}
                y={center - 8}
                text="0"
                fontSize={12}
                fill={labelColor}
              />
            </>
          </ScaleFade>
        ) : (
          <>
            <Rect x={center - 10} y={center - 10} width={20} height={18} fill="white" />
            <Text
              x={center - 6}
              y={center - 8}
              text="0"
              fontSize={12}
              fill={labelColor}
            />
          </>
        )
      )}
    </>
  );
};
