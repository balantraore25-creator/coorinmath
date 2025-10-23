import { Button, HStack } from '@chakra-ui/react';

type OperationStepperProps = {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
};

export const OperationStepper: React.FC<OperationStepperProps> = ({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
}) => (
  <HStack gap={4}>
    <Button onClick={onPrev} disabled={currentStep === 0}>
      ◀ Étape précédente
    </Button>
    <Button onClick={onNext} disabled={currentStep >= totalSteps - 1}>
      Étape suivante ▶
    </Button>
  </HStack>
);
