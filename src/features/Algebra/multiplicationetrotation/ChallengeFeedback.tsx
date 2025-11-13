import { Box, Text } from "@chakra-ui/react";
import type { Complex } from "../types";

type Props = { wz: Complex; target: Complex };

export const ChallengeFeedback = ({ wz, target }: Props) => {
  const error = Math.hypot(wz.re - target.re, wz.im - target.im);
  const isCorrect = error < 0.1;

  return (
    <Box>
      {isCorrect ? <Text color="green.500">✅ Correct !</Text> : <Text color="red.500">❌ Essaie encore</Text>}
    </Box>
  );
};
