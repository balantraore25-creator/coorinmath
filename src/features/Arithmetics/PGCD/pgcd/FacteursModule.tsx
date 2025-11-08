import React, { useState, useMemo, useEffect } from 'react';
import {
  VStack,
  Wrap,
  WrapItem,
  Badge,
  Button,
  Input,
  HStack,
  VStack as VStackInner,
  StepsRoot,
  StepsList,
  StepsItem,
  StepsTrigger,
  StepsIndicator,
  StepsTitle,
  StepsDescription,
  StepsSeparator,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  Field,
  Flex
} from '@chakra-ui/react';
import { RouterChakraLink } from "@/components/ui/RouterChakraLink"
type OptionItem = {
  id: string;
  value: number;
  kind: 'common' | 'distractor';
};

export const FacteursModule: React.FC = () => {
  const [a, setA] = useState<number>(36);
  const [b, setB] = useState<number>(60);
  const [pgcd, setPGCD] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [status, setStatus] = useState<'info' | 'success' | 'error' | 'warning'>('info');
  const [showSteps, setShowSteps] = useState(false);

  const isValidInput = (n: number) => Number.isInteger(n) && n > 0;

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

  const computeCommons = (fa: number[], fb: number[]): number[] => {
    const fbCopy = [...fb];
    const commons: number[] = [];
    for (const f of fa) {
      const index = fbCopy.indexOf(f);
      if (index !== -1) {
        commons.push(f);
        fbCopy.splice(index, 1);
      }
    }
    return commons;
  };

  const fa = useMemo(() => (isValidInput(a) ? decompose(a) : []), [a]);
  const fb = useMemo(() => (isValidInput(b) ? decompose(b) : []), [b]);
  const commons = useMemo(() => computeCommons(fa, fb), [fa, fb]);
  const pgcdAuto = useMemo(
    () => (commons.length > 0 ? commons.reduce((acc, val) => acc * val, 1) : null),
    [commons]
  );

  // Générer deux valeurs pièges
  const generateDistractors = (commonsArr: number[], count = 2): number[] => {
    const distractors: number[] = [];
    while (distractors.length < count) {
      const candidate = Math.floor(Math.random() * 10) + 2; // 2..11
      if (!commonsArr.includes(candidate) && !distractors.includes(candidate)) {
        distractors.push(candidate);
      }
    }
    return distractors;
  };

  const distractorValues = useMemo(() => generateDistractors(commons), [commons]);

  // Mélange aléatoire
  const shuffleArray = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // Construire les options avec IDs uniques et positions aléatoires
  const options: OptionItem[] = useMemo(() => {
    const commonItems = commons.map((value, idx) => ({
      id: `c-${idx}`,
      value,
      kind: 'common' as const,
    }));
    const distractorItems = distractorValues.map((value, idx) => ({
      id: `d-${idx}`,
      value,
      kind: 'distractor' as const,
    }));
    return shuffleArray([...commonItems, ...distractorItems]);
  }, [commons, distractorValues]);

  const optionById = useMemo(() => {
    const map = new Map<string, OptionItem>();
    options.forEach((opt) => map.set(opt.id, opt));
    return map;
  }, [options]);

  const selectedValues = useMemo(
    () => selectedIds.map((id) => optionById.get(id)?.value).filter((v): v is number => typeof v === 'number'),
    [selectedIds, optionById]
  );

  // Helpers
  const countMap = (arr: number[]) => {
    const m = new Map<number, number>();
    for (const x of arr) m.set(x, (m.get(x) ?? 0) + 1);
    return m;
  };

  const equalMultiset = (aVals: number[], bVals: number[]) => {
    const ma = countMap(aVals);
    const mb = countMap(bVals);
    if (ma.size !== mb.size) return false;
    for (const [key, ca] of ma) {
      if (mb.get(key) !== ca) return false;
    }
    return true;
  };

  const product = (arr: number[]) => arr.reduce((acc, v) => acc * v, 1);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const validateSelection = () => {
    if (selectedIds.length === 0) {
      setFeedback("Tu n’as sélectionné aucun facteur.");
      setStatus('error');
      return;
    }

    const pgcdExpected = product(commons);
    const pgcdSelected = product(selectedValues);

    if (equalMultiset(selectedValues, commons)) {
      setPGCD(pgcdSelected);
      setFeedback(`✅ Bravo ! PGCD = ${pgcdSelected}`);
      setStatus('success');
      if (pgcdAuto !== null && pgcdSelected === pgcdAuto) {
        setShowSteps(true);
      }
    } else {
      const correctCounts = countMap(commons);
      const selectedCounts = countMap(selectedValues);

      const missing: number[] = [];
      for (const [val, cnt] of correctCounts) {
        const diff = cnt - (selectedCounts.get(val) ?? 0);
        for (let i = 0; i < diff; i++) missing.push(val);
      }

      const extra: number[] = [];
      for (const [val, cnt] of selectedCounts) {
        const diff = cnt - (correctCounts.get(val) ?? 0);
        for (let i = 0; i < diff; i++) extra.push(val);
      }

      let msg = `❌ Sélection incorrecte. PGCD attendu : ${pgcdExpected}.`;
      if (missing.length) msg += ` Tu as oublié: ${missing.join(', ')}.`;
      if (extra.length) msg += ` Facteurs incorrects: ${extra.join(', ')}.`;
      setFeedback(msg);
      setStatus('error');
    }
  };

  useEffect(() => {
    setPGCD(null);
    setSelectedIds([]);
    setFeedback('');
    setStatus('info');
    setShowSteps(false);
  }, [a, b]);

  return (
    <VStack align="start" gap={6}>
     


<Flex justify="space-between" align="center" w="full" mb={4}>
 <RouterChakraLink to="/dash/courses/euclidean" color="teal.500">
     ← Retour à la page précédente
  </RouterChakraLink>
  <Button
    onClick={() => {
      setA(36);
      setB(60);
      setPGCD(null);
      setSelectedIds([]);
      setFeedback('');
      setStatus('info');
      setShowSteps(false);
    }}
    colorScheme="red"
    variant="solid"
  >
    🔄 Initialiser
  </Button>
</Flex>

      <HStack gap={8}>
        <TooltipRoot openDelay={300}>
          <TooltipTrigger asChild>
            <VStackInner align="start">
              <Field.Root>
                <Field.Label htmlFor="input-a">A</Field.Label>
                <Input
                  id="input-a"
                  type="number"
                  value={a}
                  onChange={(e) => setA(Number(e.target.value))}
                  placeholder="Entier A"
                  variant="outline"
                />
              </Field.Root>
            </VStackInner>
          </TooltipTrigger>
          <TooltipContent>
            <TooltipArrow />
            Saisis un entier positif. Ce sera ton premier nombre pour le calcul du PGCD.
          </TooltipContent>
        </TooltipRoot>

        <TooltipRoot openDelay={300}>
          <TooltipTrigger asChild>
            <VStackInner align="start">
              <Field.Root>
                <Field.Label htmlFor="input-b">B</Field.Label>
                <Input
                  id="input-b"
                  type="number"
                  value={b}
                  onChange={(e) => setB(Number(e.target.value))}
                  placeholder="Entier B"
                  variant="outline"
                />
              </Field.Root>
            </VStackInner>
          </TooltipTrigger>
        
          <TooltipContent>
            <TooltipArrow />
            Saisis un second entier positif. Le PGCD sera calculé automatiquement.
          </TooltipContent>
        </TooltipRoot>
      </HStack>

      <Wrap>
        {options.map((opt) => {
          const isSelected = selectedIds.includes(opt.id);
          return (
            <WrapItem key={opt.id}>
              <Badge
                cursor="pointer"
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                onClick={() => handleToggle(opt.id)}
                onKeyDown={(e) => e.key === 'Enter' && handleToggle(opt.id)}
                colorScheme={isSelected ? 'teal' : opt.kind === 'distractor' ? 'orange' : 'gray'}
                variant={isSelected ? 'solid' : 'outline'}
                title={opt.kind === 'distractor' ? 'Valeur piège' : 'Facteur commun'}
              >
                {opt.value}
              </Badge>
            </WrapItem>
          );
        })}
      </Wrap>

      <Button colorScheme="teal" onClick={validateSelection}>
        Vérifier ma sélection
      </Button>

      {showSteps && (
        <StepsRoot orientation="vertical" size="md" colorPalette="teal">
          <StepsList>
            <StepsItem index={0}>
              <StepsTrigger>
                <StepsIndicator />
                <StepsTitle>Décomposition</StepsTitle>
                <StepsDescription>
                  A = {a} → {fa.join(' × ')}<br />
                  B = {b} → {fb.join(' × ')}
                </StepsDescription>
              </StepsTrigger>
              <StepsSeparator />
            </StepsItem>

            <StepsItem index={1}>
              <StepsTrigger>
                <StepsIndicator />
                <StepsTitle>Facteurs communs</StepsTitle>
                <StepsDescription>
                  {commons.length > 0 ? commons.join(', ') : 'Aucun facteur commun'}
                </StepsDescription>
              </StepsTrigger>
              <StepsSeparator />
            </StepsItem>

            <StepsItem index={2}>
              <StepsTrigger>
                <StepsIndicator />
                <StepsTitle>PGCD automatique</StepsTitle>
                <StepsDescription>
                  {pgcdAuto !== null ? `PGCD = ${pgcdAuto}` : '...'}
                </StepsDescription>
              </StepsTrigger>
              <StepsSeparator />
            </StepsItem>

            <StepsItem index={3}>
              <StepsTrigger>
                <StepsIndicator />
                <StepsTitle>PGCD validé</StepsTitle>
                <StepsDescription>
                  {pgcd !== null ? `PGCD = ${pgcd}` : 'Sélection en attente'}
                </StepsDescription>
              </StepsTrigger>
            </StepsItem>
          </StepsList>
        </StepsRoot>
      )}

      <Badge
        colorScheme={
          status === 'success' ? 'green' : status === 'error' ? 'red' : 'gray'
        }
      >
        {feedback}
      </Badge>
    </VStack>
  );
};
