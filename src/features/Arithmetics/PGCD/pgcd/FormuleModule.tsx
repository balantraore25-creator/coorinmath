import React, { useState, useMemo } from 'react';
import {
  VStack, HStack, Button, Badge, Wrap, WrapItem,
  StepsRoot, StepsList, StepsItem, StepsTrigger,
  StepsIndicator, StepsTitle, StepsDescription, StepsSeparator,
  Field, Input
} from '@chakra-ui/react';

type FactorChoice = { prime: number; count: number };

export const FormuleModule: React.FC = () => {
  const [a, setA] = useState<number>(60);
  const [b, setB] = useState<number>(36);
  const [choices, setChoices] = useState<FactorChoice[]>([]);
  const [ppcm, setPPCM] = useState<number | null>(null);
  const [pgcd, setPGCD] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [showSteps, setShowSteps] = useState(false);

  const decompose = (n: number): number[] => {
    const factors: number[] = [];
    for (let i = 2; i <= n; i++) {
      while (n % i === 0) {
        factors.push(i);
        n /= i;
      }
    }
    return factors;
  };

  const fa = useMemo(() => decompose(a), [a]);
  const fb = useMemo(() => decompose(b), [b]);

  const expectedExponents = useMemo(() => {
    const primes = Array.from(new Set([...fa, ...fb]));
    const map: Record<number, number> = {};
    primes.forEach(p => {
      const expA = fa.filter(x => x === p).length;
      const expB = fb.filter(x => x === p).length;
      map[p] = Math.max(expA, expB);
    });
    return map;
  }, [fa, fb]);

  const handleToggle = (prime: number) => {
    setChoices(prev => {
      const existing = prev.find(c => c.prime === prime);
      if (existing) {
        return prev.map(c =>
          c.prime === prime ? { ...c, count: c.count + 1 } : c
        );
      }
      return [...prev, { prime, count: 1 }];
    });
  };

  const validate = () => {
    let correct = true;
    const missing: string[] = [];
    const extra: string[] = [];

    Object.entries(expectedExponents).forEach(([p, exp]) => {
      const chosen = choices.find(c => c.prime === +p)?.count ?? 0;
      if (chosen < exp) missing.push(`${p}^${exp - chosen}`);
      if (chosen > exp) extra.push(`${p}^${chosen - exp}`);
      if (chosen !== exp) correct = false;
    });

    if (correct) {
      const lcm = Object.entries(expectedExponents)
        .reduce((acc, [p, exp]) => acc * Math.pow(+p, exp), 1);
      setPPCM(lcm);
      setPGCD((a * b) / lcm);
      setFeedback(`✅ Bravo ! PPCM = ${lcm}, PGCD = ${(a * b) / lcm}`);
      setShowSteps(true);
    } else {
      let msg = '❌ Mauvaise sélection.';
      if (missing.length) msg += ` Facteurs manquants: ${missing.join(', ')}.`;
      if (extra.length) msg += ` Facteurs en trop: ${extra.join(', ')}.`;
      setFeedback(msg);
      setShowSteps(false);
    }
  };

  // 🔹 Réinitialisation des choix
  const resetChoices = () => {
    setChoices([]);
    setPPCM(null);
    setPGCD(null);
    setFeedback('');
    setShowSteps(false);
  };

  return (
    <VStack align="start" gap={6}>
      <HStack gap={8}>
        <Field.Root>
          <Field.Label>A</Field.Label>
          <Input type="number" value={a} onChange={e => setA(Number(e.target.value))}/>
        </Field.Root>
        <Field.Root>
          <Field.Label>B</Field.Label>
          <Input type="number" value={b} onChange={e => setB(Number(e.target.value))}/>
        </Field.Root>
      </HStack>

      <Wrap>
        {Object.keys(expectedExponents).map(p => {
          const chosen = choices.find(c => c.prime === +p)?.count ?? 0;
          return (
            <WrapItem key={p}>
              <Badge
                cursor="pointer"
                onClick={() => handleToggle(+p)}
                colorScheme={chosen ? 'teal' : 'gray'}
              >
                {p} ^ {chosen}
              </Badge>
            </WrapItem>
          );
        })}
      </Wrap>

      <HStack>
        <Button colorScheme="teal" onClick={validate}>
          Vérifier ma sélection
        </Button>
        <Button colorScheme="red" variant="outline" onClick={resetChoices}>
          Réinitialiser les choix
        </Button>
      </HStack>

      {showSteps && (
        <StepsRoot orientation="vertical" size="md" colorPalette="teal">
          <StepsList>
            <StepsItem index={0}>
              <StepsTrigger>
                <StepsIndicator />
                <StepsTitle>Décomposition</StepsTitle>
                <StepsDescription>
                  A = {a} → {fa.join(' × ')} <br/>
                  B = {b} → {fb.join(' × ')}
                </StepsDescription>
              </StepsTrigger>
              <StepsSeparator />
            </StepsItem>
            <StepsItem index={1}>
              <StepsTrigger>
                <StepsIndicator />
                <StepsTitle>PPCM</StepsTitle>
                <StepsDescription>PPCM = {ppcm}</StepsDescription>
              </StepsTrigger>
              <StepsSeparator />
            </StepsItem>
            <StepsItem index={2}>
              <StepsTrigger>
                <StepsIndicator />
                <StepsTitle>PGCD (via formule)</StepsTitle>
                <StepsDescription>PGCD = {pgcd}</StepsDescription>
              </StepsTrigger>
            </StepsItem>
          </StepsList>
        </StepsRoot>
      )}

      <Badge colorScheme={showSteps ? 'green' : 'red'}>
        {feedback}
      </Badge>
    </VStack>
  );
};
