"use client";

import { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Separator,
  Switch,
  Field,
  Input,
  Link
} from "@chakra-ui/react";

import EuclideanDivisionPanelDirect from "./EuclideanDivisionPanelDirect";
import EuclideanDivisionPanelProgressive from "./EuclideanDivisionPanelProgressive";

export default function EuclideanDivisionPanelUnified() {
  const [mode, setMode] = useState<"direct" | "progressive">("direct");
  const [a, setA] = useState("103");
  const [b, setB] = useState("13");

  return (
    <Box p={6} borderWidth={1} borderRadius="lg" shadow="md">
      <VStack align="stretch" gap={6}>
         <Link
                href="/dash/courses/euclidean"
                color="teal.500"
                fontWeight="medium"
                mb={4}
                display="inline-block"
              >
                ← Retour à la page précédente
              </Link>
        {/* En-tête + Toggle */}
        <HStack justify="space-between">
          <Text fontWeight="bold" fontSize="lg">
            Division euclidienne — Mode {mode === "direct" ? "Direct" : "Progressif"}
          </Text>
          <HStack gap={3} align="center">
            <Text
              fontSize="sm"
              fontWeight={mode === "direct" ? "bold" : "normal"}
              color={mode === "direct" ? "blue.500" : "gray.600"}
              transition="all 0.3s ease"
            >
              Direct
            </Text>

            <Switch.Root
              id="mode-switch"
              checked={mode === "progressive"}
              onCheckedChange={(details) =>
                setMode(details.checked ? "progressive" : "direct")
              }
              colorPalette={mode === "progressive" ? "green" : "blue"}
            >
              <Switch.HiddenInput />
              <Switch.Control transition="all 0.3s ease">
                <Switch.Thumb transition="all 0.3s ease" />
              </Switch.Control>
              <Switch.Label srOnly>Basculer le mode</Switch.Label>
            </Switch.Root>

            <Text
              fontSize="sm"
              fontWeight={mode === "progressive" ? "bold" : "normal"}
              color={mode === "progressive" ? "green.500" : "gray.600"}
              transition="all 0.3s ease"
            >
              Progressif
            </Text>
          </HStack>
        </HStack>

        {/* Paramètres communs a et b */}
        <VStack align="stretch" gap={4}>
          <Field.Root orientation="vertical">
            <Field.Label fontWeight="bold">a (dividende)</Field.Label>
            <Input value={a} onChange={(e) => setA(e.target.value)} />
            <Field.HelperText>Entier à diviser</Field.HelperText>
          </Field.Root>

          <Field.Root orientation="vertical">
            <Field.Label fontWeight="bold">b (diviseur)</Field.Label>
            <Input value={b} onChange={(e) => setB(e.target.value)} />
            <Field.HelperText>Entier non nul</Field.HelperText>
          </Field.Root>
        </VStack>

        <Separator />

        {/* Contenu selon le mode */}
        {mode === "direct" ? (
          <EuclideanDivisionPanelDirect a={a} b={b} />
        ) : (
          <EuclideanDivisionPanelProgressive a={a} b={b} />
        )}
      </VStack>
    </Box>
  );
}
