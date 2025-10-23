import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  SimpleGrid,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import ContactCard from './../ContactCard'
import CourseCard from './../CourseCard'

const Home = () => {
  return (
    <VStack p={{ base: 4, md: 8 }} align="start">
      <Heading size="xl">Welcome to SiraMath</Heading>

      <Text fontSize="lg" maxW="2xl">
        Empower your learning journey with curated math courses, interactive resources, and expert guidance.
      </Text>

      <Link to="./login">
        <Button colorScheme="teal" size="md">
          Go to Student Portal →
        </Button>
      </Link>

      <Box borderTop="1px solid" borderColor="gray.200" my={6} w="full" />

      <Heading size="md">Featured Courses</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} w="full">
        <CourseCard
          title="Algebra Basics"
          description="Master the foundations of algebra with step-by-step lessons."
        />
        <CourseCard
          title="Geometry Essentials"
          description="Explore shapes, angles, and theorems with interactive examples."
        />
        <CourseCard
          title="Arithmétique Foundations"
          description="Understand numbers, divisibility, prime factorization, and modular arithmetic with clear examples."
        />
        <CourseCard
          title="Analyse – Dérivées et Intégrales"
          description="Maîtrisez les notions de taux de variation, tangentes, primitives et calcul d’aires."
/>
      </SimpleGrid>

      <Box borderTop="1px solid" borderColor="gray.200" my={6} w="full" />

      <Heading size="md">Contact Us</Heading>
      <ContactCard />

      <Box as="footer" pt={8} borderTop="1px" borderColor="gray.200" w="full">
        <Text fontSize="sm" color="gray.500">
          © 2025 SiraMath. All rights reserved.
        </Text>
      </Box>
    </VStack>
  )
}

export default Home
