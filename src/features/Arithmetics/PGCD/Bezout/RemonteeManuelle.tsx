import React, { useState } from 'react';
import {
  VStack, HStack, Input, Field, Button, Badge, Text
} from '@chakra-ui/react';

type EquationStep = {
  text: string;             // équation affichée
  expected: [number, number]; // coefficients attendus pour (a,b)
};

export const RemonteeManuelle: React.FC = () => {
  const [a, setA] = useState(120);
  const [b, setB] = useState(35);
  const [steps, setSteps] = useState<EquationStep[]>([]);
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState<string[]>(["",""]);
  const [feedback, setFeedback] = useState('');
  const [errors, setErrors] = useState(0);

  // Algorithme d’Euclide étendu pour générer les étapes
  const buildSteps = (a: number, b: number): EquationStep[] => {
    let x=a, y=b;
    const quotients: number[] = [];
    const remainders: number[] = [a,b];

    while (y !== 0) {
      const q = Math.floor(x/y);
      const r = x % y;
      quotients.push(q);
      remainders.push(r);
      [x,y] = [y,r];
    }

    // Maintenant on remonte
    // On exprime chaque reste comme combinaison de a et b
    let u0=1, v0=0;
    let u1=0, v1=1;
    const eqs: EquationStep[] = [];

    for (let i=0; i<quotients.length; i++) {
      const q = quotients[i];
      const r = remainders[i+2];
      if (r===0) break;

      // mise à jour des coefficients
      const u2 = u0 - q*u1;
      const v2 = v0 - q*v1;

      eqs.push({
        text: `${remainders[i]} = (?) × ${a} + (?) × ${b}`,
        expected: [u0, v0]
      });

      [u0,v0,u1,v1] = [u1,v1,u2,v2];
    }

    // dernière équation = PGCD
    eqs.push({
      text: `${x} = (?) × ${a} + (?) × ${b}`,
      expected: [u0,v0]
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
  };

  const giveHint = (exp: [number,number]) => {
    if (errors===1) return "💡 Vérifie bien tes coefficients.";
    if (errors===2) return "💡 Indice : remplace le reste par l’équation précédente.";
    if (errors===3) return "💡 Rappel : on exprime toujours le reste comme combinaison de A et B.";
    if (errors>=4) return `👉 La bonne réponse était (${exp[0]}, ${exp[1]}).`;
    return '';
  };

  const validate = () => {
    const vals = inputs.map(v => parseInt(v,10));
    const exp = steps[step].expected;
    if (vals[0]===exp[0] && vals[1]===exp[1]) {
      setFeedback(`✅ Correct ! ${steps[step].text.replace("(?)", vals[0].toString()).replace("(?)", vals[1].toString())}`);
      setStep(step+1);
      setInputs(["",""]);
      setErrors(0);
    } else {
      setErrors(errors+1);
      setFeedback('❌ Mauvais coefficients. ' + giveHint(exp));
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

      <Button colorScheme="purple" onClick={prepare}>
        Démarrer la remontée
      </Button>

      {steps.length>0 && step<steps.length && (
        <>
          <Text>Étape {step+1} : {steps[step].text}</Text>
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

      {step===steps.length && (
        <Badge colorScheme="green">
          🎉 Terminé ! Coefficients de Bézout trouvés.
        </Badge>
      )}
    </VStack>
  );
};
