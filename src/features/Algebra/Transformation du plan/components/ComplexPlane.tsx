//import React from 'react';

//type Complex = { re: number; im: number };
export type Complex = { re: number; im: number };


interface Props {
  z: Complex;
  fz: Complex;
  a?: Complex;
  label?: string;
}

const width = 400;
const height = 400;
const origin = { x: width / 2, y: height / 2 };
const scale = 40; // 1 unité = 40px

function toSVG({ re, im }: Complex) {
  return {
    x: origin.x + re * scale,
    y: origin.y - im * scale,
  };
}

export default function ComplexPlane({ z, fz, a, label }: Props) {
  const Z = toSVG(z);
  const FZ = toSVG(fz);
  const A = a ? toSVG(a) : null;

  return (
    <svg width={width} height={height} style={{ border: '1px solid #ccc' }}>
      {/* Axes */}
      <line x1={0} y1={origin.y} x2={width} y2={origin.y} stroke="black" />
      <line x1={origin.x} y1={0} x2={origin.x} y2={height} stroke="black" />

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

      {/* Vecteurs */}
      <line x1={Z.x} y1={Z.y} x2={FZ.x} y2={FZ.y} stroke="gray" strokeDasharray="4" />
      {A && <line x1={A.x} y1={A.y} x2={Z.x} y2={Z.y} stroke="orange" />}
      {A && <line x1={A.x} y1={A.y} x2={FZ.x} y2={FZ.y} stroke="orange" />}

      {/* Label */}
      {label && <text x={10} y={20} fontWeight="bold">{label}</text>}
    </svg>
  );
}
