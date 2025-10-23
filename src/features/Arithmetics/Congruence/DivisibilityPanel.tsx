"use client"

import { Box, Heading, Text, VStack, HStack, Icon } from "@chakra-ui/react"
import { FaDivide, FaBookOpen, FaTools, FaExclamationTriangle } from "react-icons/fa"
import { LuCircleCheck } from "react-icons/lu"

const DivisibilitePanel = () => {
  return (
    <Box
      px="6"
      py="4"
      borderRadius="md"
      bg="gray.50"
      _dark={{ bg: "gray.800" }}
      boxShadow="md"
      fontFamily="Latin Modern Math"
    >
      {/* Titre */}
      <HStack  mb={4}>
        <Icon as={FaDivide} boxSize={5} color="blue.500" />
        <Heading as="h2" size="md">
          Divisibilité — Fondamentaux
        </Heading>
      </HStack>

      {/* Définition */}
      <Text mb={4}>
        On dit que <b>a</b> est divisible par <b>b</b> (noté <b>b ∣ a</b>) s’il existe un entier <b>k</b> tel que :
        <br />
        <b>a = bk</b>
      </Text>

      {/* Propriétés */}
      <HStack  mb={2}>
        <Icon as={FaBookOpen} color="blue.500" />
        <Text fontWeight="bold">Propriétés fondamentales</Text>
      </HStack>

      <VStack align="start"  mb={4}>
        <Box>
          <HStack >
            <Icon as={LuCircleCheck} color="green.500" />
            <Text><b>Réflexivité</b> : a ∣ a</Text>
          </HStack>
          <Text fontStyle="italic" ps={6}>Exemple : 7 ∣ 7</Text>
        </Box>

        <Box>
          <HStack>
            <Icon as={LuCircleCheck} color="green.500" />
            <Text><b>Transitivité</b> : Si a ∣ b et b ∣ c, alors a ∣ c</Text>
          </HStack>
          <Text fontStyle="italic" ps={6}>Exemple : 2 ∣ 4 et 4 ∣ 8 ⇒ 2 ∣ 8</Text>
        </Box>

        <Box>
          <HStack>
            <Icon as={LuCircleCheck} color="green.500" />
            <Text><b>Antisymétrie</b> : Si a ∣ b et b ∣ a, alors a = ±b</Text>
          </HStack>
          <Text fontStyle="italic" ps={6}>Exemple : 5 ∣ 5 et 5 ∣ 5 ⇒ a = b</Text>
        </Box>

        <Box>
          <HStack>
            <Icon as={LuCircleCheck} color="green.500" />
            <Text><b>Combinaison linéaire</b> : Si d ∣ a et d ∣ b, alors d ∣ (au + bv)</Text>
          </HStack>
          <Text fontStyle="italic" ps={6}>Exemple : 3 ∣ 6 et 3 ∣ 9 ⇒ 3 ∣ (6×2 + 9×1 = 21)</Text>
        </Box>
      </VStack>

      {/* Méthodes */}
      <HStack  mb={2}>
        <Icon as={FaTools} color="orange.500" />
        <Text fontWeight="bold">Méthodes de vérification</Text>
      </HStack>

      <VStack align="start" mb={4}>
        <Text>🛠️ Par division : Si a ÷ b donne un entier, alors b ∣ a</Text>
        <Text>🛠️ Par égalité : Trouver k tel que a = bk</Text>
        <Text>🛠️ Par factorisation : Si a = b × k, alors b ∣ a</Text>
      </VStack>

      {/* Mise en garde */}
      <HStack  mb={2}>
        <Icon as={FaExclamationTriangle} color="red.500" />
        <Text fontWeight="bold">Attention</Text>
      </HStack>

      <Text>
        <b>0 ∣ 0</b> est vrai, mais <b>0 ∣ a</b> est faux si a ≠ 0.  
        La divisibilité par zéro est <b>toujours interdite</b> sauf pour 0 lui-même.
      </Text>
    </Box>
  )
}

export default DivisibilitePanel
