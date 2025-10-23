"use client"

import { Box, Heading, Text, VStack, HStack, Icon } from "@chakra-ui/react"
import { List } from "@chakra-ui/react"
import { FaBookOpen } from "react-icons/fa"
import { LuLightbulb, LuCircleCheck } from "react-icons/lu"

const PgcdPpmcPropertiesList = () => {
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
          Propriétés du PGCD et du PPCM
        </Heading>
      </HStack>

      {/* Propriétés */}
      <HStack mb={2}>
        <Icon as={LuLightbulb} color="yellow.500" />
        <Text fontWeight="bold">Propriétés fondamentales avec exemples</Text>
      </HStack>

      <List.Root as="ul" ps="4" mb={4}>
        <List.Item>
          🔁 <b>Symétrie</b> :  
          <br />
          PGCD(a, b) = PGCD(b, a)  
          <br />
          Exemple : PGCD(24, 18) = PGCD(18, 24) = <b>6</b>
        </List.Item>

        <List.Item>
          🔗 <b>Relation multiplicative</b> :  
          <br />
          PGCD(a, b) × PPCM(a, b) = a × b  
          <br />
          Exemple : PGCD(18, 24) = 6, PPCM = 72 → 6 × 72 = 432 = 18 × 24 ✅
        </List.Item>

        <List.Item>
          🧩 <b>PGCD(a, b) = 1</b> ⇔ a et b sont <b>premiers entre eux</b>  
          <br />
          Exemple : PGCD(9, 25) = 1 → 9 et 25 sont premiers entre eux
        </List.Item>

        <List.Item>
          🧠 <b>Théorème de Bézout</b> :  
          <br />
          Il existe u, v tels que a·u + b·v = PGCD(a, b)  
          <br />
          Exemple : PGCD(30, 18) = 6  
          <br />
          → 30·(−1) + 18·2 = −30 + 36 = <b>6</b>
        </List.Item>

        <List.Item>
          🧮 <b>PPCM(a, b) ≥ max(a, b)</b>  
          <br />
          Exemple : PPCM(12, 20) = 60 ≥ max(12, 20) = 20
        </List.Item>

        <List.Item>
          ⚡ Si a et b sont premiers entre eux → PPCM(a, b) = a × b  
          <br />
          Exemple : PGCD(7, 10) = 1 → PPCM = 7 × 10 = <b>70</b>
        </List.Item>
      </List.Root>

      {/* Vérification synthétique */}
      <HStack mb={2}>
        <Icon as={LuCircleCheck} color="green.500" />
        <Text fontWeight="bold">Résumé visuel</Text>
      </HStack>

      <VStack align="start">
        <Text>• PGCD(18, 24) = 6</Text>
        <Text>• PPCM(18, 24) = 72</Text>
        <Text>• 18 × 24 = 432 = 6 × 72 ✅</Text>
        <Text>• PGCD(9, 25) = 1 → premiers entre eux</Text>
        <Text>• PPCM(7, 10) = 70 car PGCD = 1</Text>
      </VStack>
    </Box>
  )
}

export default PgcdPpmcPropertiesList
