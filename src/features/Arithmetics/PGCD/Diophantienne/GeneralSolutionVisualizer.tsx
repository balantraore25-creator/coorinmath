import {
  Box,
  Text,
  Code,
  Flex,
  SimpleGrid,
  Stack,
  SliderRoot,
  SliderTrack,
  SliderRange,
  SliderThumb,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from '@chakra-ui/react';
import { useState } from 'react';

interface GeneralSolutionVisualizerProps {
  a: number;
  b: number;
  c: number;
  x0: number;
  y0: number;
  gcd: number;
}

export const GeneralSolutionVisualizer = ({
  a,
  b,
  x0,
  y0,
  gcd,
}: GeneralSolutionVisualizerProps) => {
  const [t, setT] = useState<number>(0);

  const x = x0 + (b / gcd) * t;
  const y = y0 - (a / gcd) * t;

  const points = Array.from({ length: 11 }, (_, i) => {
    const tVal = i - 5;
    return {
      t: tVal,
      x: x0 + (b / gcd) * tVal,
      y: y0 - (a / gcd) * tVal,
    };
  });

  return (
    <Box mt={6}>
      <Stack gap={4}>
        <Text>
          Valeur actuelle de <Code>t</Code> : <Code>{t}</Code>
        </Text>

        <SliderRoot
          min={-5}
          max={5}
          step={1}
          value={[t]}
          onValueChange={(details) => setT(details.value[0])}
        >
          <SliderTrack>
            <SliderRange />
          </SliderTrack>
          <SliderThumb index={0} />
        </SliderRoot>

        <Text>
          Solution correspondante : <Code>x = {x}</Code>, <Code>y = {y}</Code>
        </Text>

        <SimpleGrid columns={3} gap={3}>
          {points.map((pt) => (
            <TooltipRoot key={pt.t} openDelay={150}>
              <TooltipTrigger>
                <Flex
                  p={2}
                  border="1px solid"
                  borderColor={pt.t === t ? 'blue.500' : 'gray.300'}
                  borderRadius="md"
                  justify="center"
                  align="center"
                  bg={pt.t === t ? 'blue.50' : 'gray.50'}
                  transition="all 0.2s ease"
                  cursor="pointer"
                >
                  <Code>{`(${pt.x}, ${pt.y})`}</Code>
                </Flex>
              </TooltipTrigger>
              <TooltipContent>
                <TooltipArrow />
                {`t = ${pt.t} → x = ${pt.x}, y = ${pt.y}`}
              </TooltipContent>
            </TooltipRoot>
          ))}
        </SimpleGrid>
      </Stack>
    </Box>
  );
};
