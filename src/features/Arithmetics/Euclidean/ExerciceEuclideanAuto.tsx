"use client"

import {
  Accordion,
  Tabs,
  Heading,
  Icon,
  Stack,
  Text,
  HStack,
  Button,
  Tag,

} from "@chakra-ui/react"
import {
  FaBookOpen,
  FaLightbulb,
  FaTools,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaRandom,
} from "react-icons/fa"
import { LuTags } from "react-icons/lu"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { getCorrectionLink } from "./lib/correctionLinks"

type ExerciceType =
  | "division-relatifs"         // Division euclidienne avec encadrement
  | "reste-negatif"             // Cas avec reste négatif
  | "identite-remarquable"      // Identité remarquable x² - y² = c
  | "disjonction-cas"           // Analyse par cas

type ExerciceStatus = "à faire" | "corrigé" | "à revoir"

type Exercice = {
  value: string
  icon: React.ReactNode
  title: string
  enonce: string
  indication: string
  methode: string
  correction: string
  type: ExerciceType
  status: ExerciceStatus
}

function generateEuclideanExercices(): Exercice[] {
  const n = Math.floor(Math.random() * 10) + 2
  const q = Math.floor(Math.random() * 5) - 2 // quotient relatif
  const r = Math.floor(Math.random() * n) - Math.floor(n / 2) // reste potentiellement négatif
  const a = n * q + r
  const x = Math.floor(Math.random() * 10) + 1
  const y = Math.floor(Math.random() * 10) + 1

  return [
    {
      value: "euc1",
      icon: <LuTags />,
      title: "Division euclidienne des relatifs",
      enonce: `Déterminer la division euclidienne de ${a} par ${n} avec la méthode des encadrements`,
      indication: `Trouve q tel que ${n}q ≤ ${a} < ${n}(q + 1)`,
      methode: `Encadre ${a} entre deux multiples consécutifs de ${n}`,
      correction: `${a} = ${n} × ${q} + ${r} avec ${r} = ${a} - ${n} × ${q}`,
      type: "division-relatifs" ,
      status: "à faire",
    },
    {
      value: "euc2",
      icon: <FaTools />,
      title: "Cas avec reste négatif",
      enonce: `Écrire la division euclidienne de ${a} par ${n} avec un reste négatif`,
      indication: `Choisis q et r tels que ${a} = ${n}q + r avec r < 0`,
      methode: `Ajuste q pour que r soit négatif mais respecte la définition`,
      correction: `${a} = ${n} × ${q} + ${r}`,
      type:  "reste-negatif" ,
      status: "à faire",
    },
    {
      value: "euc3",
      icon: <FaLightbulb />,
      title: "Identité remarquable",
      enonce: `Montrer que ${x}² - ${y}² est divisible par ${x - y}`,
      indication: `Utilise ${x}² - ${y}² = (${x} - ${y})(${x} + ${y})`,
      methode: `Factorise ${x}² - ${y}²`,
      correction: `${x}² - ${y}² = (${x} - ${y})(${x} + ${y}) ⇒ divisible par ${x - y}`,
      type:  "identite-remarquable",
      status: "à faire",
    },
    {
  value: "euc4",
  icon: <FaCheckCircle />,
  title: "Divisibilité par 3",
  enonce: `Montrer que l'expression ${n}(${n} + 1)(${n} + 2) est divisible par 3`,
  indication: `Parmi trois entiers consécutifs, l’un est toujours divisible par 3`,
  methode: `Considère les cas possibles pour ${n} modulo 3 : 0, 1 ou 2`,
  correction: `Quel que soit ${n}, parmi ${n}, ${n + 1}, ${n + 2}, il y a toujours un multiple de 3 ⇒ ${n}(${n + 1})(${n + 2}) est divisible par 3`,
  type: "disjonction-cas",
  status: "à faire",
},

  ]
}


export const ExerciceEuclideanAuto = () => {
  const [items, setItems] = useState<Exercice[]>(generateEuclideanExercices())

  const refreshExercices = () => {
    setItems(generateEuclideanExercices())
  }

  const updateStatus = (id: string, newStatus: ExerciceStatus) => {
    setItems((prev) =>
      prev.map((ex) =>
        ex.value === id ? { ...ex, status: newStatus } : ex
      )
    )
  }

  return (
    <Stack width="full" maxW="720px">
      <Heading size="md">Exercices interactifs – Division euclidienne & Divisibilité</Heading>

      <Button onClick={refreshExercices} mb={4}>
        <HStack>
          <Icon as={FaRandom} />
          <Text>Générer de nouveaux exercices</Text>
        </HStack>
      </Button>

      <Accordion.Root collapsible defaultValue={[items[0]?.value]}>
        {items.map((item) => {
          const link = getCorrectionLink(item.type)
          return (
            <Accordion.Item key={item.value} value={item.value}>
              <Accordion.ItemTrigger>
                <Icon fontSize="lg" color="fg.subtle">
                  {item.icon}
                </Icon>
                <Text fontWeight="semibold" ms={2}>
                  {item.title}{" "}
                  <Tag.Root
                    size="sm"
                    colorPalette={
                      item.status === "corrigé"
                        ? "green"
                        : item.status === "à revoir"
                        ? "orange"
                        : "gray"
                    }
                    variant="subtle"
                  >
                    <Tag.Label>{item.status}</Tag.Label>
                  </Tag.Root>
                </Text>
              </Accordion.ItemTrigger>

              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  <Tabs.Root defaultValue="enonce">
                    <Tabs.List gap="2" mb="4">
                      <Tabs.Trigger value="enonce"><HStack><Icon as={FaBookOpen} /><Text>Énoncé</Text></HStack></Tabs.Trigger>
                      <Tabs.Trigger value="indication"><HStack><Icon as={FaLightbulb} /><Text>Indication</Text></HStack></Tabs.Trigger>
                      <Tabs.Trigger value="methode"><HStack><Icon as={FaTools} /><Text>Méthode</Text></HStack></Tabs.Trigger>
                      <Tabs.Trigger value="correction"><HStack><Icon as={FaCheckCircle} /><Text>Correction</Text></HStack></Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="enonce"><Text>{item.enonce}</Text></Tabs.Content>
                    <Tabs.Content value="indication"><Text>{item.indication}</Text></Tabs.Content>
                    <Tabs.Content value="methode"><Text>{item.methode}</Text></Tabs.Content>
                    <Tabs.Content value="correction">
                      <Text mb={2}>{item.correction}</Text>
                      <Link
                        
                        to={link.to}
                        color="teal.500"
                      >
                        Voir la correction complète sur Siram@th{" "}
                        <FaExternalLinkAlt/>
                      </Link>

                      <HStack mt={4}>
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={() => updateStatus(item.value, "corrigé")}
                        >
                          Marquer comme corrigé
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="orange"
                          onClick={() => updateStatus(item.value, "à revoir")}
                        >
                          À revoir
                        </Button>
                      </HStack>
                    </Tabs.Content>
                  </Tabs.Root>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          )
        })}
      </Accordion.Root>
    </Stack>
  )
}

export default ExerciceEuclideanAuto
