"use client"

import {
  Accordion,
  Tabs,
  Heading,
  Icon,
  Stack,
  Text,
  Link,
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

type ExerciceType =
  | "definition"
  | "identite"
  | "euclidienne"
  | "reste"

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

function getCorrectionUrl(type: ExerciceType): string {
  const map: Record<ExerciceType, string> = {
    definition: "https://siramath.onrender.com/dash/courses/euclidean/definition",
    identite: "https://siramath.onrender.com/dash/courses/euclidean/identite",
    euclidienne: "https://siramath.onrender.com/dash/courses/euclidean/division",
    reste: "https://siramath.onrender.com/dash/courses/euclidean/reste",
  }
  return map[type]
}

function generateEuclideanExercices(): Exercice[] {
  const n = Math.floor(Math.random() * 20) + 5
  const q = Math.floor(Math.random() * 10) + 1
  const r = Math.floor(Math.random() * n)
  const a = n * q + r

  return [
    {
      value: "euc1",
      icon: <FaTools />,
      title: "Identité remarquable",
      enonce: `Montrer que n + 1 divise n² - 1`,
      indication: `Utilise n² - 1 = (n + 1)(n - 1)`,
      methode: `Factorise n² - 1`,
      correction: `n² - 1 = (n + 1)(n - 1) ⇒ n + 1 divise n² - 1`,
      type: "identite",
      status: "à faire",
    },
    {
      value: "euc2",
      icon: <LuTags />,
      title: "Division euclidienne",
      enonce: `Écrire la division euclidienne de ${a} par ${n}`,
      indication: `Trouve q et r tels que ${a} = ${n}q + r avec 0 ≤ r < ${n}`,
      methode: `Calcule q = ⌊${a} ÷ ${n}⌋, r = ${a} - ${n}q`,
      correction: `${a} = ${n} × ${q} + ${r}`,
      type: "euclidienne",
      status: "à faire",
    },
    {
      value: "euc3",
      icon: <FaLightbulb />,
      title: "Définition de la divisibilité",
      enonce: `Montrer que ${n} divise ${n * q}`,
      indication: `Utilise ${n * q} = ${n} × ${q}`,
      methode: `Exprime ${n * q} comme un multiple de ${n}`,
      correction: `${n * q} = ${n} × ${q} ⇒ ${n} divise ${n * q}`,
      type: "definition",
      status: "à faire",
    },
    {
      value: "euc4",
      icon: <FaCheckCircle />,
      title: "Reste selon n",
      enonce: `Déterminer le reste de n² + 3n + 2 dans sa division par n + 1`,
      indication: `Utilise la factorisation : n² + 3n + 2 = (n + 1)(n + 2)`,
      methode: `Reste = 0 car le polynôme est divisible`,
      correction: `n² + 3n + 2 = (n + 1)(n + 2) ⇒ reste = 0`,
      type: "reste",
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
        {items.map((item) => (
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
                      href={getCorrectionUrl(item.type)}
                      color="blue.600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Voir la correction complète sur Siram@th{" "}
                      <Icon as={FaExternalLinkAlt} ms={1} />
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
        ))}
      </Accordion.Root>
    </Stack>
  )
}

export default ExerciceEuclideanAuto
