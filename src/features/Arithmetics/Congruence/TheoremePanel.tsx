"use client"

import { Box, Heading, Text, VStack, HStack, Icon, Code } from "@chakra-ui/react"
import { FaBookOpen } from "react-icons/fa"
import { LuLightbulb } from "react-icons/lu"
import { TheoremeCard } from "./TheoremeCard"

const TheoremePanel = () => (
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
        Théorèmes fondamentaux en congruence
      </Heading>
    </HStack>

    {/* Introduction */}
    <Text mb={4}>
      Ces théorèmes sont des piliers de l’arithmétique modulaire. Ils permettent de résoudre des équations, de sécuriser des systèmes cryptographiques, et d’établir des propriétés de divisibilité.
    </Text>

    {/* Liste des théorèmes */}
    <VStack align="start" mb={4}>
      <TheoremeCard
        title="Petit théorème de Fermat"
        statement={
          <>
            Si <Code>p</Code> est un nombre premier et <Code>a</Code> n’est pas divisible par <Code>p</Code>, alors <Code>a<sup>p−1</sup> ≡ 1 (mod p)</Code>
          </>
        }
        example="a = 3, p = 7 ⇒ 3⁶ = 729 ≡ 1 mod 7"
      />

      <TheoremeCard
        title="Théorème de Wilson"
        statement={
          <>
            Si <Code>p</Code> est premier, alors <Code>(p − 1)! ≡ −1 (mod p)</Code>
          </>
        }
        example="p = 5 ⇒ 4! = 24 ≡ −1 mod 5"
      />

      <TheoremeCard
        title="Identité de Bézout"
        statement={
          <>
            Pour tous entiers <Code>a</Code> et <Code>b</Code>, il existe <Code>u</Code> et <Code>v</Code> tels que <Code>au + bv = pgcd(a, b)</Code>
          </>
        }
        example="a = 12, b = 8 ⇒ pgcd = 4 ⇒ 12×(−1) + 8×2 = −12 + 16 = 4"
      />

      <TheoremeCard
        title="Théorème de Gauss (multiplication)"
        statement={
          <>
            Si <Code>a ≡ b (mod n)</Code>, alors <Code>ac ≡ bc (mod n)</Code> pour tout entier <Code>c</Code>.
          </>
        }
        example="4 ≡ 10 mod 6 ⇒ 4×3 = 12 ≡ 10×3 = 30 ≡ 0 mod 6"
      />

      <TheoremeCard
        title="Théorème de Gauss (réduction)"
        statement={
          <>
            Si <Code>g = pgcd(a, n)</Code> et <Code>g</Code> divise <Code>b</Code>, alors <Code>ax ≡ b (mod n)</Code> admet <Code>g</Code> solutions. On peut réduire l’équation : <Code>(a/g)x ≡ (b/g) (mod n/g)</Code>
          </>
        }
        example="6x ≡ 8 mod 14 ⇒ pgcd = 2 ⇒ 3x ≡ 4 mod 7 ⇒ x ≡ 6, 13 mod 14"
      />
    </VStack>

    {/* Remarque finale */}
    <HStack>
      <Icon as={LuLightbulb} color="yellow.500" />
      <Text>
        Ces théorèmes sont essentiels pour comprendre les fondements de la congruence, du PGCD, et des algorithmes cryptographiques comme RSA.
      </Text>
    </HStack>
  </Box>
)

export default TheoremePanel
