import {
  Box,
  Heading,
  Text,
  Stack,
  HStack,
  Button,
  Card,
  Progress,
  Dialog,
  Flex,
} from "@chakra-ui/react";
import { RouterChakraLink } from "@/components/ui/RouterChakraLink"
import { useState, useEffect } from "react";
import { toaster } from "@/components/ui/toaster";

type Cas = "pair" | "impair" | "multiple";

type Justification = {
  id: string;
  content: string;
  correctFor: Cas | "none";
  explanation?: string;
};

const casList: Cas[] = ["pair", "impair", "multiple"];

const baseJustifications: Justification[] = [
  {
    id: "j1",
    content: "n pair ⇒ n = 2k ⇒ n² = 4k² ≡ 0 mod 4",
    correctFor: "pair",
    explanation: "Si n est pair, n=2k donc n²=4k² est divisible par 4.",
  },
  {
    id: "j2",
    content: "n impair ⇒ n = 2k+1 ⇒ n² = 4k² + 4k + 1 ≡ 1 mod 4",
    correctFor: "impair",
    explanation: "Si n est impair, n=2k+1 donc n²=4k²+4k+1 ≡ 1 mod 4.",
  },
  {
    id: "j3",
    content: "n multiple de 3 ⇒ n = 3k ⇒ n² = 9k² ≡ 0 mod 3",
    correctFor: "multiple",
    explanation: "Si n est multiple de 3, n=3k donc n²=9k² est divisible par 3.",
  },
];

const distracteurs: Justification[] = [
  { id: "d1", content: "n pair ⇒ n² est impair", correctFor: "none" },
  { id: "d2", content: "n multiple de 3 ⇒ n² ≡ 1 mod 3", correctFor: "none" },
  { id: "d3", content: "n impair ⇒ n² divisible par 4", correctFor: "none" },
  { id: "d4", content: "n pair ⇒ n² ≡ 2 mod 4", correctFor: "none" },
];

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function getInitialBlocks(): Justification[] {
  const extra = shuffle(distracteurs).slice(0, 2);
  return shuffle([...baseJustifications, ...extra]);
}

export default function DisjonctionDeCasTutor() {
  const [casJustifications, setCasJustifications] = useState<Record<Cas, Justification[]>>({
    pair: [],
    impair: [],
    multiple: [],
  });
  const [remaining, setRemaining] = useState<Justification[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [syntheseText, setSyntheseText] = useState("");

  useEffect(() => {
    reset();
  }, []);

  const handleChoice = (justification: Justification, targetCas: Cas) => {
    if (justification.correctFor === targetCas) {
      setCasJustifications(prev => ({
        ...prev,
        [targetCas]: [...prev[targetCas], justification],
      }));
      setRemaining(prev => prev.filter(j => j.id !== justification.id));
      setCorrectCount(prev => prev + 1);

      toaster.create({
        title: "Bonne réponse !",
        description: justification.explanation || "Justification correcte.",
        type: "success",
      });
    } else {
      toaster.create({
        title: "Justification incorrecte",
        description: "Indice : vérifie la parité ou la divisibilité avant de placer.",
        type: "error",
      });
    }
  };

  const reset = () => {
    const init = getInitialBlocks();
    setCasJustifications({ pair: [], impair: [], multiple: [] });
    setRemaining(init);
    setCorrectCount(0);
  };

  const synthese = () => {
    const synth = casList.map(cas => {
      const blocs = casJustifications[cas].map(j => `• ${j.content}`).join("\n");
      return `Cas ${cas}:\n${blocs || "Aucune justification"}`;
    }).join("\n\n");

    setSyntheseText(synth);
    setIsOpen(true);
  };

  const progress = (correctCount / baseJustifications.length) * 100;

  return (
    <Box p={6}>
       <Flex> 
          <RouterChakraLink to="/dash/courses/euclidean" color="teal.500">
             ← Retour à la page précédente
          </RouterChakraLink>
                </Flex> 
      <Heading size="lg" mb={6}>
        Justification par disjonction de cas
      </Heading>

      {/* Barre de progression */}
      <Box mb={6}>
        <Text mb={2}>Progression</Text>
        <Progress.Root value={progress} max={100} colorScheme="green" borderRadius="md">
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
        <Text mt={1} fontSize="sm" color="gray.600">
          {correctCount}/{baseJustifications.length} justifications correctes
        </Text>
      </Box>

      {/* Blocs disponibles */}
      <Card.Root mb={6}>
        <Card.Header>
          <Heading size="md">Blocs disponibles</Heading>
        </Card.Header>
        <Card.Body>
          <Stack gap={3}>
            {remaining.map((j) => (
              <HStack key={j.id} gap={3} align="center">
                <Box
                  p={3}
                  bg="white"
                  borderRadius="md"
                  borderWidth="1px"
                  flex="1"
                  shadow="sm"
                >
                  {j.content}
                </Box>
                <HStack gap={2}>
                  {casList.map(cas => (
                    <Button
                      key={cas}
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleChoice(j, cas)}
                    >
                      Choisir {cas}
                    </Button>
                  ))}
                </HStack>
              </HStack>
            ))}
          </Stack>
        </Card.Body>
      </Card.Root>

      {/* Zones de cas */}
      <HStack align="start" gap={4}>
        {casList.map((cas) => (
          <Card.Root key={cas} flex="1">
            <Card.Header>
              <Heading size="sm">Cas {cas}</Heading>
            </Card.Header>
            <Card.Body>
              <Stack gap={2}>
                {casJustifications[cas].map((j) => (
                  <Box key={j.id} p={2} bg="white" borderRadius="md" borderWidth="1px">
                    {j.content}
                  </Box>
                ))}
                {casJustifications[cas].length === 0 && (
                  <Text color="gray.600" fontStyle="italic">
                    Aucune justification pour l’instant
                  </Text>
                )}
              </Stack>
            </Card.Body>
          </Card.Root>
        ))}
      </HStack>

      {/* Actions */}
      <HStack mt={6} gap={4}>
        <Button onClick={synthese} colorScheme="green">
          Finaliser la démonstration
        </Button>
        <Button onClick={reset} variant="outline">
          Réinitialiser
        </Button>
      </HStack>

      {/* Dialog de synthèse */}
      <Dialog.Root open={isOpen} onOpenChange={(details) => setIsOpen(details.open)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.CloseTrigger />
            <Dialog.Header>
              <Dialog.Title>Synthèse finale</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap={3}>
                {syntheseText.split("\n\n").map((section, idx) => (
                  <Box key={idx} p={3} bg="gray.50" borderRadius="md" borderWidth="1px">
                    <Text whiteSpace="pre-line">{section}</Text>
                  </Box>
                ))}
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button onClick={() => setIsOpen(false)} colorScheme="blue">
                Fermer
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
}
