"use client";

import { useState, useMemo } from "react";
import {
  Box,
  VStack,
  Field,
  Input,
  NativeSelect,
  Separator,
  Text,
  Collapsible,
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom"
import type { Base } from "./logic/baseConversion";
import { convertWithSteps } from "./logic/conversionSteps";
import type { ConversionMethod } from "./logic/conversionSteps";

import { ResultInput } from "./components/ResultInput";
import { ConversionFeedbackPanel } from "./components/ConversionFeedbackPanel";
import { MethodGuide } from "./components/MethodGuide";

export default function ConverterSimulator() {
  const [input, setInput] = useState("101101.01");
  const [baseFrom, setBaseFrom] = useState<Base>(2);
  const [baseTo, setBaseTo] = useState<Base>(16);
  const [method, setMethod] = useState<ConversionMethod>("polynomial");

  const { output, steps } = useMemo(
    () => convertWithSteps(input, baseFrom, baseTo, method, 12),
    [input, baseFrom, baseTo, method]
  );

  const expectedDigits = useMemo(
    () => output.replace(".", "").split(""),
    [output]
  );
  const [proposed, setProposed] = useState<string[]>([]);

  const checks = useMemo(
    () => expectedDigits.map((d, i) => (proposed[i]?.toUpperCase() ?? "") === d),
    [expectedDigits, proposed]
  );

  const isFullyValidated = useMemo(
    () => checks.length > 0 && checks.every(Boolean),
    [checks]
  );

  return (
    <Box p={6} borderWidth={1} borderRadius="lg" shadow="md">
      
       <Flex>
        <Link
          to="/dash/courses/euclidean"
          color="blue.500"
        >
         ← Retour à la page précédente
        </Link>
      </Flex>
      <VStack align="stretch" gap={6}>
        {/* Input */}
        <Field.Root orientation="vertical">
          <Field.Label fontWeight="bold">Nombre à convertir</Field.Label>
          <Input value={input} onChange={(e) => setInput(e.target.value)} />
          <Field.HelperText>
            Saisis un nombre valide en base sélectionnée (lettres autorisées selon la base).
          </Field.HelperText>
        </Field.Root>

        {/* Base selectors */}
        <VStack align="stretch" gap={3}>
          <Field.Root>
            <Field.Label>Base source</Field.Label>
            <NativeSelect.Root size="sm">
              <NativeSelect.Field
                value={String(baseFrom)}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setBaseFrom(Number(e.currentTarget.value) as Base)
                }
              >
                <option value="2">2</option>
                <option value="8">8</option>
                <option value="10">10</option>
                <option value="16">16</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>

          <Field.Root>
            <Field.Label>Base cible</Field.Label>
            <NativeSelect.Root size="sm">
              <NativeSelect.Field
                value={String(baseTo)}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setBaseTo(Number(e.currentTarget.value) as Base)
                }
              >
                <option value="2">2</option>
                <option value="8">8</option>
                <option value="10">10</option>
                <option value="16">16</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>

          {/* Sélecteur de méthode */}
          <Field.Root>
            <Field.Label>Méthode de conversion</Field.Label>
            <NativeSelect.Root size="sm">
              <NativeSelect.Field
                value={method}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setMethod(e.currentTarget.value as ConversionMethod)
                }
              >
                <option value="polynomial">Développement polynomiale</option>
                <option value="division">Divisions successives</option>
                <option value="multiplication">Multiplications successives</option>
                <option value="grouping">Regroupement de bits</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
        </VStack>

        {/* ✅ Fiche interactive */}
        <MethodGuide method={method} />

        <Separator />

        {/* Learner input with immediate feedback */}
        <Text fontWeight="bold">Propose ton résultat (colonne par colonne)</Text>
        <ResultInput
          expected={expectedDigits}
          proposed={proposed}
          onChange={setProposed}
          base={baseTo}
        />

        {/* Résultat et explication : affichés uniquement après validation */}
        <Collapsible.Root open={isFullyValidated}>
          <Collapsible.Content>
            <Box mt={4} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
              <Text fontWeight="bold">✅ Résultat attendu (base {baseTo})</Text>
              <Text>{output}</Text>

              <ConversionFeedbackPanel steps={steps} checks={checks} />
            </Box>
          </Collapsible.Content>
        </Collapsible.Root>

        {!isFullyValidated && (
          <Text fontStyle="italic" color="gray.500">
            Valide toutes les colonnes pour révéler le résultat et l’explication.
          </Text>
        )}
      </VStack>
    </Box>
  );
}
