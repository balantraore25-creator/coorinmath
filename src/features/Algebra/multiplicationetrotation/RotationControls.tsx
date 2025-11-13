import { Box, Text, Slider, NumberInput } from "@chakra-ui/react";

type Props = {
  angle: number;
  setAngle: (theta: number) => void;
  modulus: number;
  setModulus: (r: number) => void;
};

export const RotationControls = ({ angle, setAngle, modulus, setModulus }: Props) => {
  return (
    <Box display="grid" gap={4}>
      <Box>
        <Text mb={2}>Angle (radians)</Text>
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
        <Text mt={1} fontSize="sm" color="gray.600">
          {Math.round((angle * 180) / Math.PI)}°
        </Text>
      </Box>

      <Box>
        <Text mb={2}>Module (r)</Text>
        <NumberInput.Root
          value={String(modulus)}                 // v3 attend une string
          min={0}
          max={5}
          step={0.1}
          onValueChange={(details: { value: string }) => {
            const n = Number(details.value);
            if (!Number.isNaN(n)) setModulus(n);
          }}
        >
          <NumberInput.Label>Module</NumberInput.Label>
          <NumberInput.Control>
            <NumberInput.Input />                 {/* Remplace Field par Input */}
            <NumberInput.Scrubber />
            <NumberInput.IncrementTrigger />
            <NumberInput.DecrementTrigger />
          </NumberInput.Control>
        </NumberInput.Root>
        <Text mt={1} fontSize="sm" color="gray.600">
          r = {modulus.toFixed(2)}
        </Text>
      </Box>
    </Box>
  );
};
