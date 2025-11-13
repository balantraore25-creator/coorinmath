import { motion } from "framer-motion";
import { Slider, Text } from "@chakra-ui/react";
import { useState } from "react";

export const PowersOfIAnimation = () => {
  const cx = 200;
  const cy = 200;
  const scale = 80;

  // vitesse en secondes par tour
  const [speed, setSpeed] = useState(8);

  return (
    <div>
      {/* Slider v3 pour contrôler la vitesse */}
      <Slider.Root
        min={2}
        max={12}
        step={0.5}
        value={[speed]}
        onValueChange={(details: { value: number[] }) => setSpeed(details.value[0])}
      >
        <Slider.Label>Vitesse (s/tour)</Slider.Label>
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb index={0} />
        </Slider.Control>
      </Slider.Root>

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
          transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
        >
          <circle cx={cx} cy={cy - scale} r={8} fill="purple" />
        </motion.g>

        {/* Labels fixes */}
        <text x={cx + 10} y={cy - scale} fontSize="12" fill="purple">i</text>
        <text x={cx - scale - 20} y={cy} fontSize="12" fill="purple">i²</text>
        <text x={cx - 5} y={cy + scale + 15} fontSize="12" fill="purple">i³</text>
        <text x={cx + scale + 10} y={cy} fontSize="12" fill="purple">i⁴ = 1</text>
      </svg>

      <Text mt={2}>Durée d’un tour : {speed}s</Text>
    </div>
  );
};
