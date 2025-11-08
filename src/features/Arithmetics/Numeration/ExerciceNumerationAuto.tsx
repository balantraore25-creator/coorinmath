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
import {
  LuTags,
  LuChartBarStacked,
} from "react-icons/lu"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { getCorrectionLink } from "./lib/correctionLinks"

export type ExerciceType =
  | "bcd"
  | "8421"
  | "complement2"
  | "ieee754"
  | "addition"
  | "soustraction"
  | "multiplication"
  | "debordement"
  | "division"

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

function generateNumerationExercices(): Exercice[] {
  const a = Math.floor(Math.random() * 90) + 10
  const b = Math.floor(Math.random() * 10) + 1
  const sum = a + b
  const diff = a - b
  const prod = a * b
  const div = Math.floor(a / b)
  const rem = a % b
  const float = (Math.random() * 10).toFixed(3)
  const ieeeExp = Math.floor(Math.log2(Number(float)))
  const biasedExp = (127 + ieeeExp).toString(2).padStart(8, "0")
  const mantisse = (Number(float) / Math.pow(2, ieeeExp) - 1)
    .toString(2)
    .split(".")[1] || "0"
  const bcd = a
    .toString()
    .split("")
    .map((digit) => parseInt(digit).toString(2).padStart(4, "0"))
    .join(" ")

  return [
    {
      value: "bcd",
      icon: <LuTags />,
      title: "Codage BCD",
      enonce: `Convertir le nombre ${a} en BCD`,
      indication: `Chaque chiffre est codé sur 4 bits`,
      methode: `Sépare les chiffres de ${a} et convertis-les individuellement`,
      correction: `${a} → ${bcd}`,
      type: "bcd",
      status: "à faire",
    },
    {
      value: "8421",
      icon: <LuTags />,
      title: "Décodage 8421",
      enonce: `Décoder le code 8421 suivant : 0110`,
      indication: `Utilise les poids 8, 4, 2, 1`,
      methode: `0110 = 0×8 + 1×4 + 1×2 + 0×1 = 6`,
      correction: `0110 → 6`,
      type: "8421",
      status: "à faire",
    },
    {
      value: "complement2",
      icon: <LuChartBarStacked />,
      title: "Complément à deux",
      enonce: `Représenter −${b} sur 8 bits en complément à deux`,
      indication: `Inverse les bits de ${b.toString(2).padStart(8, "0")} et ajoute 1`,
      methode: `Utilise la méthode du complément à deux`,
      correction: `−${b} → ${((256 - b) >>> 0).toString(2).padStart(8, "0")}`,
      type: "complement2",
      status: "à faire",
    },
    {
      value: "ieee754",
      icon: <LuChartBarStacked />,
      title: "Codage IEEE 754",
      enonce: `Coder le nombre ${float} en format IEEE 754 simple précision`,
      indication: `Normalise ${float} = 1.${mantisse} × 2^${ieeeExp}`,
      methode: `Signe = 0, exposant biaisé = ${biasedExp}, mantisse = ${mantisse}`,
      correction: `IEEE 754 : 0 ${biasedExp} ${mantisse.padEnd(23, "0")}`,
      type: "ieee754",
      status: "à faire",
    },
    {
      value: "add",
      icon: <LuTags />,
      title: "Addition binaire",
      enonce: `Calculer ${a.toString(2)} + ${b.toString(2)} en binaire`,
      indication: `Utilise les règles d’addition bit à bit avec retenue`,
      methode: `Additionne ${a} + ${b} = ${sum}, puis convertis en binaire`,
      correction: `${a} + ${b} = ${sum} → ${sum.toString(2)} en binaire`,
      type: "addition",
      status: "à faire",
    },
    {
      value: "sub",
      icon: <LuTags />,
      title: "Soustraction binaire",
      enonce: `Calculer ${a.toString(2)} − ${b.toString(2)} en binaire`,
      indication: `Utilise les emprunts si nécessaire`,
      methode: `Soustrais ${a} − ${b} = ${diff}, puis convertis en binaire`,
      correction: `${a} − ${b} = ${diff} → ${diff.toString(2)} en binaire`,
      type: "soustraction",
      status: "à faire",
    },
    {
      value: "mult",
      icon: <LuChartBarStacked />,
      title: "Multiplication binaire",
      enonce: `Calculer ${a.toString(2)} × ${b.toString(2)} en binaire`,
      indication: `Utilise la méthode par décalage et addition`,
      methode: `${a} × ${b} = ${prod}, puis convertis en binaire`,
      correction: `${a} × ${b} = ${prod} → ${prod.toString(2)} en binaire`,
      type: "multiplication",
      status: "à faire",
    },
    {
      value: "deb",
      icon: <LuChartBarStacked />,
      title: "Débordement en complément à deux",
      enonce: `Tester si ${a.toString(2).padStart(8, "0")} + ${b
        .toString(2)
        .padStart(8, "0")} provoque un débordement sur 8 bits`,
      indication: `Additionne et vérifie si le bit de signe change de manière incohérente`,
      methode: `Si deux positifs donnent un résultat négatif, il y a débordement`,
      correction:
        sum > 127
          ? `Résultat = ${sum} → débordement (hors plage de −128 à 127)`
          : `Résultat = ${sum} → pas de débordement`,
      type: "debordement",
      status: "à faire",
    },
    {
      value: "div",
      icon: <LuChartBarStacked />,
      title: "Division euclidienne",
      enonce: `Diviser ${a.toString(2)} par ${b.toString(2)} en binaire`,
      indication: `Trouve le quotient et le reste`,
      methode: `${a} ÷ ${b} = ${div}, reste = ${rem}`,
      correction: `Quotient = ${div.toString(2)}, reste = ${rem.toString(2)}`,
      type: "division",
      status: "à faire",
    },
  ]
}

export const ExerciceNumerationAuto = () => {
  const [items, setItems] = useState<Exercice[]>(generateNumerationExercices())

  const refreshExercices = () => {
    setItems(generateNumerationExercices())
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
        Exercices interactifs – Numération et calculs binaires
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
                      <Link
                                              
                                              to={link.to}
                                              color="blue.500"
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

export default ExerciceNumerationAuto
