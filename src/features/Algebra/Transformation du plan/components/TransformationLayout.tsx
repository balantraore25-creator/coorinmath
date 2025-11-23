"use client"

import { Box, Flex, Heading, VStack } from "@chakra-ui/react"
import type { ReactNode } from "react"

interface TransformationLayoutProps {
  title: string
  form: ReactNode
  results: ReactNode
  plane: ReactNode
}

export default function TransformationLayout({
  title,
  form,
  results,
  plane,
}: TransformationLayoutProps) {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      align="start"
      justify="center"
      gap={10}
      w="full"
      p={6}
    >
      {/* Colonne gauche : formulaire + résultats */}
      <Box
        p={6}
        borderWidth="1px"
        borderRadius="lg"
        shadow="md"
        w={{ base: "full", md: "sm" }}
        bg="white"
      >
        <Heading size="md" mb={6} textAlign="center">
          {title}
        </Heading>

        <VStack gap={4} align="stretch">
          {form}
        </VStack>

        <Box mt={6} textAlign="center">
          {results}
        </Box>
      </Box>

      {/* Colonne droite : plan complexe */}
      <Box w="full" flex="1" maxW="4xl">
        {plane}
      </Box>
    </Flex>
  )
}
