"use client"

import { Box, Heading, Text, VStack, HStack, Icon, List } from "@chakra-ui/react"
import { LuCircleCheck, LuCircleDashed } from "react-icons/lu"
import { FaBookOpen } from "react-icons/fa"

const BaseSystème = () => {
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
            Les bases des systèmes de numération
          </Heading>
        </HStack>

        {/* Introduction */}
        <Text>
          Un système de numération repose sur une base qui définit le nombre de symboles utilisés et la manière dont les
          valeurs sont combinées. Voici les principales bases étudiées :
        </Text>

        {/* Liste des bases */}
        <List.Root gap="2" variant="plain" align="start" ps={4}>
          <List.Item>
            <List.Indicator asChild color="green.500">
              <LuCircleCheck />
            </List.Indicator>
            <b>Base 10 (décimal)</b> : système courant avec les chiffres de 0 à 9
          </List.Item>

          <List.Item>
            <List.Indicator asChild color="green.500">
              <LuCircleCheck />
            </List.Indicator>
            <b>Base 2 (binaire)</b> : utilisée en informatique, avec les chiffres 0 et 1
          </List.Item>

          <List.Item>
            <List.Indicator asChild color="green.500">
              <LuCircleCheck />
            </List.Indicator>
            <b>Base 8 (octal)</b> : intermédiaire, utile pour simplifier le codage binaire
          </List.Item>

          <List.Item>
            <List.Indicator asChild color="green.500">
              <LuCircleCheck />
            </List.Indicator>
            <b>Base 16 (hexadécimal)</b> : compacte, utilisée pour représenter des octets (0–9, A–F)
          </List.Item>

          <List.Item>
            <List.Indicator asChild color="gray.500">
              <LuCircleDashed />
            </List.Indicator>
            <b>Autres bases</b> : base 3, base 12, base 60 (historique), parfois utilisées dans des contextes spécifiques
          </List.Item>
        </List.Root>
      </VStack>
    </Box>
  )
}

export default BaseSystème
