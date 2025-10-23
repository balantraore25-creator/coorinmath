import { Box, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface MathSentenceProps {
  expression: string | ReactNode;
  fontSize?: string;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export const MathSentence = ({
  expression,
  fontSize = 'lg',
  color = 'gray.800',
  align = 'left',
}: MathSentenceProps) => {
  return (
    <Box
      textAlign={align}
      fontSize={fontSize}
      fontFamily="math, serif"
      color={color}
      whiteSpace="pre-wrap"
      lineHeight="1.6"
      px={2}
      py={1}
      borderRadius="md"
      bg="gray.50"
    >
      <Text as="span">{expression}</Text>
    </Box>
  );
};
