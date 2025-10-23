"use client"

import { Box, Heading, Text, VStack, HStack, Icon } from "@chakra-ui/react"
import { List } from "@chakra-ui/react"
import { LuLightbulb, LuCircleCheck } from "react-icons/lu"
import { FaBookOpen, FaTools } from "react-icons/fa"

const DefinitionPanel = () => {
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
        <Icon as={FaBookOpen} boxSize={5} color="blue.500" />
        <Heading as="h2" size="md">
          Définition de la congruence
        </Heading>
      </HStack>

      {/* Énoncé */}
      <Text mb={4}>
        On dit que <b>a</b> est congru à <b>b</b> modulo <b>n</b>, et on écrit :
        <br />
        <b>a ≡ b (mod n)</b>
      </Text>

      {/* Interprétation */}
      <HStack  mb={2}>
        <Icon as={LuLightbulb} color="yellow.500" />
        <Text fontWeight="bold">Interprétation</Text>
      </HStack>

      <List.Root as="ol" ps="4"  mb={4}>
        <List.Item>
          <b>Arithmétique</b> : <b>a</b> et <b>b</b> ont le même reste dans la division par <b>n</b>.
        </List.Item>
        <List.Item>
          <b>Algébrique</b> : <b>a</b> et <b>b</b> appartiennent à la même classe de congruence modulo <b>n</b>.
        </List.Item>
        <List.Item>
          <b>Géométrique</b> : Sur un cercle divisé en <b>n</b> parts, <b>a</b> et <b>b</b> tombent sur la même position.
        </List.Item>
      </List.Root>

      {/* Méthodes */}
      <HStack  mb={2}>
        <Icon as={FaTools} color="orange.500" />
        <Text fontWeight="bold">Méthodes</Text>
      </HStack>

      <Text mb={2}>
        Pour montrer que <b>a ≡ b (mod n)</b>, on peut utiliser <b>l'une des trois méthodes suivantes</b> :
      </Text>

      <List.Root as="ol" ps="4"  mb={4}>
        <List.Item>
          🛠️ <b>Par soustraction</b> : Calcule <b>a - b</b>, puis divise par <b>n</b>. Si <b>n</b> divise <b>(a - b)</b>, alors <b>a ≡ b (mod n)</b>.
        </List.Item>
        <List.Item>
          🛠️ <b>Par division euclidienne</b> : Si <b>a mod n = b mod n</b>, alors <b>a ≡ b (mod n)</b>.
        </List.Item>
        <List.Item>
          🛠️ <b>Par égalité</b> : Trouver un entier <b>k</b> tel que <b>a = b + kn</b>.
        </List.Item>
      </List.Root>

      {/* Exemple */}
      <HStack  mb={2}>
        <Icon as={LuCircleCheck} color="green.500" />
        <Text fontWeight="bold">Exemple</Text>
      </HStack>

      <Text mb={2}>
        Montrer que <b>37 ≡ 5 (mod 8)</b>
      </Text>

      <VStack align="start">
        <Text>• 37 − 5 = 32, 32 ÷ 8 = 4 donc <b>37 ≡ 5 (mod 8)</b></Text>
        <Text>• 37 mod 8 = 5, 5 mod 8 = 5 donc <b>37 ≡ 5 (mod 8)</b></Text>
        <Text>• 37 = 5 + 4 × 8 donc <b>37 ≡ 5 (mod 8)</b></Text>
      </VStack>
    </Box>
  )
}

export default DefinitionPanel




/*import { Box, Text, Stack } from "@chakra-ui/react"
import { List } from "@chakra-ui/react"

export const DefinitionPanel = () => {
  return (
    <Box fontFamily="Latin Modern Math" p={4}>
      <Text fontWeight="500" mb={2}>
        On dit que <b>a</b> est congru à <b>b</b> modulo <b>n</b>, et on écrit :
        <br />
        <b>a ≡ b (mod n)</b>
      </Text>

      <Text mt={4}>
        <b>Interprétation</b>
      </Text>

      <List.Root as="ol" ps="4" mt={2}>
        <List.Item>
          <b>Arithmétique</b> : <b>a</b> et <b>b</b> ont le même reste dans la division par <b>n</b>.
        </List.Item>
        <List.Item>
          <b>Algébrique</b> : <b>a</b> et <b>b</b> appartiennent à la même classe de congruence modulo <b>n</b>.
        </List.Item>
        <List.Item>
          <b>Géométrique</b> : Sur un cercle divisé en <b>n</b> parts, <b>a</b> et <b>b</b> tombent sur la même position.
        </List.Item>
      </List.Root>

      <Text mt={6}>
        Pour montrer que <b>a ≡ b (mod n)</b>, on peut utiliser <b>l'une des trois méthodes suivantes</b> :
      </Text>

      <Text mt={2}>
        <b>Méthodes</b>
      </Text>

      <List.Root as="ol" ps="4" mt={2}>
        <List.Item>
          🛠️ <b>Par soustraction</b> : Calcule <b>a - b</b>, puis divise par <b>n</b>. Si <b>n</b> divise <b>(a - b)</b>, alors <b>a ≡ b (mod n)</b>.
        </List.Item>
        <List.Item>
          🛠️ <b>Par division euclidienne</b> : Si <b>a mod n = b mod n</b>, alors <b>a ≡ b (mod n)</b>.
        </List.Item>
        <List.Item>
          🛠️ <b>Par égalité</b> : Trouver un entier <b>k</b> tel que <b>a = b + kn</b>.
        </List.Item>
      </List.Root>

      <Text mt={6}>
        <b>Exemple</b> : Montrer que <b>37 ≡ 5 (mod 8)</b>
      </Text>

      <Stack mt={2}>
        <Text>
          37 - 5 = 32, 32 ÷ 8 = 4 donc <b>37 ≡ 5 (mod 8)</b>
        </Text>
        <Text>
          37 mod 8 = 5, 5 mod 8 = 5 donc <b>37 ≡ 5 (mod 8)</b>
        </Text>
        <Text>
          37 = 5 + 4 × 8 donc <b>37 ≡ 5 (mod 8)</b>
        </Text>
      </Stack>
    </Box>
  )
}*/
