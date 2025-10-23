// src/features/Arithmetics/PGCD/Diophantienne/SolutionStep/Matricielle.tsx

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
import { useEffect, useState } from "react";
import { bezoutCoefficients } from "../utils/bezout";

interface MatricielleProps {
  a1: number;
  b1: number;
  c1: number; // membre droit simplifié
}

// Animation pulse pour la ligne active
const pulse = keyframes`
  0% { background-color: rgba(0, 200, 150, 0.1); }
  50% { background-color: rgba(0, 200, 150, 0.3); }
  100% { background-color: rgba(0, 200, 150, 0.1); }
`;

// Animation fade-in pour apparition progressive
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Matricielle = ({ a1, b1, c1 }: MatricielleProps) => {
  const { u, v, d, steps } = bezoutCoefficients(a1, b1);

  const x0p = u * c1;
  const y0p = v * c1;

  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const [xInput, setXInput] = useState<string>("");
  const [yInput, setYInput] = useState<string>("");

  const valid = Number(xInput) === u && Number(yInput) === v;

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
      <Text fontWeight="bold">Méthode matricielle (unimodulaire)</Text>
      <Text>
        L’algorithme d’Euclide se traduit par des matrices élémentaires de déterminant ±1.
        En les composant, on obtient une matrice U telle que
        <Code> U · (a1, b1)^T = (1, 0)^T</Code>.
        La première ligne de U donne un couple <Code>(u, v)</Code> vérifiant
        <Code> {a1}·u + {b1}·v = 1</Code>.
      </Text>

      {/* Tableau animé des étapes */}
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
                ...(i === activeIndex && {
                  animation: `${pulse} 1.6s infinite`,
                }),
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

      {/* Contrôles auto-play */}
      <HStack>
        <Button
          size="sm"
          colorScheme={playing ? "red" : "green"}
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? "Pause" : "Lecture"}
        </Button>
        <Button
          size="sm"
          onClick={() => setActiveIndex(0)}
          disabled={playing}
        >
          Réinitialiser
        </Button>
      </HStack>

      {/* Lecture interactive des coefficients de Bézout */}
      <Box>
        <Text fontWeight="bold">Lecture des coefficients de Bézout :</Text>
        <HStack>
          <Text>x₀ =</Text>
          <NumberInput.Root
            size="sm"
            value={xInput}
            onValueChange={(details) => setXInput(details.value)}
          >
            <NumberInput.Input />
          </NumberInput.Root>

          <Text>, v₀ =</Text>
          <NumberInput.Root
            size="sm"
            value={yInput}
            onValueChange={(details) => setYInput(details.value)}
          >
            <NumberInput.Input />
          </NumberInput.Root>
        </HStack>

        <Text mt={2}>
          {a1}({xInput || "?"}) + {b1}({yInput || "?"}) = {valid ? d : "?"}
        </Text>
        {valid && (
          <Text color="green.600" fontWeight="bold">
            ✅ Correct : {a1}·{u} + {b1}·{v} = {d}
          </Text>
        )}
      </Box>

      {/* Adaptation au cas général */}
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
              <Code>(x₀′, y₀′) = ({x0p}, {y0p})</Code> pour <Code>{a1}x + {b1}y = {c1}</Code>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell fontWeight="bold">Solution générale</Table.Cell>
            <Table.Cell>
              <Code>x = {x0p} + {b1}·t</Code>, <Code>y = {y0p} - {a1}·t</Code>, <Code>t ∈ ℤ</Code>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>

      <Text color="teal.600" fontStyle="italic">
        Cette construction matricielle coïncide avec la remontée Euclide et les coefficients de Bézout.
      </Text>
    </VStack>
  );
};
