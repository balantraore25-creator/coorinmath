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

type ExerciceType =
  | "simple"
  | "classmod"
  | "equationmod"
  | "fermat"
  | "period"
  | "inversemod"

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
    simple: "/dash/courses/congruence/simple",
    equationmod: "/dash/courses/congruence/eqmodulaire",
    fermat: "/dash/courses/congruence/fermat",
    period: "/dash/courses/congruence/periodicite",
    inversemod: "/dash/courses/congruence/inversemodulon",
    classmod: "/dash/courses/congruence/classmodulon",
  }
  return map[type]
}

// Utilitaires
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

function modInverse(a: number, n: number): number | null {
  let t = 0, newT = 1
  let r = n, newR = a
  while (newR !== 0) {
    const quotient = Math.floor(r / newR)
    ;[t, newT] = [newT, t - quotient * newT]
    ;[r, newR] = [newR, r - quotient * newR]
  }
  if (r > 1) return null
  return (t < 0 ? t + n : t) % n
}

function generateRandomExercices(): Exercice[] {
  const a = Math.floor(Math.random() * 100)
  const b = Math.floor(Math.random() * 100)
  const n = Math.floor(Math.random() * 10) + 2

  const powMod = (base: number, exp: number, mod: number): number =>
    Math.pow(base, exp) % mod

  const pgcd = gcd(a, n)
  const inv = pgcd === 1 ? modInverse(a, n) : null

  return [
    {
      value: "ex1",
      icon: <LuTags />,
      title: "Congruence simple",
      enonce: `Montrer que ${a} ≡ ${b} mod ${n}`,
      indication: `Calcule ${a} − ${b} = ${a - b}`,
      methode: `Vérifie si ${n} divise ${a - b}`,
      correction: `${a} − ${b} = ${a - b}, ${a - b} ÷ ${n} = ${Math.floor(
        (a - b) / n
      )} reste ${(a - b) % n} ⇒ ${n} ${
        (a - b) % n === 0 ? "∣" : "∤"
      } ${a - b} ⇒ ${a} ${
        (a - b) % n === 0 ? "≡" : "≠"
      } ${b} mod ${n}`,
      type: "simple",
      status: "à faire",
    },
    {
      value: "mod-class",
      icon: <LuTags />,
      title: "Classe modulo n",
      enonce: `Déterminer la classe de ${a} modulo ${n}`,
      indication: `La classe modulo n est l’ensemble des entiers congrus à ${a} modulo ${n}`,
      methode: `Calcule ${a} mod ${n} = ${a % n}`,
      correction: `${a} ≡ ${a % n} mod ${n} ⇒ Classe = [${a % n}]`,
      type: "classmod",
      status: "à faire",
    },
    {
      value: "mod-eq",
      icon: <LuChartBarStacked />,
      title: "Équation mod n",
      enonce: `Résoudre l’équation ${a}x ≡ ${b} mod ${n}`,
      indication: `Cherche les x tels que ${a}x − ${b} soit divisible par ${n}`,
      methode: `Teste les x ∈ [0, ${n - 1}] pour trouver une solution`,
      correction: `Exemple : x = ${(b % n) * a % n} peut être une solution`,
      type: "equationmod",
      status: "à faire",
    },
    {
      value: "ex2",
      icon: <LuChartBarStacked />,
      title: "Théorème de Fermat",
      enonce: `Vérifier que ${a}^${n - 1} ≡ 1 mod ${n}`,
      indication: `Utilise le petit théorème de Fermat avec p = ${n}`,
      methode: `Calcule ${a}^${n - 1} = ${Math.pow(a, n - 1)} ⇒ mod ${n}`,
      correction: `${Math.pow(a, n - 1)} ÷ ${n} = ${Math.floor(
        Math.pow(a, n - 1) / n
      )} reste ${powMod(a, n - 1, n)} ⇒ ${a}^${n - 1} ≡ ${powMod(
        a,
        n - 1,
        n
      )} mod ${n}`,
      type: "fermat",
      status: "à faire",
    },
    {
      value: "mod-period",
      icon: <FaRandom />,
      title: "Périodicité mod n",
      enonce: `Trouver la période de ${a}^k mod ${n}`,
      indication: `Teste les puissances successives jusqu’à retrouver 1`,
      methode: `Calcule ${a}^k mod ${n} pour k = 1, 2, ... jusqu’à ${a}^k ≡ 1 mod ${n}`,
      correction: `Exemple : ${a}^${n - 1} mod ${n} = ${powMod(
        a,
        n - 1,
        n
      )}`,
      type: "period",
      status: "à faire",
    },
    {
      value: "inverse-mod",
      icon: <LuChartBarStacked />,
      title: "Inverse modulo n",
      enonce:
        pgcd === 1
          ? `Trouver l’inverse de ${a} modulo ${n}`
          : `${a} n’est pas inversible modulo ${n} car gcd(${a}, ${n}) = ${pgcd} ≠ 1`,
      indication:
        pgcd === 1
          ? `Cherche un entier x tel que ${a} × x ≡ 1 mod ${n}`
          : `Aucun inverse n’existe si gcd(a, n) ≠ 1`,
      methode:
        pgcd === 1
          ? `Utilise l’algorithme d’Euclide étendu pour résoudre ${a}x + ${n}y = 1`
          : `Pas de méthode car pas d’inverse`,
      correction:
        pgcd === 1 && inv !== null
          ? `Par Euclide étendu, on trouve x = ${inv} ⇒ ${a} × ${inv} ≡ 1 mod ${n}`
          : `Pas d’inverse car gcd(${a}, ${n}) = ${pgcd} ≠ 1`,
      type: "inversemod",
      status: "à faire",
    },
  ]
}

export const ExerciceCongruenceAuto = () => {
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
      <Heading size="md">Exercices interactifs</Heading>

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

export default ExerciceCongruenceAuto




/*"use client"

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

type ExerciceType = "simple" | "equationmod" | "fermat" | "period"
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
    simple: "http://localhost:5173/dash/courses/congruence/simple",
    equationmod: "http://localhost:5173/dash/courses/congruence/equationmod",
    fermat: "http://localhost:5173/dash/courses/congruence/fermat",
    period: "http://localhost:5173/dash/courses/congruence/periodicite",
  }
  return map[type]
}

function generateRandomExercices(): Exercice[] {
  const a = Math.floor(Math.random() * 100)
  const b = Math.floor(Math.random() * 100)
  const n = Math.floor(Math.random() * 10) + 2

  const powMod = (base: number, exp: number, mod: number): number =>
    Math.pow(base, exp) % mod

  return [
    {
      value: "ex1",
      icon: <LuTags />,
      title: "Congruence simple",
      enonce: `Montrer que ${a} ≡ ${b} mod ${n}`,
      indication: `Calcule ${a} − ${b} = ${a - b}`,
      methode: `Vérifie si ${n} divise ${a - b}`,
      correction: `${a} − ${b} = ${a - b}, ${a - b} ÷ ${n} = ${Math.floor((a - b) / n)} reste ${((a - b) % n)} ⇒ ${n} ${((a - b) % n === 0) ? "∣" : "∤"} ${a - b} ⇒ ${a} ${((a - b) % n === 0) ? "≡" : "≠"} ${b} mod ${n}`,
      type: "simple",
      status: "à faire",
    },
    {
      value: "mod-class",
      icon: <LuTags />,
      title: "Classe modulo n",
      enonce: `Déterminer la classe de ${a} modulo ${n}`,
      indication: `La classe modulo n est l’ensemble des entiers congrus à ${a} modulo ${n}`,
      methode: `Calcule ${a} mod ${n} = ${a % n}`,
      correction: `${a} ≡ ${a % n} mod ${n} ⇒ Classe = [${a % n}]`,
      type: "period",
      status: "à faire",
    },
    {
      value: "mod-eq",
      icon: <LuChartBarStacked />,
      title: "Équation mod n",
      enonce: `Résoudre l’équation ${a}x ≡ ${b} mod ${n}`,
      indication: `Cherche les x tels que ${a}x − ${b} soit divisible par ${n}`,
      methode: `Teste les x ∈ [0, ${n - 1}] pour trouver une solution`,
      correction: `Exemple : x = ${(b % n) * a % n} peut être une solution`,
      type: "equationmod",
      status: "à faire",
    },
    {
      value: "ex2",
      icon: <LuChartBarStacked />,
      title: "Théorème de Fermat",
      enonce: `Vérifier que ${a}^${n - 1} ≡ 1 mod ${n}`,
      indication: `Utilise le petit théorème de Fermat avec p = ${n}`,
      methode: `Calcule ${a}^${n - 1} = ${Math.pow(a, n - 1)} ⇒ mod ${n}`,
      correction: `${Math.pow(a, n - 1)} ÷ ${n} = ${Math.floor(Math.pow(a, n - 1) / n)} reste ${powMod(a, n - 1, n)} ⇒ ${a}^${n - 1} ≡ ${powMod(a, n - 1, n)} mod ${n}`,
      type: "fermat",
      status: "à faire",
    },
    {
      value: "mod-period",
      icon: <FaRandom />,
      title: "Périodicité mod n",
      enonce: `Trouver la période de ${a}^k mod ${n}`,
      indication: `Teste les puissances successives jusqu’à retrouver 1`,
      methode: `Calcule ${a}^k mod ${n} pour k = 1, 2, ... jusqu’à ${a}^k ≡ 1 mod ${n}`,
      correction: `Exemple : ${a}^${n - 1} mod ${n} = ${powMod(a, n - 1, n)}`,
      type: "period",
      status: "à faire",
    },
  ]
}

export const ExerciceCongruenceAuto = () => {
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
      <Heading size="md">Exercices interactifs</Heading>

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

                    <HStack  mt={4}>
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

export default ExerciceCongruenceAuto*/





