import React, { useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { Toggle } from "./Toggle"; // chemin vers ton composant Toggle
import { useAngle } from "./hooks/useAngle";

type Props = { x: number; y: number; showDegrees: boolean; onToggle: () => void };

export const TrigCircleAnimated: React.FC<Props> = ({ x, y, showDegrees, onToggle }) => {
  const { module, angleRad, angleDeg } = useAngle(x, y);
  const angleTarget = showDegrees ? angleDeg : angleRad;

  // Motion value pour interpolation fluide
  const angleValue = useMotionValue(0);
  useEffect(() => {
    const controls = animate(angleValue, angleTarget, { duration: 1.2, ease: "easeOut" });
    return controls.stop;
  }, [angleTarget]);

  const cx = 150, cy = 150, r = 100;
  const endX = cx + r * Math.cos(angleRad);
  const endY = cy - r * Math.sin(angleRad);

  return (
    <div>
      <svg width={300} height={300}>
        <circle cx={cx} cy={cy} r={r} stroke="black" fill="none" />
        <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="gray" />
        <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="gray" />

        {/* Arc progressif */}
        <motion.path
          d={`M ${cx + r} ${cy} A ${r} ${r} 0 ${angleValue.get() > 180 ? 1 : 0} 1 ${endX} ${endY}`}
          stroke="red"
          strokeWidth={3}
          fill="none"
        />

        {/* Rayon */}
        <AnimatePresence mode="wait">
          <motion.line
            key={showDegrees ? "deg" : "rad"}
            x1={cx}
            y1={cy}
            x2={endX}
            y2={endY}
            stroke="red"
            strokeWidth={2}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        </AnimatePresence>
      </svg>

      <p>Angle ({showDegrees ? "deg" : "rad"}) : {angleValue.get().toFixed(2)}</p>
      <p>Module : {module.toFixed(2)}</p>

      <Toggle
  checked={!showDegrees}
  onChange={onToggle}
  label={showDegrees ? "Degrés" : "Radians"}
/>

    </div>
  );
};
