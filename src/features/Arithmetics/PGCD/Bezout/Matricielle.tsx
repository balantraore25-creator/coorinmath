import React, { useState } from 'react';
import {
  VStack, HStack, Input, Field, Button, Badge, Text
} from '@chakra-ui/react';

type Matrix = [number, number, number, number];

const multiply = (m1: Matrix, m2: Matrix): Matrix => [
  m1[0]*m2[0] + m1[1]*m2[2],
  m1[0]*m2[1] + m1[1]*m2[3],
  m1[2]*m2[0] + m1[3]*m2[2],
  m1[2]*m2[1] + m1[3]*m2[3],
];

export const Matricielle: React.FC = () => {
  const [a, setA] = useState<number>(120);
  const [b, setB] = useState<number>(35);
  const [expected, setExpected] = useState<Matrix[]>([]);
  const [step, setStep] = useState<number>(0);
  const [mode, setMode] = useState<'matrix' | 'product'>('matrix');
  const [partial, setPartial] = useState<Matrix>([1, 0, 0, 1]);
  const [inputs, setInputs] = useState<string[]>(["", "", "", ""]);
  const [feedback, setFeedback] = useState<string>('');
  const [errors, setErrors] = useState<number>(0);

  const prepare = () => {
    let x = a, y = b;
    const mats: Matrix[] = [];
    while (y !== 0) {
      const q = Math.floor(x / y);
      mats.push([0, 1, 1, -q]);
      [x, y] = [y, x % y];
    }
    setExpected(mats);
    setStep(0);
    setMode('matrix');
    setPartial([1, 0, 0, 1]);
    setInputs(["", "", "", ""]);
    setFeedback('');
    setErrors(0);
  };

  const giveHint = (exp: Matrix): string => {
    if (errors === 1) return "💡 Vérifie bien tes calculs.";
    if (errors === 2 && mode === 'matrix') return "💡 Rappel : une matrice élémentaire est toujours [0 1 ; 1 -q].";
    if (errors === 2 && mode === 'product') return "💡 Rappel : multiplie le produit partiel par la matrice courante.";
    if (errors === 3) return "💡 Rappel : (AB)ij = somme des produits ligne i × colonne j.";
    if (errors >= 4) return `👉 La bonne réponse était [[${exp[0]} ${exp[1]}],[${exp[2]} ${exp[3]}]].`;
    return '';
  };

  const validate = () => {
    const vals = inputs.map(v => parseInt(v, 10));
    const exp = expected[step];
    if (!exp || vals.some(v => isNaN(v))) {
      setFeedback("❌ Entrées invalides. Assure-toi d’avoir rempli tous les champs.");
      return;
    }

    if (mode === 'matrix') {
      if (vals.every((v, i) => v === exp[i])) {
        setFeedback(`✅ Matrice correcte. Maintenant calcule le produit P × M${step + 1}.`);
        setMode('product');
        setInputs(["", "", "", ""]);
        setErrors(0);
      } else {
        setErrors(errors + 1);
        setFeedback('❌ Mauvaise matrice. ' + giveHint(exp));
      }
    } else {
      const prod = multiply(partial, exp);
      if (vals.every((v, i) => v === prod[i])) {
        setPartial(prod);
        setFeedback(`✅ Produit correct : [[${prod[0]} ${prod[1]}],[${prod[2]} ${prod[3]}]]`);
        setStep(step + 1);
        setMode('matrix');
        setInputs(["", "", "", ""]);
        setErrors(0);
      } else {
        setErrors(errors + 1);
        setFeedback('❌ Produit incorrect. ' + giveHint(prod));
      }
    }
  };

  return (
    <VStack align="start" gap={4}>
      <HStack>
        <Field.Root>
          <Field.Label>A</Field.Label>
          <Input type="number" value={a} onChange={e => setA(Number(e.target.value))} />
        </Field.Root>
        <Field.Root>
          <Field.Label>B</Field.Label>
          <Input type="number" value={b} onChange={e => setB(Number(e.target.value))} />
        </Field.Root>
      </HStack>

      <Button colorScheme="orange" onClick={prepare}>
        Démarrer l’exercice matriciel
      </Button>

      {expected.length > 0 && step < expected.length && (
        <>
          <Text>
            Étape {step + 1} : {mode === 'matrix'
              ? `saisis la matrice élémentaire M${step + 1} = [[a b],[c d]]`
              : `calcule le produit P × M${step + 1} = [[a b],[c d]]`}
          </Text>
          <HStack>
            {inputs.map((val, idx) => (
              <Input
                key={idx}
                type="text"
                w="60px"
                value={val}
                onChange={e => {
                  const newInputs = [...inputs];
                  newInputs[idx] = e.target.value;
                  setInputs(newInputs);
                }}
              />
            ))}
          </HStack>
          <Button colorScheme="teal" onClick={validate}>Valider</Button>
        </>
      )}

      {feedback && (
        <Badge colorScheme={feedback.startsWith('✅') ? 'green' : 'red'}>
          {feedback}
        </Badge>
      )}

      {step === expected.length && (
        <Badge colorScheme="purple">
          🎉 Terminé ! Coefficients de Bézout = (u={partial[0]}, v={partial[2]})
        </Badge>
      )}
    </VStack>
  );
};






/*import React, { useState } from 'react';
import {
  VStack, HStack, Input, Field, Button, Badge, Text
} from '@chakra-ui/react';

type Matrix = [number, number, number, number];

const multiply = (m1: Matrix, m2: Matrix): Matrix => [
  m1[0]*m2[0] + m1[1]*m2[2],
  m1[0]*m2[1] + m1[1]*m2[3],
  m1[2]*m2[0] + m1[3]*m2[2],
  m1[2]*m2[1] + m1[3]*m2[3],
];

export const Matricielle: React.FC = () => {
  const [a, setA] = useState(120);
  const [b, setB] = useState(35);
  const [expected, setExpected] = useState<Matrix[]>([]);
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<'matrix'|'product'>('matrix');
  const [partial, setPartial] = useState<Matrix>([1,0,0,1]);
  const [inputs, setInputs] = useState<string[]>(["","","",""]);
  const [feedback, setFeedback] = useState('');
  const [errors, setErrors] = useState(0);

  const prepare = () => {
    let x=a, y=b;
    const mats: Matrix[] = [];
    while (y!==0) {
      const q = Math.floor(x/y);
      mats.push([0,1,1,-q]);
      [x,y] = [y, x%y];
    }
    setExpected(mats);
    setStep(0);
    setMode('matrix');
    setPartial([1,0,0,1]);
    setInputs(["","","",""]);
    setFeedback('');
    setErrors(0);
  };

  const giveHint = (exp: Matrix) => {
    if (errors===1) return "💡 Vérifie bien tes calculs.";
    if (errors===2 && mode==='matrix') return "💡 Rappel : une matrice élémentaire est toujours [0 1 ; 1 -q].";
    if (errors===2 && mode==='product') return "💡 Rappel : multiplie le produit partiel par la matrice courante.";
    if (errors===3) return "💡 Rappel : (AB)ij = somme des produits ligne i × colonne j.";
    if (errors>=4) return `👉 La bonne réponse était [[${exp[0]} ${exp[1]}],[${exp[2]} ${exp[3]}]].`;
    return '';
  };

  const validate = () => {
    const vals = inputs.map(v => parseInt(v,10));
    const exp = expected[step];
    if (!exp) return;

    if (mode==='matrix') {
      if (vals.every((v,i)=>v===exp[i])) {
        setFeedback(`✅ Matrice correcte. Maintenant calcule le produit P × M${step+1}.`);
        setMode('product');
        setInputs(["","","",""]);
        setErrors(0);
      } else {
        setErrors(errors+1);
        setFeedback('❌ Mauvaise matrice. ' + giveHint(exp));
      }
    } else {
      const prod = multiply(partial, exp);
      if (vals.every((v,i)=>v===prod[i])) {
        setPartial(prod);
        setFeedback(`✅ Produit correct : [[${prod[0]} ${prod[1]}],[${prod[2]} ${prod[3]}]]`);
        setStep(step+1);
        setMode('matrix');
        setInputs(["","","",""]);
        setErrors(0);
      } else {
        setErrors(errors+1);
        setFeedback('❌ Produit incorrect. ' + giveHint(prod));
      }
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

      <Button colorScheme="orange" onClick={prepare}>
        Démarrer l’exercice matriciel
      </Button>

      {expected.length>0 && step<expected.length && (
        <>
          {mode==='matrix' && (
            <Text>Étape {step+1} : saisis la matrice élémentaire M{step+1} = [[a b],[c d]]</Text>
          )}
          {mode==='product' && (
            <Text>Étape {step+1} : calcule le produit P × M{step+1} = [[a b],[c d]]</Text>
          )}
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

      {step===expected.length && (
        <Badge colorScheme="purple">
          🎉 Terminé ! Coefficients de Bézout = (u={partial[0]}, v={partial[2]})
        </Badge>
      )}
    </VStack>
  );
};*/
