import { useState } from "react";
import { multiply, polarToComplex } from "./utils/complexMath";
import type { Complex } from "./types";
import { ComplexPlaneCanvas } from "./multiplicationetrotation/ComplexPlaneCanvas";
import { RotationControls } from "./multiplicationetrotation/RotationControls";
import { FeedbackPanel } from "./multiplicationetrotation/FeedbackPanel";
import { ChallengeFeedback } from "./multiplicationetrotation/ChallengeFeedback";
import { ModeToggle } from "./multiplicationetrotation/ModeToggle";
import { Button } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

function randomComplex(): Complex {
  return {
    re: Math.round((Math.random() * 4 - 2) * 10) / 10,
    im: Math.round((Math.random() * 4 - 2) * 10) / 10,
  };
}

export const ComplexRotationActivity = () => {
  const [mode, setMode] = useState<"free" | "challenge">("free");
  const [z, setZ] = useState<Complex>({ re: 1, im: 1 });
  const [angle, setAngle] = useState(Math.PI / 2);
  const [modulus, setModulus] = useState(1);
  const [target, setTarget] = useState<Complex>({ re: -1, im: 1 });

  const w = polarToComplex(modulus, angle);
  const wz = multiply(z, w);

  const newChallenge = () => {
    const newZ = randomComplex();
    const w = polarToComplex(1, Math.PI / 2);
    setZ(newZ);
    setTarget(multiply(newZ, w));
  };

  return (
    <>
      <ModeToggle mode={mode} setMode={setMode} />
      <AnimatePresence mode="wait">
        {mode === "free" ? (
          <motion.div key="free" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>
            <RotationControls angle={angle} setAngle={setAngle} modulus={modulus} setModulus={setModulus} />
            <ComplexPlaneCanvas z={z} wz={wz} />
            <FeedbackPanel z={z} wz={wz} angle={angle} />
          </motion.div>
        ) : (
          <motion.div key="challenge" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <Button onClick={newChallenge}>Nouveau challenge</Button>
            <RotationControls angle={angle} setAngle={setAngle} modulus={modulus} setModulus={setModulus} />
            <ComplexPlaneCanvas z={z} wz={wz} />
            <ChallengeFeedback wz={wz} target={target} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
