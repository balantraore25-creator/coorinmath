"use client";

import {
  Box,
  Text,
  HStack,
  Icon,
  Heading,
  List,
} from "@chakra-ui/react";
import { LuLightbulb, LuCircleCheck, LuCircleDashed } from "react-icons/lu";
import { FaBookOpen } from "react-icons/fa";

const DivisionPanel = () => {
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
          Division euclidienne des relatifs
        </Heading>
      </HStack>

      {/* Définition */}
      <Text mb={4}>
        Pour tout <b>a ∈ ℤ</b> et <b>b ∈ ℤ \\ {'{0}'}</b>, il existe un unique couple <b>(q, r) ∈ ℤ × ℕ</b> tel que :
        <br />
        <b>a = b × q + r</b> avec <b>0 ≤ r &lt; |b|</b>.
        <br />
        On appelle <b>q</b> le quotient et <b>r</b> le reste.
      </Text>

      {/* Interprétation */}
      <HStack mb={2}>
        <Icon as={LuLightbulb} color="yellow.500" />
        <Text fontWeight="bold">Interprétation</Text>
      </HStack>
      <List.Root gap="2" variant="plain" align="start" mb={4}>
        <List.Item>
          <List.Indicator asChild color="green.500">
            <LuCircleCheck />
          </List.Indicator>
          <b>Arithmétique</b> : r est ce qui reste après avoir retiré des multiples de b dans a.
        </List.Item>
        <List.Item>
          <List.Indicator asChild color="green.500">
            <LuCircleCheck />
          </List.Indicator>
          <b>Algébrique</b> : r est le représentant canonique de la classe de congruence de a modulo |b|.
        </List.Item>
        <List.Item>
          <List.Indicator asChild color="green.500">
            <LuCircleCheck />
          </List.Indicator>
          <b>Géométrique</b> : r est la distance entre a et le multiple de b le plus proche en dessous.
        </List.Item>
      </List.Root>

      {/* Méthode d'encadrement */}
      <Text fontWeight="bold" mb={2}>
        Méthode d'encadrement pour effectuer une division euclidienne :
      </Text>
      <List.Root gap="2" variant="plain" align="start" mb={4}>
        <List.Item>
          <List.Indicator asChild color="green.500">
            <LuCircleCheck />
          </List.Indicator>
          Identifier les valeurs de a et b
        </List.Item>
        <List.Item>
          <List.Indicator asChild color="green.500">
            <LuCircleCheck />
          </List.Indicator>
          Travailler avec la valeur absolue de b : utiliser |b| pour encadrer
        </List.Item>
        <List.Item>
          <List.Indicator asChild color="green.500">
            <LuCircleCheck />
          </List.Indicator>
          Chercher q tel que :
          <br />
          b × q ≤ a &lt; b × (q + 1) ou, si b &lt; 0 : b × (q + 1) &lt; a ≤ b × q
        </List.Item>
        <List.Item>
          <List.Indicator asChild color="green.500">
            <LuCircleCheck />
          </List.Indicator>
          Calculer r = a - b × q
        </List.Item>
        <List.Item>
          <List.Indicator asChild color="green.500">
            <LuCircleCheck />
          </List.Indicator>
          Vérifier que 0 ≤ r &lt; |b|
        </List.Item>
      </List.Root>

      {/* Exemple standard */}
      <HStack mb={2}>
        <Icon as={LuCircleCheck} color="green.500" />
        <Text fontWeight="bold">Exemple</Text>
      </HStack>
      <Text mb={4}>
        a = -13 et b = 4<br />
        ➡️ |b| = 4<br />
        ➡️ On cherche q tel que : 4 × q ≤ -13 &lt; 4 × (q + 1)<br />
        ➡️ q = -4 (car 4 × (-4) = -16 et 4 × (-3) = -12)<br />
        ➡️ r = -13 - (4 × -4) = -13 + 16 = 3<br />
        ➡️ Donc : -13 = 4 × (-4) + 3
      </Text>

      {/* Cas particulier : r négatif */}
      <Text fontWeight="bold" mb={2}>
        Cas particulier : r négatif (division non conforme)
      </Text>
      <Text mb={2}>
        ➡️ Si on connaît une relation a = b × q + r avec r &lt; 0, elle viole la condition 0 ≤ r &lt; |b|.<br />
        ➡️ Il faut réécrire l'expression pour rendre r positif ou nul.
      </Text>

      <Text fontWeight="bold" mb={2}>Méthode de réajustement :</Text>
      <List.Root gap="2" variant="plain" align="start" mb={4}>
        <List.Item>
          <List.Indicator asChild color="yellow.500">
            <LuCircleDashed />
          </List.Indicator>
          Partir de l'expression : a = b × q + r
        </List.Item>
        <List.Item>
          <List.Indicator asChild color="yellow.500">
            <LuCircleDashed />
          </List.Indicator>
          Si r &lt; 0, ajouter b au reste et retirer 1 au quotient :
          <br />
          ➡️ a = b × (q - i) + (r + i × b), avec i = 1, 2, ...
        </List.Item>
        <List.Item>
          <List.Indicator asChild color="yellow.500">
            <LuCircleDashed />
          </List.Indicator>
          Vérifier que 0 ≤ (r + i × b) &lt; |b|
        </List.Item>
      </List.Root>

      {/* Exemple ajusté */}
      <Text fontWeight="bold" mb={2}>Exemple ajusté :</Text>
      <Text>
        On donne : a = 7 × 3 + (-2)<br />
        ➡️ r = -2 &lt; 0<br />
        ➡️ On ajuste : a = 7 × (3 - 1) + (-2 + 7) = 7 × 2 + 5<br />
        ➡️ Division euclidienne conforme : a = 7 × 2 + 5 avec 0 ≤ 5 &lt; 7
      </Text>
    </Box>
  );
};

export default DivisionPanel;
