import { motion } from "framer-motion";

export const PowersOfIAnimation = () => {
  const cx = 200;
  const cy = 200;
  const scale = 80;

  return (
    <svg width="400" height="400" style={{ border: "1px solid #ccc" }}>
      {/* Axes */}
      <line x1={0} y1={cy} x2={400} y2={cy} stroke="black" />
      <line x1={cx} y1={0} x2={cx} y2={400} stroke="black" />

      {/* Cercle unité */}
      <circle cx={cx} cy={cy} r={scale} stroke="gray" fill="none" />

      {/* Groupe animé qui tourne autour du centre */}
      <motion.g
        style={{ transformOrigin: `${cx}px ${cy}px` }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
      >
        <circle cx={cx} cy={cy - scale} r={8} fill="purple" />
      </motion.g>

      {/* Labels fixes */}
      <text x={cx + 10} y={cy - scale} fontSize="12" fill="purple">i</text>
      <text x={cx - scale - 20} y={cy} fontSize="12" fill="purple">i²</text>
      <text x={cx - 5} y={cy + scale + 15} fontSize="12" fill="purple">i³</text>
      <text x={cx + scale + 10} y={cy} fontSize="12" fill="purple">i⁴ = 1</text>
    </svg>
  );
};
