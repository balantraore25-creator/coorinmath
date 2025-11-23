"use client"

import React, { useState } from "react"
import { Flex, Box, Heading, VStack, Text } from "@chakra-ui/react"
import Controls from "./components/Controls"
import type { Transformation } from "./components/Controls"

// ⚡ importe tous tes composants interactifs
import TranslationInteractive from "./components/Translation"
import HomothetyInteractive from "./components/homothety"
import RotationCenter from "./components/RotationCenter"
import RotationOrigin from "./components/RotationOrigin"
import SymmetryCenter from "./components/SymmetryCenter"
import SymmetryOrigin from "./components/SymmetryOrigin"
import SymmetryOblique from "./components/SymmetryOblique"
import Conjugate from "./components/Conjugate"

export default function Transform() {
  const [transformation, setTransformation] = useState<Transformation>("translation")

  // ✅ Utilise React.ReactNode pour éviter l’erreur TS2503
  const components: Record<Transformation, React.ReactNode> = {
    translation: <TranslationInteractive />,
    rotationOrigin: <RotationOrigin />,
    rotationCenter: <RotationCenter />,
    homothety: <HomothetyInteractive />,
    symmetryCenter: <SymmetryCenter />,
    symmetryOrigin: <SymmetryOrigin />,
    symmetryOblique: <SymmetryOblique />,
    conjugate: <Conjugate />,
  }

  return (
    <Flex direction="column" align="center" gap={10} p={6} w="full">
      {/* Titre principal */}
      <Heading size="lg" textAlign="center">
        Transformations dans le plan complexe
      </Heading>

      {/* Sélecteur de transformation */}
      <Box w={{ base: "full", md: "sm" }}>
        <Controls onSelect={setTransformation} />
      </Box>

      {/* Affichage dynamique du bon composant */}
      <VStack w="full" maxW="4xl" gap={8} align="center">
        {components[transformation] ?? (
          <Text>Choisis une transformation pour commencer</Text>
        )}
      </VStack>
    </Flex>
  )
}
