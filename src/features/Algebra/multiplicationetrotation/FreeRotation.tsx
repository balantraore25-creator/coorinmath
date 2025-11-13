import type { Complex } from "../types";
import { polarToComplex, multiply } from "../utils/complexMath";
import { motion } from "framer-motion";
import { Slider, Text } from "@chakra-ui/react";
import { useState } from "react";

export const FreeRotation = () => {
  const cx = 200, cy = 200, scale = 50;
  const [z] = useState<Complex>({ re: 1, im: 1 });
  const [angle, setAngle] = useState(Math.PI / 2);

  const w = polarToComplex(1, angle);
  const wz = multiply(z, w);

  const x1 = cx + z.re * scale, y1 = cy - z.im * scale;
  const x2 = cx + wz.re * scale, y2 = cy - wz.im * scale;

  return (
    <div>
      {/* Slider v3 corrigé */}
      <Slider.Root
        min={0}
        max={2 * Math.PI}
        step={0.01}
        value={[angle]}
        onValueChange={(details: { value: number[] }) => setAngle(details.value[0])}
      >
        <Slider.Label>Angle</Slider.Label>
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb index={0} />
        </Slider.Control>
      </Slider.Root>

      <svg width="400" height="400" style={{ border: "1px solid #ccc" }}>
        <line x1={0} y1={cy} x2={400} y2={cy} stroke="black" />
        <line x1={cx} y1={0} x2={cx} y2={400} stroke="black" />
        <circle cx={x1} cy={y1} r={8} fill="blue" />
        <text x={x1 + 10} y={y1} fontSize="12" fill="blue">z</text>
        <circle cx={x2} cy={y2} r={8} fill="red" />
        <text x={x2 + 10} y={y2} fontSize="12" fill="red">wz</text>
        <motion.path
          d={`M ${x1} ${y1} A ${Math.hypot(z.re, z.im) * scale} ${Math.hypot(z.re, z.im) * scale} 0 0 1 ${x2} ${y2}`}
          stroke="orange"
          strokeWidth={2}
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5 }}
        />
      </svg>

      <Text mt={2}>θ = {(angle * 180 / Math.PI).toFixed(1)}°</Text>
    </div>
  );
};
