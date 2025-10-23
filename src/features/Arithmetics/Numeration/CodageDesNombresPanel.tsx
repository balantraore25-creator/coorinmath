"use client"

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Separator,
  List,
} from "@chakra-ui/react"
import { LuCircleCheck, LuCircleDashed } from "react-icons/lu"
import { FaTools } from "react-icons/fa"

const CodageDesNombresPanel = () => {
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
      <VStack align="start" gap={6}>
        {/* Titre */}
        <HStack gap={2}>
          <Icon as={FaTools} boxSize={5} color="orange.500" />
          <Heading as="h2" size="md">
            Codage des nombres
          </Heading>
        </HStack>

        {/* BCD */}
        <Heading size="sm" color="gray.700">
          1. Code BCD (Binary Coded Decimal)
        </Heading>
        <Text>
          Chaque chiffre décimal est codé sur 4 bits. Exemple : 59 → <code>0101 1001</code>.
        </Text>
        <List.Root gap="2" variant="plain" align="start" ps={4}>
          <List.Item>
            <List.Indicator asChild color="green.500">
              <LuCircleCheck />
            </List.Indicator>
            Convertir 27 → <code>0010 0111</code>
          </List.Item>
          <List.Item>
            <List.Indicator asChild color="green.500">
              <LuCircleCheck />
            </List.Indicator>
            Convertir 103 → <code>0001 0000 0011</code>
          </List.Item>
        </List.Root>

        <Separator orientation="horizontal" colorPalette="gray" />

        {/* Code 8421 */}
        <Heading size="sm" color="gray.700">
          2. Code 8421
        </Heading>
        <Text>
          Pondération des bits : 8, 4, 2, 1. Exemple : <code>0110</code> → 6.
        </Text>
        <List.Root gap="2" variant="plain" align="start" ps={4}>
          <List.Item>
            <List.Indicator asChild color="green.500">
              <LuCircleCheck />
            </List.Indicator>
            Décode <code>0111</code> → 7
          </List.Item>
          <List.Item>
            <List.Indicator asChild color="green.500">
              <LuCircleCheck />
            </List.Indicator>
            Décode <code>0011</code> → 3
          </List.Item>
        </List.Root>

        <Separator orientation="horizontal" colorPalette="gray" />

        {/* Complément à deux */}
        <Heading size="sm" color="gray.700">
          3. Complément à deux
        </Heading>
        <Text>
          Représente les entiers signés. Exemple : −5 → <code>11111011</code> sur 8 bits.
        </Text>
        <List.Root gap="2" variant="plain" align="start" ps={4}>
          <List.Item>
            <List.Indicator asChild color="green.500">
              <LuCircleCheck />
            </List.Indicator>
            +12 → <code>00001100</code>, −12 → <code>11110100</code>
          </List.Item>
          <List.Item>
            <List.Indicator asChild color="green.500">
              <LuCircleCheck />
            </List.Indicator>
            Vérifie que +5 + (−5) = 0 → <code>00000000</code>
          </List.Item>
        </List.Root>

        <Separator orientation="horizontal" colorPalette="gray" />

        {/* IEEE 754 */}
        <Heading size="sm" color="gray.700">
          4. Représentation des flottants (IEEE 754)
        </Heading>
        <Text>
          Format 32 bits : 1 bit signe, 8 bits exposant, 23 bits mantisse. Exemple : 5.75 → <code>0 10000001 011100...</code>
        </Text>
        <List.Root gap="2" variant="plain" align="start" ps={4}>
          <List.Item>
            <List.Indicator asChild color="green.500">
              <LuCircleCheck />
            </List.Indicator>
            Normalise 5.75 → <code>1.0111 × 2²</code>, exposant biaisé = 129 → <code>10000001</code>
          </List.Item>
          <List.Item>
            <List.Indicator asChild color="gray.500">
              <LuCircleDashed />
            </List.Indicator>
            Utilise un convertisseur IEEE 754 pour vérifier ton codage
          </List.Item>
        </List.Root>
      </VStack>
    </Box>
  )
}

export default CodageDesNombresPanel
