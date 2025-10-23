import React, { useState } from 'react';
import {
  VStack, HStack, Input, Field, Button, Badge, Text
} from '@chakra-ui/react';

type EquationStep = {
  r: number;                // reste
  expected: [number, number]; // coefficients attendus pour (a,b)
};

export const EuclideEtendu: React.FC = () => {
  const [a, setA] = useState(120);
  const [b, setB] = useState(35);
  const [steps, setSteps] = useState<EquationStep[]>([]);
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState<string[]>(["",""]);
  const [feedback, setFeedback] = useState('');
  const [errors, setErrors] = useState(0);
  const [validated, setValidated] = useState<string[]>([]);

  // PGCD simple
  const gcd = (x:number,y:number):number => {
    while (y!==0) [x,y] = [y, x%y];
    return x;
  };

  // Algorithme d’Euclide étendu
  const buildSteps = (a: number, b: number): EquationStep[] => {
    let old_r = a, r = b;
    let old_s = 1, s = 0;
    let old_t = 0, t = 1;

    const eqs: EquationStep[] = [];

    while (r !== 0) {
      const q = Math.floor(old_r / r);
      [old_r, r] = [r, old_r - q * r];
      [old_s, s] = [s, old_s - q * s];
      [old_t, t] = [t, old_t - q * t];

      if (r !== 0) {
        eqs.push({
          r: old_r,
          expected: [old_s, old_t]
        });
      }
    }

    // dernière équation = PGCD
    eqs.push({
      r: old_r,
      expected: [old_s, old_t]
    });

    return eqs;
  };

  const prepare = () => {
    const s = buildSteps(a,b);
    setSteps(s);
    setStep(0);
    setInputs(["",""]);
    setFeedback('');
    setErrors(0);
    setValidated([]);
  };

  const giveHint = () => {
    if (errors===1) return "💡 Vérifie bien tes coefficients.";
    if (errors===2) return "💡 Indice : pense à la mise à jour des coefficients (s,t).";
    if (errors===3) return "💡 Rappel : on exprime toujours le reste comme combinaison de A et B.";
    return '';
  };

  const validate = () => {
    const u = parseInt(inputs[0],10);
    const v = parseInt(inputs[1],10);
    const current = steps[step];
    const isLast = (step === steps.length - 1);

    if (isNaN(u) || isNaN(v)) {
      setFeedback("❌ Merci de saisir deux entiers.");
      return;
    }

    // Validation hybride
    if (
      (!isLast && a*u + b*v === current.r) ||
      (isLast && a*u + b*v === gcd(a,b))
    ) {
      const eq = `${isLast ? gcd(a,b) : current.r} = ${u}×${a} + ${v}×${b}`;
      setValidated([...validated, eq]);
      setFeedback(`✅ Correct ! ${eq}`);
      setStep(step+1);
      setInputs(["",""]);
      setErrors(0);
    } else {
      setErrors(errors+1);
      setFeedback('❌ Mauvais coefficients. ' + giveHint());
    }
  };

  return (
    <VStack align="start" gap={4}>
      <HStack>
        <Field.Root>
          <Field.Label>A</Field.Label>
          <Input type="number" value={a} onChange={e=>setA(Number(e.target.value))}/>
        </Field.Root>
        <Field.Root>
          <Field.Label>B</Field.Label>
          <Input type="number" value={b} onChange={e=>setB(Number(e.target.value))}/>
        </Field.Root>
      </HStack>

      <Button colorScheme="blue" onClick={prepare}>
        Démarrer Euclide Étendu
      </Button>

      {steps.length>0 && step<steps.length && (
        <>
          <Text>
            Étape {step+1} : {steps[step].r} = (?) × {a} + (?) × {b}
          </Text>
          <HStack>
            {inputs.map((val, idx)=>(
              <Input
                key={idx}
                type="text"
                w="60px"
                value={val}
                onChange={e=>{
                  const newInputs=[...inputs];
                  newInputs[idx]=e.target.value;
                  setInputs(newInputs);
                }}
              />
            ))}
          </HStack>
          <Button colorScheme="teal" onClick={validate}>Valider</Button>
        </>
      )}

      {feedback && <Badge colorScheme={feedback.startsWith('✅')?'green':'red'}>{feedback}</Badge>}

      {validated.length>0 && (
        <VStack align="start">
          <Text>Équations validées :</Text>
          {validated.map((eq,i)=><Text key={i}>{eq}</Text>)}
        </VStack>
      )}

      {step===steps.length && (
        <Badge colorScheme="green">
          🎉 Terminé ! PGCD = {gcd(a,b)}. Coefficients de Bézout trouvés.
        </Badge>
      )}
    </VStack>
  );
};
