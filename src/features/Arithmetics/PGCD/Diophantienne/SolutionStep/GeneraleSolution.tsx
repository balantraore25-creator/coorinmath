// src/features/Arithmetics/PGCD/Diophantienne/SolutionStep/GeneraleSolution.tsx

import {
  VStack,
  Text,
  Code,
  Table,
  Button,
  HStack,
  Box,
  NumberInput,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useEffect, useMemo, useState } from "react";
import { bezoutCoefficients } from "../utils/bezout";

// Props: on passe (a, b, c) bruts
export interface GeneraleSolutionProps {
  a: number;
  b: number;
  c: number;
}

// Animations
const pulse = keyframes`
  0% { background-color: rgba(0, 200, 150, 0.1); }
  50% { background-color: rgba(0, 200, 150, 0.3); }
  100% { background-color: rgba(0, 200, 150, 0.1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const GeneraleSolution = ({ a, b, c }: GeneraleSolutionProps) => {
  // Réduction canonique
  const d = useMemo(() => {
    const gcd = (x: number, y: number): number => (y === 0 ? Math.abs(x) : gcd(y, x % y));
    return gcd(a, b);
  }, [a, b]);

  const hasSolution = c % d === 0;
  const aPrime = a / d;
  const bPrime = b / d;
  const cPrimeInit = c / d;

  // Bézout sur (a', b') → a' u + b' v = 1
  const { u, v, d: dBezout, steps } = useMemo(() => bezoutCoefficients(aPrime, bPrime), [aPrime, bPrime]);

  // Sanity: dBezout doit être 1
  const isNormalized = dBezout === 1;

  // Solution particulière pour c' (si solution existe)
  const x0 = isNormalized && hasSolution ? u * cPrimeInit : NaN;
  const y0 = isNormalized && hasSolution ? v * cPrimeInit : NaN;

  // Animation
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Inputs élève pour lecture des coefficients de Bézout de l’équation normalisée
  const [xInput, setXInput] = useState<string>("");
  const [yInput, setYInput] = useState<string>("");

  // Validation sur l’équation normalisée a' x + b' y = 1
  const validBezout =
    xInput !== "" &&
    yInput !== "" &&
    aPrime * Number(xInput) + bPrime * Number(yInput) === 1;

  // Choix dynamique de c′
  const [cPrime, setCPrime] = useState<number>(cPrimeInit);

  useEffect(() => {
    if (!playing) return;
    if (activeIndex >= steps.length - 1) return;
    const timer = setTimeout(() => {
      setActiveIndex((i) => Math.min(i + 1, steps.length - 1));
    }, 1500);
    return () => clearTimeout(timer);
  }, [playing, activeIndex, steps.length]);

  return (
    <VStack align="stretch" gap={4}>
      <Text fontWeight="bold">Réduction et solution générale</Text>

      {!hasSolution && (
        <Text color="red.600" fontWeight="bold">
          Pas de solution car pgcd({a}, {b}) = {d} ne divise pas {c}.
        </Text>
      )}

      {hasSolution && (
        <>
          <Text>
            On réduit l’équation en divisant par d = pgcd({a}, {b}) = {d} :
            <Code> {a}x + {b}y = {c} </Code> devient
            <Code> {aPrime}x + {bPrime}y = {cPrimeInit} </Code> avec
            <Code> pgcd({aPrime}, {bPrime}) = 1</Code>.
          </Text>

          <Text>
            On calcule des coefficients de Bézout <Code>(u, v)</Code> tels que
            <Code> {aPrime}·u + {bPrime}·v = 1</Code>. Une solution particulière est
            <Code> (x₀, y₀) = ({u}·{cPrimeInit}, {v}·{cPrimeInit}) = ({x0}, {y0})</Code>.
          </Text>

          {/* Tableau animé des étapes (sur a', b') */}
          <Table.Root variant="outline" size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Étape</Table.ColumnHeader>
                <Table.ColumnHeader>Division</Table.ColumnHeader>
                <Table.ColumnHeader>Matrice élémentaire</Table.ColumnHeader>
                <Table.ColumnHeader>Produit cumulatif</Table.ColumnHeader>
                <Table.ColumnHeader>Remontée</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {steps.map((s, i) => (
                <Box
                  as={Table.Row}
                  key={i}
                  css={{
                    animation: `${fadeIn} 0.6s ease forwards`,
                    animationDelay: `${i * 0.2}s`,
                    ...(i === activeIndex && { animation: `${pulse} 1.6s infinite` }),
                  }}
                >
                  <Table.Cell>{i + 1}</Table.Cell>
                  <Table.Cell>{s.division}</Table.Cell>
                  <Table.Cell>{s.matrix}</Table.Cell>
                  <Table.Cell>{s.product}</Table.Cell>
                  <Table.Cell>{s.remontee}</Table.Cell>
                </Box>
              ))}
            </Table.Body>
          </Table.Root>

          {/* Contrôles */}
          <HStack>
            <Button
              size="sm"
              colorScheme={playing ? "red" : "green"}
              onClick={() => setPlaying((p) => !p)}
            >
              {playing ? "Pause" : "Lecture"}
            </Button>
            <Button size="sm" onClick={() => setActiveIndex(0)} disabled={playing}>
              Réinitialiser
            </Button>
          </HStack>

          {/* Lecture interactive de Bézout sur (a', b') */}
          <Box>
            <Text fontWeight="bold">Lecture des coefficients de Bézout (normalisée) :</Text>
            <HStack>
              <Text>u =</Text>
              <NumberInput.Root
                size="sm"
                value={xInput}
                onValueChange={(details) => setXInput(details.value)}
              >
                <NumberInput.Input />
              </NumberInput.Root>

              <Text>, v =</Text>
              <NumberInput.Root
                size="sm"
                value={yInput}
                onValueChange={(details) => setYInput(details.value)}
              >
                <NumberInput.Input />
              </NumberInput.Root>
            </HStack>

            <Text mt={2}>
              {aPrime}({xInput || "?"}) + {bPrime}({yInput || "?"}) = {validBezout ? 1 : "?"}
            </Text>
            {validBezout && (
              <Text color="green.600" fontWeight="bold">
                ✅ Correct : {aPrime}·{xInput} + {bPrime}·{yInput} = 1
              </Text>
            )}
          </Box>

          {/* Adaptation pour c′ */}
          <Box>
            <Text fontWeight="bold">Adaptation pour un c′ :</Text>
            <HStack>
              <Text>c′ =</Text>
              <NumberInput.Root
                size="sm"
                value={String(cPrime)}
                onValueChange={(details) => setCPrime(Number(details.value))}
              >
                <NumberInput.Input />
              </NumberInput.Root>
            </HStack>

            <Text mt={2}>
              {aPrime}({u}·{cPrime}) + {bPrime}({v}·{cPrime}) = {cPrime}
            </Text>
          </Box>

          {/* Solution générale (sur a', b', c') */}
          <Table.Root variant="outline" size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Objet</Table.ColumnHeader>
                <Table.ColumnHeader>Expression</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell fontWeight="bold">Solution particulière</Table.Cell>
                <Table.Cell>
                  <Code>(x₀, y₀) = ({x0}, {y0})</Code> pour{" "}
                  <Code>
                    {aPrime}x + {bPrime}y = {cPrimeInit}
                  </Code>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell fontWeight="bold">Solution générale</Table.Cell>
                <Table.Cell>
                  <Code>x = {x0} + {bPrime}·t</Code>,{" "}
                  <Code>y = {y0} - {aPrime}·t</Code>, <Code>t ∈ ℤ</Code>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>

          <Text color="teal.600" fontStyle="italic">
            La résolution se fait sur l’équation normalisée {aPrime}x + {bPrime}y = {cPrimeInit} avec pgcd({aPrime}, {bPrime}) = 1.
          </Text>
        </>
      )}
    </VStack>
  );
};
