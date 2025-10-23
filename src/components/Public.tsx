import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  SimpleGrid,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import ContactCard from './ContactCard'
import CourseCard from './CourseCard'

const Public = () => {
  return (
    <VStack p={{ base: 4, md: 8 }} align="start">
      <Heading size="xl">Bienvenue sur COORIN</Heading>

      <Text fontSize="lg" maxW="2xl">
        Renforcez votre parcours d’apprentissage grâce à des cours de mathématiques organisés, des ressources interactives et des conseils d’experts
      </Text>

      <Link to="./login">
        <Button colorScheme="teal" size="md">
          Aller au portail étudiant →
        </Button>
      </Link>

      <Box borderTop="1px solid" borderColor="gray.200" my={6} w="full" />

      <Heading size="md">Cours en vedette</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} w="full">
        <CourseCard
          title="Bases de l’algèbre"
          description="Maîtrisez les bases de l’algèbre avec des leçons étape par étape."
        />
        <CourseCard
          title="L’essentiel de la géométrie"
          description="Explorez des formes, des angles et des théorèmes à l’aide d’exemples interactifs."
        />
        <CourseCard
          title="Fondements de l’arithmétique"
          description="Comprenez les nombres, la divisibilité, la factorisation première et l’arithmétique modulaire avec des exemples clairs."
        />
        <CourseCard
          title="Analyse – Dérivées et Intégrales"
          description="Maîtrisez les notions de taux de variation, tangentes, primitives et calcul d’aires."
/>
      </SimpleGrid>

      <Box borderTop="1px solid" borderColor="gray.200" my={6} w="full" />

      <Heading size="md">Contactez-nous</Heading>
      <ContactCard />

      <Box as="footer" pt={8} borderTop="1px" borderColor="gray.200" w="full">
        <Text fontSize="sm" color="gray.500">
          © 2025 SiraMath. All rights reserved.
        </Text>
      </Box>
    </VStack>
  )
}

export default Public

