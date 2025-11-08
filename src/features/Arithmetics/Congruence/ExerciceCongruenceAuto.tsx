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
import { LuChartBarStacked } from "react-icons/lu"
import React, { useState } from "react"
import { RouterChakraLink } from "@/components/ui/RouterChakraLink"
import { getCorrectionLink } from "@/features/Arithmetics/Congruence/lib/correctionLinks"

export type ExerciceType =
  | "simple"
  | "equationmod"
  | "fermat"
  | "period"
  | "inversemod"
  | "classmod"

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

function generateCongruenceExercices(): Exercice[] {
  const a = Math.floor(Math.random() * 50) + 10
  const b = Math.floor(Math.random() * 50) + 10
  const n = Math.floor(Math.random() * 20) + 5
  const r = a % n

  const inv = (() => {
    for (let i = 1; i < n; i++) {
      if ((b * i) % n === 1) return i
    }
    return null
  })()

  const equationSolutions = (() => {
    const sols: number[] = []
    for (let x = 0; x < n; x++) {
      if ((a * x) % n === b % n) sols.push(x)
    }
    return sols.length > 0
      ? `Solutions : x ∈ { ${sols.join(", ")} }`
      : `Aucune solution dans ℤ mod ${n}`
  })()

  return [
    {
      value: "simple",
      icon: <FaBookOpen />,
      title: "Définition de la congruence",
      enonce: `Déterminer si ${a} ≡ ${r} mod ${n}`,
      indication: `Calcule le reste de ${a} modulo ${n}`,
      methode: `${a} mod ${n} = ${r}`,
      correction: `${a} ≡ ${r} mod ${n} ⇒ congruence vérifiée`,
      type: "simple",
      status: "à faire",
    },
    {
      value: "equationmod",
      icon: <LuChartBarStacked />,
      title: "Équation mod n",
      enonce: `Résoudre l’équation ${a}x ≡ ${b} mod ${n}`,
      indication: `Cherche les x tels que ${a}x − ${b} soit divisible par ${n}`,
      methode: `Teste les x ∈ [0, ${n - 1}] pour trouver une solution`,
      correction: equationSolutions,
      type: "equationmod",
      status: "à faire",
    },
    {
      value: "fermat",
      icon: <FaLightbulb />,
      title: "Petit théorème de Fermat",
      enonce: `Calculer ${a}^${n - 1} mod ${n} (si ${n} est premier)`,
      indication: `Utilise Fermat : a^{n−1} ≡ 1 mod n`,
      methode: `Si ${n} est premier et ${a} non divisible par ${n}, alors ${a}^{${n - 1}} ≡ 1 mod ${n}`,
      correction: `${a}^{${n - 1}} mod ${n} = ${Math.pow(a, n - 1) % n}`,
      type: "fermat",
      status: "à faire",
    },
    {
      value: "period",
      icon: <FaCheckCircle />,
      title: "Périodicité des puissances",
      enonce: `Déterminer la période de ${a}^k mod ${n}`,
      indication: `Observe les puissances successives modulo ${n}`,
      methode: `Calcule ${a}^1, ${a}^2, ..., mod ${n} jusqu’à répétition`,
      correction: `La période est atteinte lorsque ${a}^k mod ${n} recommence à ${r}`,
      type: "period",
      status: "à faire",
    },
    {
      value: "inversemod",
      icon: <FaTools />,
      title: "Inverse modulo n",
      enonce: `Trouver l’inverse de ${b} modulo ${n}`,
      indication: `Cherche x tel que ${b}x ≡ 1 mod ${n}`,
      methode: `Utilise l’algorithme d’Euclide étendu`,
      correction: inv ? `Inverse de ${b} mod ${n} = ${inv}` : `Pas d’inverse modulo ${n}`,
      type: "inversemod",
      status: "à faire",
    },
    {
      value: "classmod",
      icon: <FaBookOpen />,
      title: "Classe de congruence",
      enonce: `Donner la classe de ${a} modulo ${n}`,
      indication: `La classe est l’ensemble des entiers congrus à ${a} mod ${n}`,
      methode: `Classe = { x ∈ ℤ | x ≡ ${a} mod ${n} }`,
      correction: `Classe de ${a} mod ${n} = { ..., ${a - n}, ${a}, ${a + n}, ${a + 2 * n}, ... }`,
      type: "classmod",
      status: "à faire",
    },
  ]
}

export const ExerciceCongruenceAuto = () => {
  const [items, setItems] = useState<Exercice[]>(generateCongruenceExercices())

  const refreshExercices = () => {
    setItems(generateCongruenceExercices())
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
        Exercices interactifs – Congruence et calculs modulaires
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

export default ExerciceCongruenceAuto
