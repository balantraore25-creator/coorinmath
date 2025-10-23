import React from 'react';
import {
  VStack,
  HStack,
  Button,
  Text,
  Badge,
  Wrap,
  WrapItem,
  NumberInputRoot,
  NumberInputLabel,
  NumberInputValueText,
  NumberInputInput,
  NumberInputControl,
  NumberInputIncrementTrigger,
  NumberInputDecrementTrigger,
  Alert
} from '@chakra-ui/react';

interface InputPanelProps {
  a: number;
  b: number;
  setA: (val: number) => void;
  setB: (val: number) => void;
  onValidate: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({ a, b, setA, setB, onValidate }) => (
  <HStack >
    <NumberInputRoot value={a.toString()} onValueChange={({ valueAsNumber }) => setA(valueAsNumber)}>
      <NumberInputLabel>A</NumberInputLabel>
      <NumberInputValueText />
      <NumberInputControl>
        <NumberInputIncrementTrigger />
        <NumberInputDecrementTrigger />
      </NumberInputControl>
      <NumberInputInput placeholder="A" />
    </NumberInputRoot>

    <NumberInputRoot value={b.toString()} onValueChange={({ valueAsNumber }) => setB(valueAsNumber)}>
      <NumberInputLabel>B</NumberInputLabel>
      <NumberInputValueText />
      <NumberInputControl>
        <NumberInputIncrementTrigger />
        <NumberInputDecrementTrigger />
      </NumberInputControl>
      <NumberInputInput placeholder="B" />
    </NumberInputRoot>

    <Button colorScheme="teal" onClick={onValidate}>Valider</Button>
  </HStack>
);

export const StepDisplay: React.FC<{ steps: string[] }> = ({ steps }) => (
  <VStack align="start" >
    {steps.map((s, i) => <Text key={i}>• {s}</Text>)}
  </VStack>
);

interface FeedbackZoneProps {
  message: string;
  status?: 'info' | 'success' | 'error' | 'warning';
  title?: string;
}

export const FeedbackZone: React.FC<FeedbackZoneProps> = ({
  message,
  status = 'info',
  title = 'Message'
}) => (
  <Alert.Root
    status={status}
    variant="subtle"
    borderRadius="md"
    padding={4}
    style={{ borderLeft: '4px solid', borderColor: 'var(--chakra-colors-teal-500)' }}
  >
    <Alert.Content>
      <Alert.Title fontWeight="bold">{title}</Alert.Title>
      <Alert.Description>{message}</Alert.Description>
    </Alert.Content>
  </Alert.Root>
);

interface FactorDisplayProps {
  a: number;
  b: number;
  aFactors: number[];
  bFactors: number[];
}

export const FactorDisplay: React.FC<FactorDisplayProps> = ({ a, b, aFactors, bFactors }) => (
  <VStack align="start">
    <Text fontWeight="bold">Décomposition de {a} :</Text>
    <Wrap>
      {aFactors.map((f, i) => (
        <WrapItem key={`a-${i}`}>
          <Badge colorScheme="blue" variant="subtle">{f}</Badge>
        </WrapItem>
      ))}
    </Wrap>

    <Text fontWeight="bold">Décomposition de {b} :</Text>
    <Wrap>
      {bFactors.map((f, i) => (
        <WrapItem key={`b-${i}`}>
          <Badge colorScheme="green" variant="subtle">{f}</Badge>
        </WrapItem>
      ))}
    </Wrap>
  </VStack>
);
