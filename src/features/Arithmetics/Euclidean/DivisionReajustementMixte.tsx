import { useState } from "react";
import {
  Box, Heading, Text, VStack, HStack,
  Button, Input, Alert, Card,
  Flex
} from "@chakra-ui/react";
import { Link } from "react-router-dom"

function generateNonConformingDivision() {
  const b = Math.floor(Math.random() * 9) + 2; // b entre 2 et 10
  const q = Math.floor(Math.random() * 10) - 5; // q entre -5 et 4
  const r = -(Math.floor(Math.random() * (b - 1)) + 1); // reste négatif
  const a = b * q + r;
  return { a, b, q, r };
}

export default function DivisionReajustementMixte() {
  const [exercise, setExercise] = useState(generateNonConformingDivision());
  const [q, setQ] = useState(exercise.q);
  const [r, setR] = useState(exercise.r);
  const [qPrime, setQPrime] = useState("");
  const [rPrime, setRPrime] = useState("");
  const [feedback, setFeedback] = useState("");

  // Étape pas-à-pas
  const applyStep = () => {
    setQ((prevQ) => prevQ - 1);
    setR((prevR) => prevR + Math.abs(exercise.b));
  };

  const checkConformity = () => {
    if (r >= 0 && r < Math.abs(exercise.b)) {
      setFeedback(`✅ Bravo ! Division conforme : ${exercise.a} = ${exercise.b} × ${q} + ${r}`);
    } else {
      setFeedback(`Encore non conforme : reste = ${r}. Continue à réajuster.`);
    }
  };

  // Vérification directe
  const checkDirect = () => {
    const qVal = parseInt(qPrime);
    const rVal = parseInt(rPrime);
    const { a, b } = exercise;

    if (isNaN(qVal) || isNaN(rVal)) {
      setFeedback("⚠️ Remplis les deux champs avec des entiers.");
      return;
    }

    if (a === b * qVal + rVal && rVal >= 0 && rVal < Math.abs(b)) {
      setFeedback(`✅ Bravo ! Tu as trouvé directement : ${a} = ${b} × ${qVal} + ${rVal}`);
    } else {
      // Correction attendue
      let qCorr = exercise.q;
      let rCorr = exercise.r;
      while (rCorr < 0) {
        qCorr -= 1;
        rCorr += Math.abs(exercise.b);
      }
      setFeedback(
        `❌ Mauvaise réponse. Rappel : si r < 0, on diminue q et on ajoute b au reste. 
         Ici la correction est : q'=${qCorr}, r'=${rCorr}.`
      );
    }
  };

  const reset = () => {
    const ex = generateNonConformingDivision();
    setExercise(ex);
    setQ(ex.q);
    setR(ex.r);
    setQPrime("");
    setRPrime("");
    setFeedback("");
  };

  return (
    <Box maxW="700px" mx="auto" p={6}>
      <VStack gap={6} align="stretch">
        <Flex> 
          <Link
                        to="/dash/courses/euclidean"
                        color="teal.500"
                      >
                        ← Retour à la page précédente
                  </Link>
        </Flex>
        <Heading size="lg">Réajustement mixte d’une division non conforme</Heading>

        <Card.Root>
          <Card.Header>
            <Heading size="md">Énoncé</Heading>
          </Card.Header>
          <Card.Body>
            <Text>
              Division donnée : {exercise.a} = {exercise.b} × {exercise.q} + {exercise.r}
            </Text>
            <Text>⚠️ Le reste est négatif, il faut réajuster.</Text>
          </Card.Body>
        </Card.Root>

        {/* Méthode pas-à-pas */}
        <Card.Root>
          <Card.Header>
            <Heading size="md">Méthode pas-à-pas</Heading>
          </Card.Header>
          <Card.Body>
            <Text>
              État actuel : {exercise.a} = {exercise.b} × {q} + {r}
            </Text>
            <HStack mt={3}>
              <Button colorPalette="blue" onClick={applyStep}>
                Appliquer étape (q → q-1, r → r+b)
              </Button>
              <Button colorPalette="green" onClick={checkConformity}>
                Vérifier conformité
              </Button>
            </HStack>
          </Card.Body>
        </Card.Root>

        {/* Méthode directe */}
        <Card.Root>
          <Card.Header>
            <Heading size="md">Méthode directe</Heading>
          </Card.Header>
          <Card.Body>
            <HStack>
              <Text>q' =</Text>
              <Input
                type="number"
                value={qPrime}
                onChange={(e) => setQPrime(e.target.value)}
                width="100px"
              />
              <Text>r' =</Text>
              <Input
                type="number"
                value={rPrime}
                onChange={(e) => setRPrime(e.target.value)}
                width="100px"
              />
              <Button colorPalette="blue" onClick={checkDirect}>
                Vérifier
              </Button>
            </HStack>
          </Card.Body>
        </Card.Root>

        {feedback && (
          <Alert.Root status={feedback.startsWith("✅") ? "success" : "warning"}>
            <Alert.Indicator />
            <Alert.Description>{feedback}</Alert.Description>
          </Alert.Root>
        )}

        <Button colorPalette="purple" onClick={reset}>
          Nouvel exercice
        </Button>
      </VStack>
    </Box>
  );
}
