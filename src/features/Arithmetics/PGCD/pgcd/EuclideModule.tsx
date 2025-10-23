import React, { useState, useEffect } from 'react';
import {
  VStack,
  Text,
  Input,
  TableRoot,
  TableHeader,
  TableBody,
  TableRow,
  TableColumnHeader,
  TableCell,
  AlertRoot,
  AlertContent,
  AlertTitle,
  AlertDescription,
  Button,
  Link,
  Flex
} from '@chakra-ui/react';


type Step = {
  dividend: number | null;
  divisor: number | null;
  remainder: number | null;
  isValid: boolean;
};

type NumericField = 'dividend' | 'divisor' | 'remainder';

export const EuclideMethode: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([
    { dividend: null, divisor: null, remainder: null, isValid: false }
  ]);
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState<'info' | 'success' | 'error'>('info');

  const updateStep = (index: number, field: NumericField, value: string) => {
    const updated = [...steps];
    const parsed = parseInt(value);
    updated[index][field] = isNaN(parsed) ? null : parsed;
    updated[index].isValid = false;
    setSteps(updated);
  };

  const resetAll = () => {
    setSteps([{ dividend: null, divisor: null, remainder: null, isValid: false }]);
    setFeedback('');
    setStatus('info');
  };

  const getHelperText = (step: Step, index: number): string => {
    const { dividend, divisor, remainder } = step;

    if (dividend === null || divisor === null) {
      return "Commence par entrer deux entiers strictement positifs.";
    }

    if (remainder === null) {
      return `Calcule ${dividend} ÷ ${divisor} et entre le reste.`;
    }

    if (remainder > 0) {
      return `Vérifie que ${dividend} = ${divisor} × ${Math.floor(dividend / divisor)} + ${remainder}`;
    }

    if (remainder === 0 && index === steps.length - 1) {
      return `✅ Le PGCD est ${divisor} (dernier reste non nul).`;
    }

    return "";
  };

  useEffect(() => {
    const current = steps[steps.length - 1];
    const { dividend, divisor, remainder } = current;

    if (
      typeof dividend === 'number' &&
      typeof divisor === 'number' &&
      typeof remainder === 'number'
    ) {
      if (dividend <= 0 || divisor <= 0) {
        setFeedback("⚠️ Les valeurs doivent être strictement positives.");
        setStatus("error");
        return;
      }

      const expected = dividend % divisor;

      if (expected !== remainder) {
        setFeedback(`❌ Mauvais reste. ${dividend} ÷ ${divisor} = ${Math.floor(dividend / divisor)} reste ${expected}`);
        setStatus('error');
        return;
      }

      const updated = [...steps];
      updated[steps.length - 1].isValid = true;
      setSteps(updated);

      if (remainder === 0) {
        setFeedback(`✅ Terminé ! Le PGCD est ${divisor}`);
        setStatus('success');
      } else {
        setFeedback('✅ Étape correcte. Continue !');
        setStatus('info');
        setSteps([...updated, { dividend: null, divisor: null, remainder: null, isValid: false }]);
      }
    }
  }, [steps]);

  return (
    <VStack align="start" gap={6}>
      <Flex justify="space-between" w="full">
        <Link
        href="/dash/courses/pgcd"
        color="teal.500"
        fontWeight="medium"
        mb={4}
        display="inline-block"
      >
        ← Retour à la page précédente
      </Link>
        <Button onClick={resetAll} colorScheme="red" variant="solid">
          🔄 Initialiser
        </Button>
      </Flex>

      <Text fontSize="xl" fontWeight="bold">Méthode d’Euclide</Text>

      <TableRoot variant="outline" size="sm">
        <TableHeader>
          <TableRow>
            <TableColumnHeader>Dividende</TableColumnHeader>
            <TableColumnHeader>Diviseur</TableColumnHeader>
            <TableColumnHeader>Reste</TableColumnHeader>
            <TableColumnHeader>Aide</TableColumnHeader>
          </TableRow>
        </TableHeader>

        <TableBody>
          {steps.map((step, index) => (
            <TableRow key={index}>
              {(['dividend', 'divisor', 'remainder'] as NumericField[]).map(field => (
                <TableCell key={field}>
                  <Input
                    type="number"
                    value={step[field] !== null ? step[field]!.toString() : ''}
                    onChange={(e) => updateStep(index, field, e.target.value)}
                    disabled={step.isValid}
                    size="sm"
                    placeholder="..."
                  />
                </TableCell>
              ))}
              <TableCell>
                <Text fontSize="sm" color="gray.600">
                  {getHelperText(step, index)}
                </Text>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>

      <AlertRoot status={status} variant="subtle" borderRadius="md" padding={4}>
        <AlertContent>
          <AlertTitle fontWeight="bold">Message</AlertTitle>
          <AlertDescription>{feedback}</AlertDescription>
        </AlertContent>
      </AlertRoot>
    </VStack>
  );
};
