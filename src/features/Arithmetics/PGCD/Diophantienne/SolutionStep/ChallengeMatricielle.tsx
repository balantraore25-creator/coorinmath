// src/features/Arithmetics/PGCD/Diophantienne/SolutionStep/ChallengeMatricielle.tsx

import React, { useState } from "react";
import {
  VStack,
  HStack,
  Input,
  Button,
  Badge,
  Text,
} from "@chakra-ui/react";

type Matrix = [number, number, number, number];

const multiply = (m1: Matrix, m2: Matrix): Matrix => [
  m1[0] * m2[0] + m1[1] * m2[2],
  m1[0] * m2[1] + m1[1] * m2[3],
  m1[2] * m2[0] + m1[3] * m2[2],
  m1[2] * m2[1] + m1[3] * m2[3],
];

export interface ChallengeMatricielleProps {
  a: number;
  b: number;
  onSuccess: (u: number, v: number) => void;
}

export const ChallengeMatricielle: React.FC<ChallengeMatricielleProps> = ({
  a,
  b,
  onSuccess,
}) => {
  const [expected, setExpected] = useState<Matrix[]>([]);
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"matrix" | "product">("matrix");
  const [partial, setPartial] = useState<Matrix>([1, 0, 0, 1]);
  const [inputs, setInputs] = useState<string[]>(["", "", "", ""]);
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState(0);

  // Prépare la liste des matrices élémentaires
  const prepare = () => {
    let x = a,
      y = b;
    const mats: Matrix[] = [];
    while (y !== 0) {
      const q = Math.floor(x / y);
      mats.push([0, 1, 1, -q]); // matrice élémentaire
      [x, y] = [y, x % y];
    }
    setExpected(mats);
    setStep(0);
    setMode("matrix");
    setPartial([1, 0, 0, 1]);
    setInputs(["", "", "", ""]);
    setFeedback("");
    setErrors(0);
  };

  const giveHint = (exp: Matrix): string => {
    if (errors === 1) return "💡 Vérifie bien tes calculs.";
    if (errors === 2 && mode === "matrix")
      return "💡 Rappel : une matrice élémentaire est toujours [0 1 ; 1 -q].";
    if (errors === 2 && mode === "product")
      return "💡 Rappel : multiplie le produit partiel par la matrice courante.";
    if (errors === 3)
      return "💡 Rappel : (AB)ij = somme des produits ligne i × colonne j.";
    if (errors >= 4)
      return `👉 La bonne réponse était [[${exp[0]} ${exp[1]}],[${exp[2]} ${exp[3]}]].`;
    return "";
  };

  const validate = () => {
    const vals = inputs.map((v) => parseInt(v, 10));
    const exp = expected[step];
    if (!exp || vals.some((v) => isNaN(v))) {
      setFeedback("❌ Entrées invalides. Remplis bien les 4 cases.");
      return;
    }

    if (mode === "matrix") {
      if (vals.every((v, i) => v === exp[i])) {
        setFeedback(
          `✅ Matrice correcte. Maintenant calcule le produit P × M${step + 1}.`
        );
        setMode("product");
        setInputs(["", "", "", ""]);
        setErrors(0);
      } else {
        setErrors(errors + 1);
        setFeedback("❌ Mauvaise matrice. " + giveHint(exp));
      }
    } else {
      const prod = multiply(partial, exp);
      if (vals.every((v, i) => v === prod[i])) {
        setPartial(prod);
        setFeedback(
          `✅ Produit correct : [[${prod[0]} ${prod[1]}],[${prod[2]} ${prod[3]}]]`
        );
        setStep(step + 1);
        setMode("matrix");
        setInputs(["", "", "", ""]);
        setErrors(0);

        if (step + 1 === expected.length) {
          // ✅ Fin : coefficients de Bézout
          onSuccess(prod[0], prod[2]);
        }
      } else {
        setErrors(errors + 1);
        setFeedback("❌ Produit incorrect. " + giveHint(prod));
      }
    }
  };

  return (
    <VStack align="start" gap={4}>
      <Button colorScheme="orange" onClick={prepare}>
        Démarrer l’exercice matriciel
      </Button>

      {expected.length > 0 && step < expected.length && (
        <>
          <Text>
            Étape {step + 1} :{" "}
            {mode === "matrix"
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
                onChange={(e) => {
                  const newInputs = [...inputs];
                  newInputs[idx] = e.target.value;
                  setInputs(newInputs);
                }}
              />
            ))}
          </HStack>
          <Button colorScheme="teal" onClick={validate}>
            Valider
          </Button>
        </>
      )}

      {feedback && (
        <Badge colorScheme={feedback.startsWith("✅") ? "green" : "red"}>
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
