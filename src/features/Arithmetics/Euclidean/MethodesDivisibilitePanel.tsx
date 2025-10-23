"use client"

import React from "react"
import { Box, Heading, Text, VStack, HStack, Icon } from "@chakra-ui/react"
import { FaDivide, FaLightbulb, FaCodeBranch, FaSuperscript, FaPuzzlePiece } from "react-icons/fa"

const MethodesDivisibilitePanel: React.FC = () => {
  return (
    <Box
      px={6}
      py={4}
      borderRadius="md"
      bg="gray.50"
      _dark={{ bg: "gray.800" }}
      boxShadow="md"
      fontFamily="Latin Modern Math"
    >
      {/* Titre */}
      <HStack mb={4}>
        <Icon as={FaLightbulb} boxSize={5} color="teal.500" />
        <Heading as="h2" size="md">
          Méthodes pour établir une divisibilité
        </Heading>
      </HStack>

      <VStack align="start" gap={5}>
        {/* Définition */}
        <Box>
          <HStack>
            <Icon as={FaDivide} color="blue.500" />
            <Text fontWeight="bold">1. Par définition</Text>
          </HStack>
          <Text ps={6}>
            Montrer qu’il existe un entier <b>k</b> tel que <b>a = bk</b>.  
            <br />
            <i>Exemple : 45 = 5 × 9 ⇒ 5 ∣ 45</i>
          </Text>
        </Box>

        {/* Identité remarquable */}
        <Box>
          <HStack>
            <Icon as={FaSuperscript} color="purple.500" />
            <Text fontWeight="bold">2. Par identité remarquable</Text>
          </HStack>
          <Text ps={6}>
            Transformer l’expression en produit de facteurs.  
            <br />
            <i>Exemple : Résoudre <b>x² − y² = c</b></i>
            <br />
            Factorisation : <b>x² − y² = (x − y)(x + y)</b>
            <br />
            Si <b>c = x² − y²</b>, alors <b>c</b> est divisible par <b>x − y</b> et <b>x + y</b>
            <br />
            <b>Cas concret :</b> x = 7, y = 6 → x² − y² = 49 − 36 = 13  
            <br />
            Donc 13 = (7 − 6)(7 + 6) = 1 × 13 ⇒ divisible par 1 et 13
          </Text>
        </Box>

        {/* Disjonction de cas */}
        <Box>
          <HStack>
            <Icon as={FaPuzzlePiece} color="orange.500" />
            <Text fontWeight="bold">3. Par disjonction de cas</Text>
          </HStack>
          <Text ps={6}>
            Décomposer l’entier <b>n</b> selon <b>n = 3k + r</b> avec <b>r ∈ {'{0, 1, 2}'}</b>.  
            <br />
            <i>Exemple : Montrer que <b>n(n + 1)(n + 2)</b> est divisible par 3</i>
            <br /><br />
            <b>Cas 1 :</b> r = 0 → n = 3k  
            ⇒ n(n + 1)(n + 2) = 3k(3k + 1)(3k + 2)  
            ⇒ divisible par 3
            <br /><br />
            <b>Cas 2 :</b> r = 1 → n = 3k + 1  
            ⇒ (3k + 1)(3k + 2)(3k + 3)  
            ⇒ divisible par 3 car (3k + 3) est multiple de 3
            <br /><br />
            <b>Cas 3 :</b> r = 2 → n = 3k + 2  
            ⇒ (3k + 2)(3k + 3)(3k + 4)  
            ⇒ divisible par 3 car (3k + 3) est multiple de 3
            <br /><br />
            ✅ Tous les cas donnent une divisibilité par 3
          </Text>
        </Box>

        {/* Récurrence */}
        <Box>
          <HStack>
            <Icon as={FaCodeBranch} color="green.500" />
            <Text fontWeight="bold">4. Par récurrence</Text>
          </HStack>
          <Text ps={6}>
            Prouver la propriété pour un rang initial, puis montrer qu’elle est héréditaire.  
            <br />
            <i>Exemple : Montrer que <b>3ⁿ − 1</b> est divisible par 2</i>
            <br /><br />
            <b>Initialisation :</b> n = 1 → 3¹ − 1 = 2 ⇒ divisible par 2  
            <br />
            <b>Hérédité :</b> Supposons <b>3ᵏ − 1</b> divisible par 2  
            Montrons que <b>3ᵏ⁺¹ − 1 = 3 × 3ᵏ − 1</b> est aussi divisible par 2
            <br />
            On pose : <b>3ᵏ = 2m + 1</b> (impair) ⇒ 3ᵏ⁺¹ = 3 × (2m + 1) = 6m + 3  
            ⇒ 3ᵏ⁺¹ − 1 = 6m + 2 = 2(3m + 1) ⇒ divisible par 2
          </Text>
        </Box>
      </VStack>
    </Box>
  )
}

export default MethodesDivisibilitePanel
