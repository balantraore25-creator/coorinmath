import { useState } from "react";
import { ModeToggle } from "./multiplicationetrotation/ModeToggle";
import { FreeRotation } from "./multiplicationetrotation/FreeRotation";
import { ChallengeRotation } from "./multiplicationetrotation/ChallengeRotation";
import { PowersOfIAnimation } from "./multiplicationetrotation/PowersOfIAnimation";
import { AnimatePresence, motion } from "framer-motion";

export const ComplexRotationActivity = () => {
  const [mode, setMode] = useState<"free" | "challenge" | "powersOfI">("free");

  return (
    <div>
      <ModeToggle mode={mode} setMode={setMode} />

      <AnimatePresence mode="wait">
        {mode === "free" && (
          <motion.div key="free" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FreeRotation />
          </motion.div>
        )}
        {mode === "challenge" && (
          <motion.div key="challenge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ChallengeRotation />
          </motion.div>
        )}
        {mode === "powersOfI" && (
          <motion.div key="powersOfI" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PowersOfIAnimation />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
