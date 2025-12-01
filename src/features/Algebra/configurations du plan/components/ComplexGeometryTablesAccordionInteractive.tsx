import {
  Collapsible,
  VStack,
  Table,
     // ✅ importer depuis @chakra-ui/react
} from "@chakra-ui/react"
import { useColorModeValue } from "@/components/ui/color-mode";
import { LuChevronRight } from "react-icons/lu"
import { motion } from "framer-motion"

import { DraggableLinesSVG } from "./DraggableLinesSVG"
import { DraggablePointsSVG } from "./DraggablePointsSVG"
import { DraggableTriangleSVG } from "./DraggableTriangleSVG"

export default function ComplexGeometryTablesAccordionInteractive() {
  const bg = useColorModeValue("gray.50", "gray.700")

  return (
    <VStack gap={6} align="stretch">   {/* ✅ spacing → gap */}
      
      {/* Section 1 : Droites */}
      <Collapsible.Root>
        <Collapsible.Trigger
          paddingY="3"
          display="flex"
          gap="2"
          alignItems="center"
        >
          <Collapsible.Indicator
            transition="transform 0.2s"
            _open={{ transform: "rotate(90deg)" }}
          >
            <LuChevronRight />
          </Collapsible.Indicator>
          Relations entre deux droites
        </Collapsible.Trigger>
        <Collapsible.Content as={motion.div}>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Table.Root bg={bg} size="md" variant="outline">   {/* ✅ variant corrigé */}
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Concept</Table.ColumnHeader>
                  <Table.ColumnHeader>Condition</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Parallélisme</Table.Cell>
                  <Table.Cell>Vecteurs directeurs colinéaires</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Perpendicularité</Table.Cell>
                  <Table.Cell>Produit scalaire nul</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
            <DraggableLinesSVG />
          </motion.div>
        </Collapsible.Content>
      </Collapsible.Root>

      {/* Section 2 : Points */}
      <Collapsible.Root>
        <Collapsible.Trigger
          paddingY="3"
          display="flex"
          gap="2"
          alignItems="center"
        >
          <Collapsible.Indicator
            transition="transform 0.2s"
            _open={{ transform: "rotate(90deg)" }}
          >
            <LuChevronRight />
          </Collapsible.Indicator>
          Alignement et cocyclicité des points
        </Collapsible.Trigger>
        <Collapsible.Content as={motion.div}>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Table.Root bg={bg} size="md" variant="outline">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Concept</Table.ColumnHeader>
                  <Table.ColumnHeader>Condition</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Alignement</Table.Cell>
                  <Table.Cell>Aire du triangle ABC ≈ 0</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Cocyclicité</Table.Cell>
                  <Table.Cell>Points sur un même cercle</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
            <DraggablePointsSVG />
          </motion.div>
        </Collapsible.Content>
      </Collapsible.Root>

      {/* Section 3 : Triangle */}
      <Collapsible.Root>
        <Collapsible.Trigger
          paddingY="3"
          display="flex"
          gap="2"
          alignItems="center"
        >
          <Collapsible.Indicator
            transition="transform 0.2s"
            _open={{ transform: "rotate(90deg)" }}
          >
            <LuChevronRight />
          </Collapsible.Indicator>
          Rapport complexe du triangle
        </Collapsible.Trigger>
        <Collapsible.Content as={motion.div}>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Table.Root bg={bg} size="md" variant="outline">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Concept</Table.ColumnHeader>
                  <Table.ColumnHeader>Formule</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Rapport complexe</Table.Cell>
                  <Table.Cell>(zC - zA) / (zB - zA)</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Argument</Table.Cell>
                  <Table.Cell>arg(ratio)</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Module</Table.Cell>
                  <Table.Cell>|ratio|</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
            <DraggableTriangleSVG />
          </motion.div>
        </Collapsible.Content>
      </Collapsible.Root>
    </VStack>
  )
}
