import { Input, Box } from '@chakra-ui/react';

type InteractiveDigitInputProps = {
  value: string;
  onChange: (val: string) => void;
  isValid: boolean;
  highlight: boolean;
};

export const InteractiveDigitInput: React.FC<InteractiveDigitInputProps> = ({
  value, onChange, isValid, highlight,
}) => (
  <Box
    borderRadius="md"
    bg={highlight ? 'yellow.100' : 'transparent'}
    border="1px solid"
    borderColor={isValid ? 'green.400' : 'red.400'}
    p={1}
    textAlign="center"
    minW="2rem"
  >
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={1}
      textAlign="center"
      variant="outline"
    />
  </Box>
);
