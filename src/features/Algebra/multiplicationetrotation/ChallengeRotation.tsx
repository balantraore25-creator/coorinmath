import { useState } from "react";
import type { Complex } from "../types";
import { polarToComplex, multiply } from "../utils/complexMath";
import { motion } from "framer-motion";
import { Slider, Button, Text } from "@chakra-ui/react";

function randomComplex(): Complex {
  return {
    re: Math.round((Math.random() * 4 - 2) * 10) / 10,
    im: Math.round((Math.random() * 4 - 2) * 10) / 10,
  };
}

export const ChallengeRotation = () => {
  const cx = 200, cy = 200, scale = 50;
  const [z, setZ] = useState<Complex>({ re: 1, im: 1 });
  const [target, setTarget] = useState<Complex>({ re: -1, im: 1 });
  const [angle, setAngle] = useState(0);

  const w = polarToComplex(1, angle);
  const wz = multiply(z, w);

  const x1 = cx + z.re * scale, y1 = cy - z.im * scale;
  const x2 = cx + wz.re * scale, y2 = cy - wz.im * scale;
  const xt = cx + target.re * scale, yt = cy - target.im * scale;

  const error = Math.hypot(wz.re - target.re, wz.im - target.im);
  const isCorrect = error < 0.2;

  const newChallenge = () => {
    const newZ = randomComplex();
    const randomAngle = Math.PI / 2;
    setZ(newZ);
    setTarget(multiply(newZ, polarToComplex(1, randomAngle)));
    setAngle(0);
  };

  return (
    <div>
      <Button onClick={newChallenge} mb={4}>Nouveau challenge</Button>

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
        <circle cx={xt} cy={yt} r={8} fill="green" />
        <text x={xt + 10} y={yt} fontSize="12" fill="green">z'</text>
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

      <Text mt={2} fontSize="lg" color={isCorrect ? "green.500" : "red.500"}>
        {isCorrect ? "✅ Correct !" : "❌ Essaie encore"}
      </Text>
    </div>
  );
};
