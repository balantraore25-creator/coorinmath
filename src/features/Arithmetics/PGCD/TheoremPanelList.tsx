"use client"

import { Box, Heading, Text, VStack, HStack, Icon } from "@chakra-ui/react"
import { List } from "@chakra-ui/react"
import { FaBookOpen } from "react-icons/fa"
import { LuLightbulb, LuCircleCheck } from "react-icons/lu"

const TheoremPanelList = () => {
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
      <HStack mb={4}>
        <Icon as={FaBookOpen} boxSize={5} color="blue.500" />
        <Heading as="h2" size="md">
          Théorèmes du PGCD et du PPCM
        </Heading>
      </HStack>

      {/* Théorème de Bézout */}
      <HStack mb={2}>
        <Icon as={LuLightbulb} color="yellow.500" />
        <Text fontWeight="bold">Théorème de Bézout</Text>
      </HStack>

      <Text mb={2}>
        Pour tous entiers naturels <b>a</b> et <b>b</b>, il existe des entiers <b>u</b> et <b>v</b> tels que :
        <br />
        <b>a·u + b·v = PGCD(a, b)</b>
      </Text>

      <VStack align="start" mb={4}>
        <Text>Exemple : PGCD(30, 18) = 6</Text>
        <Text>• 30·(−1) + 18·2 = −30 + 36 = <b>6</b></Text>
      </VStack>

      {/* Théorème de Gauss */}
      <HStack mb={2}>
        <Icon as={LuLightbulb} color="yellow.500" />
        <Text fontWeight="bold">Théorème de Gauss</Text>
      </HStack>

      <Text mb={2}>
        Si <b>a</b> divise <b>b·c</b> et si <b>a</b> est premier avec <b>b</b>, alors <b>a</b> divise <b>c</b>.
      </Text>

      <VStack align="start" mb={4}>
        <Text>Exemple : a = 5, b = 6, c = 10</Text>
        <Text>• 5 divise 6·10 = 60</Text>
        <Text>• PGCD(5, 6) = 1 → 5 est premier avec 6</Text>
        <Text>✅ Donc 5 divise 10</Text>
      </VStack>

      {/* Relation PGCD × PPCM */}
      <HStack mb={2}>
        <Icon as={LuLightbulb} color="yellow.500" />
        <Text fontWeight="bold">Relation PGCD × PPCM</Text>
      </HStack>

      <Text mb={2}>
        Pour tous entiers naturels <b>a</b> et <b>b</b> :
        <br />
        <b>PGCD(a, b) × PPCM(a, b) = a × b</b>
      </Text>

      <VStack align="start" mb={4}>
        <Text>Exemple : a = 18, b = 24</Text>
        <Text>• PGCD = 6, PPCM = 72</Text>
        <Text>• 6 × 72 = 432 = 18 × 24 ✅</Text>
      </VStack>

      {/* Résumé */}
      <HStack mb={2}>
        <Icon as={LuCircleCheck} color="green.500" />
        <Text fontWeight="bold">Résumé</Text>
      </HStack>

      <List.Root as="ul" ps="4">
        <List.Item>📐 Bézout : PGCD = combinaison linéaire de a et b</List.Item>
        <List.Item>📐 Gauss : divisibilité transmise si PGCD = 1</List.Item>
        <List.Item>📐 PGCD × PPCM = a × b</List.Item>
      </List.Root>
    </Box>
  )
}

export default TheoremPanelList
