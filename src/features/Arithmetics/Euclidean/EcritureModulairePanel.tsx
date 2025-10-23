"use client"

import React from "react"
import { Box, Heading, Text, VStack, HStack, Icon } from "@chakra-ui/react"
import { FaDivide, FaEquals, FaListOl } from "react-icons/fa"

const EcritureModulairePanel: React.FC = () => {
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
      {/* Titre */}
      <HStack mb={4}>
        <Icon as={FaListOl} boxSize={5} color="cyan.600" />
        <Heading as="h2" size="md">
          Écriture modulaire : restes possibles
        </Heading>
      </HStack>

      <VStack align="start" gap={5}>
        {/* Définition */}
        <Box>
          <HStack>
            <Icon as={FaDivide} color="blue.500" />
            <Text fontWeight="bold">Décomposition euclidienne</Text>
          </HStack>
          <Text ps={6}>
            Pour tout entier relatif <b>a</b> et tout entier naturel <b>b ≠ 0</b>,  
            il existe un unique couple <b>(q, r)</b> tel que :
            <br />
            <b>a = bq + r</b> avec <b>0 ≤ r &lt; b</b>
            <br />
            Le reste <b>r</b> est appelé le <b>représentant modulaire</b> de <b>a</b> modulo <b>b</b>.
          </Text>
        </Box>

        {/* Ensemble des restes */}
        <Box>
          <HStack>
            <Icon as={FaEquals} color="purple.500" />
            <Text fontWeight="bold">Restes possibles</Text>
          </HStack>
          <Text ps={6}>
            Les restes possibles dans la division euclidienne par <b>b</b> sont :
            <br />
            <b>{'{0, 1, 2, ..., b − 1}'}</b>
            <br />
            Chaque entier <b>a</b> est congru modulo <b>b</b> à un unique <b>r</b> dans cet ensemble.
            <br />
            On note : <b>a ≡ r mod b</b>
          </Text>
        </Box>

        {/* Exemples */}
        <Box>
          <HStack>
            <Icon as={FaEquals} color="green.500" />
            <Text fontWeight="bold">Exemples</Text>
          </HStack>
          <Text ps={6}>
            <b>Exemple 1 :</b> a = 17, b = 5  
            → 17 = 5 × 3 + 2 ⇒ <b>r = 2</b>  
            ⇒ <b>17 ≡ 2 mod 5</b>
            <br /><br />
            <b>Exemple 2 :</b> a = −8, b = 5  
            → −8 = 5 × (−2) + 2 ⇒ <b>r = 2</b>  
            ⇒ <b>−8 ≡ 2 mod 5</b>
          </Text>
        </Box>

        {/* Interprétation */}
        <Box>
          <HStack>
            <Icon as={FaListOl} color="orange.500" />
            <Text fontWeight="bold">Interprétation pédagogique</Text>
          </HStack>
          <Text ps={6}>
            L’écriture modulaire permet de regrouper les entiers selon leur reste.  
            Elle est essentielle pour :
            <ul style={{ paddingLeft: "1em" }}>
              <li>✔️ Simplifier les calculs en arithmétique</li>
              <li>✔️ Étudier les congruences</li>
              <li>✔️ Appliquer les critères de divisibilité</li>
            </ul>
          </Text>
        </Box>
      </VStack>
    </Box>
  )
}

export default EcritureModulairePanel
