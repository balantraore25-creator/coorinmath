import { motion } from "framer-motion";
import type { Complex } from "../types";

type Props = { isCorrect: boolean; target: Complex };

export const SuccessHalo = ({ isCorrect, target }: Props) =>
  isCorrect ? (
    <motion.circle
      cx={200 + target.re * 50}
      cy={200 - target.im * 50}
      r={20}
      stroke="limegreen"
      strokeWidth={3}
      fill="none"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1.5, opacity: 1 }}
      transition={{ duration: 0.6, repeat: 2, repeatType: "reverse" }}
    />
  ) : null;
