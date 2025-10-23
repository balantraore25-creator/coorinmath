"use client"

import { Box, Heading, Text, VStack, HStack, Icon } from "@chakra-ui/react"
import { List } from "@chakra-ui/react"
import { LuLightbulb, LuCircleCheck } from "react-icons/lu"
import { FaBookOpen, FaTools } from "react-icons/fa"

const PgcdPpmcMethodsPanel = () => {
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
          Méthodes de calcul du PGCD et du PPCM
        </Heading>
      </HStack>

      {/* Interprétation */}
      <HStack mb={2}>
        <Icon as={LuLightbulb} color="yellow.500" />
        <Text fontWeight="bold">Interprétation</Text>
      </HStack>

      <List.Root as="ul" ps="4" mb={4}>
        <List.Item>
          <b>PGCD</b> : Le plus grand “bloc commun” que partagent <b>a</b> et <b>b</b>.
        </List.Item>
        <List.Item>
          <b>PPCM</b> : Le plus petit “terrain commun” sur lequel <b>a</b> et <b>b</b> peuvent se synchroniser.
        </List.Item>
        <List.Item>
          Relation fondamentale : <b>PGCD(a, b) × PPCM(a, b) = a × b</b>
        </List.Item>
      </List.Root>

      {/* Méthodes */}
      <HStack mb={2}>
        <Icon as={FaTools} color="orange.500" />
        <Text fontWeight="bold">Méthode 1 : Algorithme d’Euclide</Text>
      </HStack>

      <Text mb={2}>
        On effectue des divisions successives jusqu’à obtenir un reste nul. Le dernier reste non nul est le PGCD.
      </Text>

      <VStack align="start" mb={4}>
        <Text>Exemple : PGCD(252, 105)</Text>
        <Text>• 252 ÷ 105 = 2 reste 42</Text>
        <Text>• 105 ÷ 42 = 2 reste 21</Text>
        <Text>• 42 ÷ 21 = 2 reste 0</Text>
        <Text>✅ PGCD = <b>21</b></Text>
      </VStack>

      <HStack mb={2}>
        <Icon as={FaTools} color="orange.500" />
        <Text fontWeight="bold">Méthode 2 : Décomposition en facteurs premiers</Text>
      </HStack>

      <Text mb={2}>
        On décompose chaque nombre en produit de facteurs premiers.
        <br />
        • PGCD = produit des facteurs communs avec les plus petits exposants
        <br />
        • PPCM = produit de tous les facteurs avec les plus grands exposants
      </Text>

      <VStack align="start" mb={4}>
        <Text>Exemple : 18 = 2 × 3², 24 = 2³ × 3</Text>
        <Text>• PGCD = 2¹ × 3¹ = <b>6</b></Text>
        <Text>• PPCM = 2³ × 3² = <b>72</b></Text>
      </VStack>

      <HStack mb={2}>
        <Icon as={FaTools} color="orange.500" />
        <Text fontWeight="bold">Méthode 3 : Formule PPCM = (a × b) / PGCD</Text>
      </HStack>

      <Text mb={2}>
        Une fois le PGCD connu, on calcule le PPCM par la formule :
        <br />
        <b>PPCM(a, b) = (a × b) / PGCD(a, b)</b>
      </Text>

      <VStack align="start" mb={4}>
        <Text>Exemple : a = 18, b = 24, PGCD = 6</Text>
        <Text>• PPCM = (18 × 24) / 6 = 432 / 6 = <b>72</b></Text>
      </VStack>

      {/* Vérification */}
      <HStack mb={2}>
        <Icon as={LuCircleCheck} color="green.500" />
        <Text fontWeight="bold">Vérification</Text>
      </HStack>

      <Text>
        ✅ 18 × 24 = 432 = 6 × 72
      </Text>
    </Box>
  )
}

export default PgcdPpmcMethodsPanel
