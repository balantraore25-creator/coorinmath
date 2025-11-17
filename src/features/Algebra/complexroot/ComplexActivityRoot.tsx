"use client";

import React, { useState } from "react";
import { Box, Text, VStack, Input, HStack, Button } from "@chakra-ui/react";
import { ComplexCanvasInteractive } from "./ComplexCanvasInteractive";
//import type { Point } from "../types";

export const ComplexActivityRoot: React.FC = () => {
  // États pour z et w
  const [zx, setZx] = useState<string>("");
  const [zy, setZy] = useState<string>("");
  const [wx, setWx] = useState<string>("");
  const [wy, setWy] = useState<string>("");

  const [validated, setValidated] = useState<boolean>(false);

  // Vérification bornes [-8, 8]
  const isValidInput =
    zx !== "" &&
    zy !== "" &&
    wx !== "" &&
    wy !== "" &&
    Math.abs(Number(zx)) <= 8 &&
    Math.abs(Number(zy)) <= 8 &&
    Math.abs(Number(wx)) <= 8 &&
    Math.abs(Number(wy)) <= 8;

  const handleValidate = () => {
    if (isValidInput) {
      setValidated(true);
    }
  };

  const handleReset = () => {
    setValidated(false);
    setZx("");
    setZy("");
    setWx("");
    setWy("");
  };

  return (
    <Box p={4}>
      <Text fontSize="lg" fontWeight="bold" mb={3}>
        Activité : Multiplication complexe
      </Text>

      {!validated ? (
        <>
          {/* Saisie de z */}
          <VStack align="start" gap={2} mb={4}>
            <Text>Entrez z = x + i y (bornes -8 ≤ x, y ≤ 8)</Text>
            <HStack>
              <Input
                type="number"
                value={zx}
                onChange={(e) => setZx(e.target.value)}
                width="80px"
                placeholder="x"
              />
              <Text> + i </Text>
              <Input
                type="number"
                value={zy}
                onChange={(e) => setZy(e.target.value)}
                width="80px"
                placeholder="y"
              />
            </HStack>
          </VStack>

          {/* Saisie de w */}
          <VStack align="start" gap={2} mb={4}>
            <Text>Entrez w = x' + i y' (bornes -8 ≤ x', y' ≤ 8)</Text>
            <HStack>
                            <Input
                type="number"
                value={wx}
                onChange={(e) => setWx(e.target.value)}
                width="80px"
                placeholder="x'"
              />
              <Text> + i </Text>
              <Input
                type="number"
                value={wy}
                onChange={(e) => setWy(e.target.value)}
                width="80px"
                placeholder="y'"
              />
            </HStack>
          </VStack>

          {/* Bouton de validation */}
          <Button
            colorScheme="blue"
            onClick={handleValidate}
            disabled={!isValidInput}
          >
            Valider z et w
          </Button>

          {/* Message d’avertissement */}
          {!isValidInput && (zx !== "" || zy !== "" || wx !== "" || wy !== "") && (
            <Box p={4} bg="yellow.100" borderRadius="md" mt={4}>
              <Text>
                ⚠️ Les valeurs doivent être saisies et rester entre -8 et +8 pour être visibles sur la grille.
              </Text>
            </Box>
          )}
        </>
      ) : (
        <>
          {/* ✅ Affichage des valeurs choisies */}
          <Box mb={4} p={2} bg="blue.50" borderRadius="md">
            <Text fontWeight="bold">
              z choisi : {zx} + i{zy}
            </Text>
            <Text fontWeight="bold">
              w choisi : {wx} + i{wy}
            </Text>
          </Box>

          {/* Canevas interactif */}
          <ComplexCanvasInteractive
            z={{ x: Number(zx), y: Number(zy) }}
            w={{ x: Number(wx), y: Number(wy) }}
          />

          {/* Bouton pour réinitialiser */}
          <Button mt={4} colorScheme="red" onClick={handleReset}>
            🔄 Changer z et w
          </Button>
        </>
      )}
    </Box>
  );
};







/*"use client";

import React, { useState } from "react";
import { Box, Text, VStack, Input, HStack, Button } from "@chakra-ui/react";
import { ComplexCanvasInteractive } from "./ComplexCanvasInteractive";
import type { Point } from "../types";

export const ComplexActivityRoot: React.FC = () => {
  const z: Point = { x: 1, y: 1 };

  const [wx, setWx] = useState<string>("");
  const [wy, setWy] = useState<string>("");
  const [validated, setValidated] = useState<boolean>(false);

  const isValidInput =
    wx !== "" &&
    wy !== "" &&
    Math.abs(Number(wx)) <= 8 &&
    Math.abs(Number(wy)) <= 8;

  const handleValidate = () => {
    if (isValidInput) {
      setValidated(true);
    }
  };

  const handleReset = () => {
    setValidated(false);
    setWx("");
    setWy("");
  };

  return (
    <Box p={4}>
      <Text fontSize="lg" fontWeight="bold" mb={3}>
        Activité : Multiplication complexe
      </Text>

      {!validated ? (
        <>
          <VStack align="start" gap={2} mb={4}>
            <Text>Entrez w = x' + i y' (bornes -8 ≤ x', y' ≤ 8)</Text>
            <HStack>
              <Input
                type="number"
                value={wx}
                onChange={(e) => setWx(e.target.value)}
                width="80px"
                placeholder="x'"
              />
              <Text> + i </Text>
              <Input
                type="number"
                value={wy}
                onChange={(e) => setWy(e.target.value)}
                width="80px"
                placeholder="y'"
              />
            </HStack>

            <Button
              colorScheme="blue"
              onClick={handleValidate}
              disabled={!isValidInput}
            >
              Valider w
            </Button>
          </VStack>

          {!isValidInput && (wx !== "" || wy !== "") && (
            <Box p={4} bg="yellow.100" borderRadius="md">
              <Text>⚠️ Les valeurs doivent rester entre -8 et +8 pour être visibles sur la grille.</Text>
            </Box>
          )}
        </>
      ) : (
        <>*/
          {/* ✅ Affichage de la valeur choisie */}
        /*  <Box mb={4} p={2} bg="blue.50" borderRadius="md">
            <Text fontWeight="bold">
              w choisi : {wx} + i{wy}
            </Text>
          </Box>

          <ComplexCanvasInteractive z={z} w={{ x: Number(wx), y: Number(wy) }} />

          <Button mt={4} colorScheme="red" onClick={handleReset}>
            🔄 Changer w
          </Button>
        </>
      )}
    </Box>
  );
};*/
