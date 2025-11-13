import type { Complex } from "../types";
import { Box } from "@chakra-ui/react";

type Props = {
  z: Complex;
  wz: Complex;
};

export const ComplexPlaneCanvas = ({ z, wz }: Props) => {
  return (
    <Box>
      <svg width="400" height="400">
        {/* Axes */}
        <line x1="200" y1="0" x2="200" y2="400" stroke="black" />
        <line x1="0" y1="200" x2="400" y2="200" stroke="black" />

        {/* Points */}
        <circle cx={200 + z.re * 50} cy={200 - z.im * 50} r={5} fill="blue" />
        <circle cx={200 + wz.re * 50} cy={200 - wz.im * 50} r={5} fill="red" />
      </svg>
    </Box>
  );
};
