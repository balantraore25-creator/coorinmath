// ComplexPlane.tsx
import type { ReactElement } from "react";

export type Complex = { re: number; im: number };

interface Props {
  z: Complex;
  fz: Complex;
  a?: Complex;
  label?: string;
  showGrid?: boolean;
  showProjections?: boolean;
}

const width = 400;
const height = 400;
const origin = { x: width / 2, y: height / 2 };
const scale = 40;
const maxUnits = 5;

function toSVG({ re, im }: Complex) {
  return {
    x: origin.x + re * scale,
    y: origin.y - im * scale,
  };
}

export default function ComplexPlane({
  z,
  fz,
  a,
  label,
  showGrid = true,
  showProjections = true,
}: Props) {
  const Z = toSVG(z);
  const FZ = toSVG(fz);
  const A = a ? toSVG(a) : null;

  // Grille
  const gridLines: ReactElement[] = [];
  if (showGrid) {
    for (let i = 0; i <= width / scale; i++) {
      const x = i * scale;
      gridLines.push(<line key={`vx${i}`} x1={x} y1={0} x2={x} y2={height} stroke="#eee" />);
    }
    for (let j = 0; j <= height / scale; j++) {
      const y = j * scale;
      gridLines.push(<line key={`hz${j}`} x1={0} y1={y} x2={width} y2={y} stroke="#eee" />);
    }
  }

  // Graduations
  const ticks: ReactElement[] = [];
  for (let k = -maxUnits; k <= maxUnits; k++) {
    if (k !== 0) {
      ticks.push(
        <line
          key={`tick-x${k}`}
          x1={origin.x + k * scale}
          y1={origin.y - 5}
          x2={origin.x + k * scale}
          y2={origin.y + 5}
          stroke="black"
        />
      );
      ticks.push(
        <text
          key={`label-x${k}`}
          x={origin.x + k * scale - 5}
          y={origin.y + 20}
          fontSize="10"
        >
          {k}
        </text>
      );

      ticks.push(
        <line
          key={`tick-y${k}`}
          x1={origin.x - 5}
          y1={origin.y - k * scale}
          x2={origin.x + 5}
          y2={origin.y - k * scale}
          stroke="black"
        />
      );
      ticks.push(
        <text
          key={`label-y${k}`}
          x={origin.x + 10}
          y={origin.y - k * scale + 3}
          fontSize="10"
        >
          {k}
        </text>
      );
    }
  }

  return (
    <svg width={width} height={height} style={{ border: "1px solid #ccc" }}>
      {showGrid && gridLines}

      {/* Axes */}
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5"
          orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L10,5 L0,10 Z" fill="black" />
        </marker>
      </defs>

      <line x1={0} y1={origin.y} x2={width} y2={origin.y} stroke="black" markerEnd="url(#arrow)" />
      <line x1={origin.x} y1={height} x2={origin.x} y2={0} stroke="black" markerEnd="url(#arrow)" />

      <text x={width - 20} y={origin.y - 5} fontSize="12">U</text>
      <text x={origin.x + 5} y={15} fontSize="12">V</text>
      <circle cx={origin.x} cy={origin.y} r={3} fill="black" />
      <text x={origin.x + 5} y={origin.y - 5} fontSize="12">O</text>

      {ticks}

      {/* Points */}
      <circle cx={Z.x} cy={Z.y} r={5} fill="blue" />
      <text x={Z.x + 5} y={Z.y - 5}>z</text>

      <circle cx={FZ.x} cy={FZ.y} r={5} fill="green" />
      <text x={FZ.x + 5} y={FZ.y - 5}>f(z)</text>

      {A && (
        <>
          <circle cx={A.x} cy={A.y} r={5} fill="red" />
          <text x={A.x + 5} y={A.y - 5}>a</text>
        </>
      )}

      {/* Projections */}
      {showProjections && (
        <>
          <line x1={Z.x} y1={Z.y} x2={Z.x} y2={origin.y} stroke="blue" strokeDasharray="2" />
          <line x1={Z.x} y1={Z.y} x2={origin.x} y2={Z.y} stroke="blue" strokeDasharray="2" />
          <text x={Z.x} y={origin.y + 30} fontSize="10">{z.re}</text>
          <text x={origin.x - 25} y={Z.y} fontSize="10">{z.im}</text>

          <line x1={FZ.x} y1={FZ.y} x2={FZ.x} y2={origin.y} stroke="green" strokeDasharray="2" />
          <line x1={FZ.x} y1={FZ.y} x2={origin.x} y2={FZ.y} stroke="green" strokeDasharray="2" />
          <text x={FZ.x} y={origin.y + 30} fontSize="10">{fz.re}</text>
          <text x={origin.x - 25} y={FZ.y} fontSize="10">{fz.im}</text>
        </>
      )}

      {/* Vecteurs */}
      <line x1={Z.x} y1={Z.y} x2={FZ.x} y2={FZ.y} stroke="gray" strokeDasharray="4" />
      {A && <line x1={A.x} y1={A.y} x2={Z.x} y2={Z.y} stroke="orange" />}
      {A && <line x1={A.x} y1={A.y} x2={FZ.x} y2={FZ.y} stroke="orange" />}

      {label && <text x={10} y={20} fontWeight="bold">{label}</text>}
    </svg>
  );
}
