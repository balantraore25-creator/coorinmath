"use client"

import { Box, Heading, Text, VStack, HStack, Icon } from "@chakra-ui/react"
import { FaEquals, FaExclamationTriangle } from "react-icons/fa"
import { LuCircleCheck } from "react-icons/lu"

const CongruencePropertiesList = () => {
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
        <Icon as={FaEquals} boxSize={5} color="blue.500" />
        <Heading as="h2" size="md">
          Propriétés des congruences
        </Heading>
      </HStack>

      {/* Introduction */}
      <Text mb={4}>
        Soient <b>a ≡ b mod n</b> et <b>c ≡ d mod n</b>. Les congruences respectent plusieurs opérations fondamentales :
      </Text>

      {/* Propriétés avec exemples */}
      <VStack align="start"  mb={4}>
        <Box>
          <HStack>
            <Icon as={LuCircleCheck} color="green.500" />
            <Text><b>Addition</b> : a + c ≡ b + d mod n</Text>
          </HStack>
          <Text fontStyle="italic" ps={6}>
            Exemple : 7 ≡ 2 mod 5 et 9 ≡ 4 mod 5 ⇒ 7 + 9 = 16 ≡ 6 ≡ 1 mod 5
          </Text>
        </Box>

        <Box>
          <HStack>
            <Icon as={LuCircleCheck} color="green.500" />
            <Text><b>Soustraction</b> : a − c ≡ b − d mod n</Text>
          </HStack>
          <Text fontStyle="italic" ps={6}>
            Exemple : 7 ≡ 2 mod 5 et 9 ≡ 4 mod 5 ⇒ 7 − 9 = −2 ≡ 3 mod 5
          </Text>
        </Box>

        <Box>
          <HStack>
            <Icon as={LuCircleCheck} color="green.500" />
            <Text><b>Multiplication</b> : a × c ≡ b × d mod n</Text>
          </HStack>
          <Text fontStyle="italic" ps={6}>
            Exemple : 7 × 9 = 63 ≡ 2 × 4 = 8 ⇒ 63 ≡ 8 ≡ 3 mod 5
          </Text>
        </Box>

        <Box>
          <HStack>
            <Icon as={LuCircleCheck} color="green.500" />
            <Text><b>Puissance</b> : aᵏ ≡ bᵏ mod n</Text>
          </HStack>
          <Text fontStyle="italic" ps={6}>
            Exemple : 3 ≡ 8 mod 5 ⇒ 3² = 9 ≡ 8² = 64 ⇒ 9 ≡ 64 ≡ 4 mod 5
          </Text>
        </Box>

        <Box>
          <HStack>
            <Icon as={LuCircleCheck} color="green.500" />
            <Text><b>Transitivité</b> : Si a ≡ b mod n et b ≡ c mod n, alors a ≡ c mod n</Text>
          </HStack>
          <Text fontStyle="italic" ps={6}>
            Exemple : 12 ≡ 2 mod 5 et 2 ≡ 7 mod 5 ⇒ 12 ≡ 7 mod 5
          </Text>
        </Box>

        <Box>
          <HStack>
            <Icon as={LuCircleCheck} color="green.500" />
            <Text><b>Symétrie</b> : Si a ≡ b mod n, alors b ≡ a mod n</Text>
          </HStack>
          <Text fontStyle="italic" ps={6}>
            Exemple : Si 14 ≡ 4 mod 10 ⇒ 4 ≡ 14 mod 10
          </Text>
        </Box>

        <Box>
          <HStack >
            <Icon as={LuCircleCheck} color="green.500" />
            <Text><b>Réflexivité</b> : a ≡ a mod n</Text>
          </HStack>
          <Text fontStyle="italic" ps={6}>
            Exemple : 11 ≡ 11 mod 7
          </Text>
        </Box>
      </VStack>

      {/* Attention sur la division */}
      <HStack mb={2}>
        <Icon as={FaExclamationTriangle} color="orange.500" />
        <Text fontWeight="bold">Attention à la division</Text>
      </HStack>

      <Text>
        On ne peut simplifier une congruence par un facteur que si ce facteur est <b>inversible modulo n</b>, c’est-à-dire si <b>pgcd(x, n) = 1</b>.
      </Text>

      <Text fontStyle="italic" mt={2}>
        Exemple : 4a ≡ 4b mod 12 ❌ car pgcd(4, 12) = 4 ⇒ simplification interdite
      </Text>
    </Box>
  )
}

export default CongruencePropertiesList
