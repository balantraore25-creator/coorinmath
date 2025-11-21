// ComplexPlaneColorControl.tsx
import  { useState } from 'react';

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
const scale = 40;

function toSVG({ re, im }: Complex) {
  return {
    x: origin.x + re * scale,
    y: origin.y - im * scale,
  };
}

export default function ComplexPlaneColorControl({ z, fz, a, label }: Props) {
  const [animate, setAnimate] = useState(true);
  const [speed, setSpeed] = useState(2);
  const [colorZ, setColorZ] = useState("blue");
  const [colorFZ, setColorFZ] = useState("green");
  const [colorA, setColorA] = useState("red");
  const [colorVector, setColorVector] = useState("orange");

  const Z = toSVG(z);
  const FZ = toSVG(fz);
  const A = a ? toSVG(a) : null;

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Contrôles */}
      <button
        onClick={() => setAnimate(!animate)}
        style={{ marginBottom: '10px', padding: '5px 10px' }}
      >
        {animate ? "Pause Animation" : "Play Animation"}
      </button>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Vitesse : {speed}s
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
          />
        </label>
      </div>

      {/* Sélecteurs de couleur */}
      <div style={{ marginBottom: '10px' }}>
        <label>
          Couleur z :
          <input type="color" value={colorZ} onChange={(e) => setColorZ(e.target.value)} />
        </label>
        <label>
          Couleur f(z) :
          <input type="color" value={colorFZ} onChange={(e) => setColorFZ(e.target.value)} />
        </label>
        {A && (
          <label>
            Couleur a :
            <input type="color" value={colorA} onChange={(e) => setColorA(e.target.value)} />
          </label>
        )}
        <label>
          Couleur vecteurs :
          <input type="color" value={colorVector} onChange={(e) => setColorVector(e.target.value)} />
        </label>
      </div>

      <svg width={width} height={height} style={{ border: '1px solid #ccc' }}>
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5"
            orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L10,5 L0,10 Z" fill="black" />
          </marker>
        </defs>

        {/* Axes */}
        <line x1={0} y1={origin.y} x2={width} y2={origin.y} stroke="black" markerEnd="url(#arrow)" />
        <line x1={origin.x} y1={height} x2={origin.x} y2={0} stroke="black" markerEnd="url(#arrow)" />

        <text x={width - 20} y={origin.y - 5} fontSize="12">U</text>
        <text x={origin.x + 5} y={15} fontSize="12">V</text>
        <circle cx={origin.x} cy={origin.y} r={3} fill="black" />
        <text x={origin.x + 5} y={origin.y - 5} fontSize="12">O</text>

        {/* Points pulsants avec couleurs dynamiques */}
        <circle cx={Z.x} cy={Z.y} r={5} fill={colorZ}>
          {animate && <animate attributeName="r" values="5;8;5" dur={`${speed}s`} repeatCount="indefinite" />}
        </circle>
        <text x={Z.x + 5} y={Z.y - 5}>z</text>

        <circle cx={FZ.x} cy={FZ.y} r={5} fill={colorFZ}>
          {animate && <animate attributeName="r" values="5;8;5" dur={`${speed}s`} begin="0.5s" repeatCount="indefinite" />}
        </circle>
        <text x={FZ.x + 5} y={FZ.y - 5}>f(z)</text>

        {A && (
          <>
            <circle cx={A.x} cy={A.y} r={5} fill={colorA}>
              {animate && <animate attributeName="r" values="5;8;5" dur={`${speed}s`} begin="1s" repeatCount="indefinite" />}
            </circle>
            <text x={A.x + 5} y={A.y - 5}>a</text>
          </>
        )}

        {/* Vecteurs avec couleur dynamique */}
        <line x1={Z.x} y1={Z.y} x2={FZ.x} y2={FZ.y} stroke={colorVector} strokeDasharray="4">
          {animate && <animate attributeName="stroke-opacity" values="1;0.5;1" dur={`${speed * 1.5}s`} repeatCount="indefinite" />}
        </line>
        {A && (
          <>
            <line x1={A.x} y1={A.y} x2={Z.x} y2={Z.y} stroke={colorVector}>
              {animate && <animate attributeName="stroke-opacity" values="1;0.5;1" dur={`${speed * 1.5}s`} begin="1s" repeatCount="indefinite" />}
            </line>
            <line x1={A.x} y1={A.y} x2={FZ.x} y2={FZ.y} stroke={colorVector}>
              {animate && <animate attributeName="stroke-opacity" values="1;0.5;1" dur={`${speed * 1.5}s`} begin="1.5s" repeatCount="indefinite" />}
            </line>
          </>
        )}

        {/* Label */}
        {label && <text x={10} y={20} fontWeight="bold">{label}</text>}
      </svg>
    </div>
  );
}
