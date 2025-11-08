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
  FaCalculator
} from "react-icons/fa"
import {
  LuChartBarStacked,
} from "react-icons/lu"
import React, { useState } from "react"
import { RouterChakraLink } from "@/components/ui/RouterChakraLink"
import { getCorrectionLink } from "./lib/correctionLinks"

export type ExerciceType =
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

export type ExerciceStatus = "à faire" | "corrigé" | "à revoir"

export type Exercice = {
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

function generatePgcdExercices(): Exercice[] {
  const a = Math.floor(Math.random() * 90) + 10
  const b = Math.floor(Math.random() * 90) + 10
  const c = Math.floor(Math.random() * 50) + 1
  const gcd = (x: number, y: number): number =>
    y === 0 ? x : gcd(y, x % y)
  const pgcd = gcd(a, b)
  const ppmc = (a * b) / pgcd

  return [
    {
      value: "pgcd",
      icon: <FaTools />,
      title: "Calcul du PGCD",
      enonce: `Déterminer le PGCD de ${a} et ${b}`,
      indication: `Utilise l’algorithme d’Euclide`,
      methode: `Effectue les divisions successives jusqu’à obtenir un reste nul`,
      correction: `PGCD(${a}, ${b}) = ${pgcd}`,
      type: "pgcd",
      status: "à faire",
    },
    {
      value: "ppmc",
      icon: <FaTools />,
      title: "Calcul du PPMC",
      enonce: `Déterminer le PPMC de ${a} et ${b}`,
      indication: `Utilise la relation PPMC × PGCD = a × b`,
      methode: `PPMC = (${a} × ${b}) / PGCD(${a}, ${b})`,
      correction: `PPMC(${a}, ${b}) = ${ppmc}`,
      type: "ppmc",
      status: "à faire",
    },
    {
      value: "relation",
      icon: <FaLightbulb />,
      title: "Relation PGCD–PPMC",
      enonce: `Vérifier que PGCD(${a}, ${b}) × PPMC(${a}, ${b}) = ${a} × ${b}`,
      indication: `Calcule les deux côtés de l’égalité`,
      methode: `PGCD × PPMC = ${pgcd} × ${ppmc} = ${pgcd * ppmc}`,
      correction: `${pgcd} × ${ppmc} = ${a * b} ⇒ relation vérifiée`,
      type: "relation",
      status: "à faire",
    },
    {
      value: "bezout",
      icon: <FaTools />,
      title: "Identité de Bézout",
      enonce: `Trouver des entiers u et v tels que ${a}u + ${b}v = ${pgcd}`,
      indication: `Utilise l’algorithme d’Euclide étendu`,
      methode: `Remonte les étapes de l’algorithme pour exprimer le PGCD`,
      correction: `Il existe u, v tels que ${a}u + ${b}v = ${pgcd} (calcul détaillé dans le lien)`,
      type: "bezout",
      status: "à faire",
    },
    {
      value: "gauss",
      icon: <FaBookOpen />,
      title: "Théorème de Gauss",
      enonce: `Si ${a} divise ${b} × ${pgcd}, montrer qu’il divise ${b}`,
      indication: `Utilise le théorème de Gauss sur la divisibilité`,
      methode: `Si a | bc et PGCD(a, b) = 1 alors a | c`,
      correction: `Puisque PGCD(${a}, ${b}) = ${pgcd}, on peut conclure selon le théorème`,
      type: "gauss",
      status: "à faire",
    },
    {
      value: "corollaire",
      icon: <FaCheckCircle />,
      title: "Corollaire de Gauss",
      enonce: `Montrer que si ${a} | ${b} et ${a} | ${c}, alors ${a} | (${b} + ${c})`,
      indication: `Utilise la stabilité de la divisibilité par addition`,
      methode: `Si a divise deux entiers, il divise leur somme`,
      correction: `Puisque ${a} | ${b} et ${a} | ${c}, alors ${a} | (${b + c})`,
      type: "corollaire",
      status: "à faire",
    },
    {
      value: "premiers",
      icon: <FaLightbulb />,
      title: "Nombres premiers entre eux",
      enonce: `Vérifier si ${a} et ${b} sont premiers entre eux`,
      indication: `Calcule PGCD(${a}, ${b})`,
      methode: `Si PGCD = 1 alors ils sont premiers entre eux`,
      correction: `PGCD(${a}, ${b}) = ${pgcd} ⇒ ${pgcd === 1 ? "premiers entre eux" : "pas premiers entre eux"}`,
      type: "premiers",
      status: "à faire",
    },
    {
      value: "diophantienne",
      icon: <LuChartBarStacked />,
      title: "Équation diophantienne",
      enonce: `Résoudre ${a}x + ${b}y = ${pgcd}`,
      indication: `Utilise Bézout si PGCD divise le second membre`,
      methode: `Trouve une solution particulière puis généralise`,
      correction: `Solution possible : x = …, y = … (voir lien pédagogique)`,
      type: "diophantienne",
      status: "à faire",
    },
    {
      value: "reduction",
      icon: <FaCalculator />,
      title: "Réduction de fraction",
      enonce: `Réduire la fraction ${a}/${b}`,
      indication: `Divise numérateur et dénominateur par leur PGCD`,
      methode: `PGCD(${a}, ${b}) = ${pgcd} ⇒ fraction réduite = ${a / pgcd}/${b / pgcd}`,
      correction: `${a}/${b} = ${a / pgcd}/${b / pgcd} après réduction`,
      type: "reduction",
      status: "à faire",
    },
    {
      value: "lemme",
      icon: <FaBookOpen />,
      title: "Lemme de Gauss",
      enonce: `Si ${a} | ${b}c et PGCD(${a}, ${b}) = 1, montrer que ${a} | ${c}`,
      indication: `Utilise le lemme de Gauss sur la divisibilité`,
      methode: `Si a divise bc et est premier avec b, alors a divise c`,
      correction: `PGCD(${a}, ${b}) = ${pgcd} ⇒ ${a} | ${c} selon le lemme`,
      type: "lemme",
      status: "à faire",
    },
  ]
}

export const ExercicePgcdPpmcAuto = () => {
  const [items, setItems] = useState<Exercice[]>(generatePgcdExercices())

  const refreshExercices = () => {
    setItems(generatePgcdExercices())
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
      <Heading size="md">
        Exercices interactifs – PGCD, PPMC et propriétés de divisibilité
      </Heading>

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
                      <Tabs.Trigger value="enonce">
                        <HStack><Icon as={FaBookOpen} /><Text>Énoncé</Text></HStack>
                      </Tabs.Trigger>
                      <Tabs.Trigger value="indication">
                        <HStack><Icon as={FaLightbulb} /><Text>Indication</Text></HStack>
                      </Tabs.Trigger>
                      <Tabs.Trigger value="methode">
                        <HStack><Icon as={FaTools} /><Text>Méthode</Text></HStack>
                      </Tabs.Trigger>
                      <Tabs.Trigger value="correction">
                        <HStack><Icon as={FaCheckCircle} /><Text>Correction</Text></HStack>
                      </Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="enonce"><Text>{item.enonce}</Text></Tabs.Content>
                    <Tabs.Content value="indication"><Text>{item.indication}</Text></Tabs.Content>
                    <Tabs.Content value="methode"><Text>{item.methode}</Text></Tabs.Content>
                    <Tabs.Content value="correction">
                    <Text mb={2}>{item.correction}</Text>
                    <RouterChakraLink to={link.to} color="blue.500">
                      Voir la correction complète sur Siram@th <FaExternalLinkAlt />
                    </RouterChakraLink>
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

export default ExercicePgcdPpmcAuto
