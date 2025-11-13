import type { Complex } from "../types";
import { motion } from "framer-motion";

type Props = {
  from: Complex;
  to: Complex;
};

export const AnimatedRotation = ({ from, to }: Props) => {
  // Conversion coordonnées complexes → coordonnées SVG
  const cx = 200; // centre X
  const cy = 200; // centre Y
  const scale = 50; // facteur d’échelle

  const x1 = cx + from.re * scale;
  const y1 = cy - from.im * scale;
  const x2 = cx + to.re * scale;
  const y2 = cy - to.im * scale;

  // Arc SVG : on utilise l’élément <path> avec commande "A"
  const radius = Math.hypot(from.re, from.im) * scale;
  const largeArcFlag = 0; // arc court
  const sweepFlag = 1; // sens antihoraire

  const arcPath = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`;

  return (
    <svg width="400" height="400">
      {/* Axes */}
      <line x1={0} y1={cy} x2={400} y2={cy} stroke="black" />
      <line x1={cx} y1={0} x2={cx} y2={400} stroke="black" />

      {/* Point initial */}
      <circle cx={x1} cy={y1} r={5} fill="blue" />
      {/* Point final */}
      <circle cx={x2} cy={y2} r={5} fill="red" />

      {/* Arc animé */}
      <motion.path
        d={arcPath}
        stroke="orange"
        strokeWidth={2}
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5 }}
      />
    </svg>
  );
};
