import React from "react"
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Separator,
  Tabs
} from "@chakra-ui/react"
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

export const DefinitionPanel: React.FC = () => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={6} bg="bg.surface">
      <VStack align="stretch" gap={4}>
        <Heading size="md">Nombre complexe</Heading>
        <Text>
          Un nombre complexe est de la forme <InlineMath math="z = a + bi" />, 
          où a est la partie réelle et b la partie imaginaire, avec <InlineMath math="i^2 = -1" />.
        </Text>

        <Separator />

        <Box>
          <Heading size="sm" mb={2}>Interprétations</Heading>
          <Tabs.Root defaultValue="algebraic">
            <Tabs.List>
              <Tabs.Trigger value="algebraic">Algébrique</Tabs.Trigger>
              <Tabs.Trigger value="geometric">Géométrique</Tabs.Trigger>
              <Tabs.Trigger value="polar">Polaire</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="algebraic">
              <VStack align="stretch" gap={2}>
                <Heading size="sm">Forme algébrique</Heading>
                <Text><InlineMath math="z = a + bi" /></Text>
                <Text><InlineMath math="(a + bi) + (c + di) = (a + c) + (b + d)i" /></Text>
                <Text><InlineMath math="(a + bi)(c + di) = (ac - bd) + (ad + bc)i" /></Text>
              </VStack>
            </Tabs.Content>

            <Tabs.Content value="geometric">
              <VStack align="stretch" gap={2}>
                <Heading size="sm">Interprétation géométrique</Heading>
                <Text>
                  Les complexes se représentent comme des points dans le plan. 
                  Module : <InlineMath math="r = \sqrt{a^2 + b^2}" />, 
                  Argument : <InlineMath math="\theta = \mathrm{atan2}(b, a)" />.
                </Text>
              </VStack>
            </Tabs.Content>

            <Tabs.Content value="polar">
              <VStack align="stretch" gap={2}>
                <Heading size="sm">Forme polaire</Heading>
                <Text>
                  <InlineMath math="z = r(\cos \theta + i \sin \theta) = r e^{i\theta}" />
                </Text>
              </VStack>
            </Tabs.Content>
          </Tabs.Root>
        </Box>

        <Separator />

        <Box>
          <Heading size="sm" mb={3}>Exemples</Heading>
          <VStack align="stretch" gap={3}>
            <Box borderWidth="1px" borderRadius="md" p={3} bg="bg.subtle">
              <HStack justify="space-between">
                <Heading size="xs">Addition simple</Heading>
                <Badge colorPalette="blue">Algébrique</Badge>
              </HStack>
              <BlockMath math="z_1 = 1 + 2i, \; z_2 = 3 - i \;\Rightarrow\; z_1 + z_2 = 4 + i" />
            </Box>

            <Box borderWidth="1px" borderRadius="md" p={3} bg="bg.subtle">
              <HStack justify="space-between">
                <Heading size="xs">Module et argument</Heading>
                <Badge colorPalette="green">Géométrique</Badge>
              </HStack>
              <BlockMath math="z = 3 + 4i \;\Rightarrow\; r = 5, \; \theta \approx 0.927 \text{ rad}" />
            </Box>

            <Box borderWidth="1px" borderRadius="md" p={3} bg="bg.subtle">
              <HStack justify="space-between">
                <Heading size="xs">Produit polaire</Heading>
                <Badge colorPalette="purple">Polaire</Badge>
              </HStack>
              <BlockMath math="z_1 = 2 e^{i\pi/6}, \; z_2 = 3 e^{i\pi/3} \;\Rightarrow\; z_1 z_2 = 6 e^{i\pi/2}" />
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}
