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
import { FaTools } from "react-icons/fa"
import { LuCircleCheck, LuCircleDashed } from "react-icons/lu"

const ArithmetiqueDesBasesPanel = () => {
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
            Arithmétique des bases
          </Heading>
        </HStack>

        {/* Opérations binaires */}
        <Heading size="sm" color="gray.700">
          1. Opérations en binaire
        </Heading>
        <Text>
          Les opérations binaires suivent des règles simples :
          <br />
          <b>Addition</b> : 1 + 1 = 0 avec retenue 1
          <br />
          <b>Soustraction</b> : 0 − 1 = 1 avec emprunt
          <br />
          <b>Multiplication</b> : comme en base 10, mais avec des 0 et 1
        </Text>
        <List.Root gap="2" variant="plain" align="start" ps={4}>
          <List.Item>
            <List.Indicator asChild color="green.500">
              <LuCircleCheck />
            </List.Indicator>
            Addition : <code>1101 + 1011 = 11000</code>
          </List.Item>
          <List.Item>
            <List.Indicator asChild color="green.500">
              <LuCircleCheck />
            </List.Indicator>
            Soustraction : <code>10010 − 01101 = 01101</code>
          </List.Item>
          <List.Item>
            <List.Indicator asChild color="green.500">
              <LuCircleCheck />
            </List.Indicator>
            Multiplication : <code>110 × 101 = 11110</code>
          </List.Item>
        </List.Root>

        <Separator orientation="horizontal" colorPalette="gray" />

        {/* Débordements */}
        <Heading size="sm" color="gray.700">
          2. Détection et gestion des débordements
        </Heading>
        <Text>
          Le débordement se produit quand le résultat dépasse la capacité du registre.
          En complément à deux, il est détecté si le signe du résultat est incohérent.
        </Text>
        <List.Root gap="2" variant="plain" align="start" ps={4}>
          <List.Item>
            <List.Indicator asChild color="green.500">
              <LuCircleCheck />
            </List.Indicator>
            <code>11111111 + 00000001 = 00000000</code> → débordement ignoré
          </List.Item>
          <List.Item>
            <List.Indicator asChild color="green.500">
              <LuCircleCheck />
            </List.Indicator>
            <code>01111111 + 00000001</code> → débordement positif
          </List.Item>
          <List.Item>
            <List.Indicator asChild color="green.500">
              <LuCircleCheck />
            </List.Indicator>
            <code>10000000 + 10000000</code> → débordement négatif
          </List.Item>
        </List.Root>

        <Separator orientation="horizontal" colorPalette="gray" />

        {/* Algorithmes */}
        <Heading size="sm" color="gray.700">
          3. Algorithmes de calcul
        </Heading>
        <Text>
          Les algorithmes binaires permettent de simuler les opérations :
          <br />
          <b>Multiplication</b> : par décalage et addition
          <br />
          <b>Division euclidienne</b> : par soustractions successives
        </Text>
        <List.Root gap="2" variant="plain" align="start" ps={4}>
          <List.Item>
            <List.Indicator asChild color="green.500">
              <LuCircleCheck />
            </List.Indicator>
            Multiplie <code>1011 × 110</code> → <code>1000010</code>
          </List.Item>
          <List.Item>
            <List.Indicator asChild color="green.500">
              <LuCircleCheck />
            </List.Indicator>
            Divise <code>1101 ÷ 10</code> → quotient = <code>110</code>, reste = <code>1</code>
          </List.Item>
          <List.Item>
            <List.Indicator asChild color="gray.500">
              <LuCircleDashed />
            </List.Indicator>
            Implémente une fonction de division euclidienne en pseudo-code
          </List.Item>
        </List.Root>
      </VStack>
    </Box>
  )
}

export default ArithmetiqueDesBasesPanel
