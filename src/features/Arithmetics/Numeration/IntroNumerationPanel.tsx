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
import { FaBookOpen } from "react-icons/fa"
import { LuLightbulb, LuCircleCheck } from "react-icons/lu"

const IntroNumerationPanel = () => {
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
      <VStack align="start" gap={4}>
        {/* Titre */}
        <HStack gap={2}>
          <Icon as={FaBookOpen} boxSize={5} color="blue.500" />
          <Heading as="h2" size="md">
            Introduction à la numération
          </Heading>
        </HStack>

        {/* Définition */}
        <Text>
          La numération est l’ensemble des règles permettant d’écrire et de représenter les nombres.
          Elle peut être <b>positionnelle</b> (comme notre système décimal) ou <b>additive</b> (comme les chiffres romains).
        </Text>

        <Separator orientation="horizontal" colorPalette="gray" />

        {/* Objectifs */}
        <HStack gap={2}>
          <Icon as={LuLightbulb} color="yellow.500" />
          <Text fontWeight="bold">Objectifs du module</Text>
        </HStack>

        <List.Root gap="2" variant="plain" align="start" ps={4}>
          <List.Item>
            <List.Indicator asChild color="green.500">
              <LuCircleCheck />
            </List.Indicator>
            Comprendre les systèmes de numération historiques et modernes
          </List.Item>
          <List.Item>
            <List.Indicator asChild color="green.500">
              <LuCircleCheck />
            </List.Indicator>
            Identifier les bases numériques (binaire, décimal, hexadécimal)
          </List.Item>
          <List.Item>
            <List.Indicator asChild color="green.500">
              <LuCircleCheck />
            </List.Indicator>
            Appliquer les conversions entre bases
          </List.Item>
        </List.Root>

        <Separator orientation="horizontal" colorPalette="gray" />

        {/* Aperçu des systèmes */}
        <Heading size="sm" color="gray.700">
          Aperçu des systèmes
        </Heading>
        <Text>
          Le système <b>décimal</b> utilise 10 chiffres (0 à 9) et repose sur les puissances de 10.
          Le système <b>binaire</b>, utilisé en informatique, repose sur les puissances de 2.
          D’autres systèmes comme <b>l’octal</b> (base 8) et <b>l’hexadécimal</b> (base 16) sont également utilisés pour simplifier le codage.
        </Text>
      </VStack>
    </Box>
  )
}

export default IntroNumerationPanel
