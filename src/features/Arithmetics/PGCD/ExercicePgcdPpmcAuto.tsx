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
import { LuTags, LuChartBarStacked } from "react-icons/lu"
import React, { useState } from "react"

// Types
type ExerciceType =
  | "pgcd"
  | "ppmc"
  | "relation"
  | "bezout"
  | "gauss"
  | "corollaire"
  | "premiers"
  | "diophantienne"
  | "reduction"
  | "lemme"

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

// Correction links
function getCorrectionUrl(type: ExerciceType): string {
  const map: Record<ExerciceType, string> = {
    pgcd: "/dash/courses/pgcd/gcdcalculate",
    ppmc: "/dash/courses/pgcd/gcdcalculate",
    relation: "/dash/courses/pgcd/proprietes",
    bezout: "/dash/courses/pgcd/bezout",
    gauss: "/dash/courses/pgcd/divisibility",
    corollaire: "/dash/courses/pgcd/divisibility",
    premiers: "/dash/courses/pgcd/divisibility",
    diophantienne: "/dash/courses/pgcd/diophantienne",
    reduction: "/dash/courses/pgcd/applications",
    lemme: "/dash/courses/pgcd/divisibility",
  }
  return map[type]
}

// PGCD utilitaire
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

// Générateur
function generateRandomExercices(): Exercice[] {
  const a = Math.floor(Math.random() * 50 + 10)
  const b = Math.floor(Math.random() * 50 + 10)
  const pgcd = gcd(a, b)
  const ppmc = (a * b) / pgcd

  return [
    {
      value: "pgcd",
      icon: <LuTags />,
      title: "Calcul du PGCD",
      enonce: `Calcule le PGCD de ${a} et ${b}`,
      indication: `Utilise l’algorithme d’Euclide ou les facteurs premiers`,
      methode: `PGCD(${a}, ${b}) = ${pgcd}`,
      correction: `PGCD(${a}, ${b}) = ${pgcd}`,
      type: "pgcd",
      status: "à faire",
    },
    {
      value: "ppmc",
      icon: <LuTags />,
      title: "Calcul du PPCM",
      enonce: `Calcule le PPCM de ${a} et ${b}`,
      indication: `Utilise la formule PPCM = (a × b) / PGCD(a, b)`,
      methode: `PPCM(${a}, ${b}) = (${a} × ${b}) / ${pgcd} = ${ppmc}`,
      correction: `PPCM(${a}, ${b}) = ${ppmc}`,
      type: "ppmc",
      status: "à faire",
    },
    {
      value: "relation",
      icon: <LuChartBarStacked />,
      title: "Relation PGCD × PPCM",
      enonce: `Vérifie que PGCD(${a}, ${b}) × PPCM(${a}, ${b}) = ${a} × ${b}`,
      indication: `Calcule les deux côtés de l’égalité`,
      methode: `${pgcd} × ${ppmc} = ${pgcd * ppmc}, ${a} × ${b} = ${a * b}`,
      correction: `✅ ${pgcd * ppmc} = ${a * b}`,
      type: "relation",
      status: "à faire",
    },
    {
      value: "bezout",
      icon: <FaTools />,
      title: "Théorème de Bézout",
      enonce: `Trouve u et v tels que ${a}·u + ${b}·v = ${pgcd}`,
      indication: `Utilise l’algorithme d’Euclide étendu`,
      methode: `Résous ${a}·u + ${b}·v = ${pgcd}`,
      correction: `Exemple : u = −1, v = ${Math.floor(a / pgcd)} ⇒ ${a}·(−1) + ${b}·${Math.floor(
        a / pgcd
      )} = ${pgcd}`,
      type: "bezout",
      status: "à faire",
    },
    {
      value: "gauss",
      icon: <FaTools />,
      title: "Théorème de Gauss",
      enonce: `Si ${a} divise ${b}·x et PGCD(${a}, ${b}) = 1, que peut-on dire de ${a} et x ?`,
      indication: `Applique le théorème de Gauss`,
      methode: `Si ${a} | ${b}·x et PGCD(${a}, ${b}) = 1 ⇒ ${a} | x`,
      correction: `✅ ${a} divise x`,
      type: "gauss",
      status: "à faire",
    },
    {
      value: "corollaire",
      icon: <FaTools />,
      title: "Corollaire de Gauss",
      enonce: `Si ${pgcd} | ${a} et ${pgcd} | ${b}, et PGCD(${a}, ${b}) = 1, que peut-on dire de ${pgcd}² ?`,
      indication: `Utilise le corollaire : si a | c et b | c, alors ab | c si PGCD(a, b) = 1`,
      methode: `✅ ${pgcd}² divise ${a * pgcd} et ${b * pgcd}`,
      correction: `${pgcd}² divise ${a * pgcd} ⇒ ${pgcd}² | ${a * pgcd}`,
      type: "corollaire",
      status: "à faire",
    },
    {
      value: "premiers",
      icon: <LuTags />,
      title: "Nombres premiers entre eux",
      enonce: `Détermine si ${a} et ${b} sont premiers entre eux`,
      indication: `Calcule PGCD(${a}, ${b})`,
      methode: `PGCD = ${pgcd} ⇒ ${pgcd === 1 ? "Oui" : "Non"}`,
      correction: `${pgcd === 1 ? "✅ Ils sont premiers entre eux" : "❌ Ils ne le sont pas"}`,
      type: "premiers",
      status: "à faire",
    },
    {
      value: "diophantienne",
      icon: <LuChartBarStacked />,
      title: "Équation diophantienne",
      enonce: `Résous ${a}x + ${b}y = ${pgcd}`,
      indication: `Utilise Bézout pour trouver une solution entière`,
      methode: `Trouve u, v tels que ${a}u + ${b}v = ${pgcd}`,
      correction: `Exemple : x = −1, y = ${Math.floor(a / pgcd)}`,
      type: "diophantienne",
      status: "à faire",
    },
    {
      value: "reduction",
      icon: <LuTags />,
      title: "Réduction de fraction",
      enonce: `Réduis la fraction ${a}/${b}`,
      indication: `Divise numérateur et dénominateur par PGCD(${a}, ${b}) = ${pgcd}`,
      methode: `Fraction réduite = ${a / pgcd}/${b / pgcd}`,
      correction: `✅ ${a}/${b} = ${a / pgcd}/${b / pgcd}`,
      type: "reduction",
      status: "à faire",
    },
    {
      value: "lemme",
      icon: <FaTools />,
      title: "Lemme d’Euclide",
      enonce: `Si ${pgcd} divise ${a}·${b} et PGCD(${pgcd}, ${a}) = 1, que peut-on conclure ?`,
      indication: `Applique le lemme d’Euclide`,
      methode: `✅ ${pgcd} | ${b}`,
      correction: `✅ ${pgcd} divise ${b}`,
      type: "lemme",
      status: "à faire",
    },
  ]
}

// Composant principal
export const ExercicePgcdPpmcAuto = () => {
  const [items, setItems] = useState<Exercice[]>(generateRandomExercices())

  const refreshExercices = () => {
    setItems(generateRandomExercices())
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
      <Heading size="md">Exercices interactifs PGCD & PPCM</Heading>

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
                    <Tabs.Trigger value="enonce">
                      <HStack>
                        <Icon as={FaBookOpen} />
                        <Text>Énoncé</Text>
                      </HStack>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="indication">
                      <HStack>
                        <Icon as={FaLightbulb} />
                        <Text>Indication</Text>
                      </HStack>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="methode">
                      <HStack>
                        <Icon as={FaTools} />
                        <Text>Méthode</Text>
                      </HStack>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="correction">
                      <HStack>
                        <Icon as={FaCheckCircle} />
                        <Text>Correction</Text>
                      </HStack>
                    </Tabs.Trigger>
                  </Tabs.List>

                  <Tabs.Content value="enonce">
                    <Text>{item.enonce}</Text>
                  </Tabs.Content>
                  <Tabs.Content value="indication">
                    <Text>{item.indication}</Text>
                  </Tabs.Content>
                  <Tabs.Content value="methode">
                    <Text>{item.methode}</Text>
                  </Tabs.Content>
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

export default ExercicePgcdPpmcAuto
