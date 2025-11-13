import type { Complex } from "../types";
import { Box, Text } from "@chakra-ui/react";

type Props = {
  z: Complex;
  wz: Complex;
  angle: number;
};

export const FeedbackPanel = ({ z, wz, angle }: Props) => (
  <Box>
    <Text>z = {z.re} + {z.im}i</Text>
    <Text>wz = {wz.re.toFixed(2)} + {wz.im.toFixed(2)}i</Text>
    <Text>Rotation: {Math.round((angle * 180) / Math.PI)}°</Text>
  </Box>
);
