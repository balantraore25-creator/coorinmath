import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  HStack,
  VStack,
  Input,
  Button,
  Badge,
  Separator,
  Alert,
  Card,
  List,
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom"
// Génère les couples (p, q) tels que p·q = d
function generateDivisorPairs(n: number): [number, number][] {
  const abs = Math.abs(n);
  const res: [number, number][] = [];
  if (n === 0) {
    const sample = [1, 2, 3, 4, 5];
    for (const k of sample) {
      res.push([0, k], [0, -k], [k, 0], [-k, 0]);
    }
    res.push([0, 0]);
  } else {
    for (let i = 1; i <= abs; i++) {
      if (n % i === 0) {
        res.push([i, n / i], [-i, -n / i]);
      }
    }
  }
  return res;
}

function isSameParity(a: number, b: number): boolean {
  return ((a + b) & 1) === 0;
}

function reconstructUV(p: number, q: number): { u: number; v: number } {
  return { u: (p + q) / 2, v: (q - p) / 2 };
}

type Solution = { u: number; v: number; p: number; q: number };

export default function DifferenceSquaresChakraV3Tutor() {
  const [d, setD] = useState<number>(15);
  const [pairs, setPairs] = useState<[number, number][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [started, setStarted] = useState<boolean>(false);

  const start = () => {
    setPairs(generateDivisorPairs(d));
    setSolutions([]);
    setSelected(null);
    setFeedback("");
    setStarted(true);
  };

  const onSelectPair = (p: number, q: number) => {
    setSelected([p, q]);
    if (!isSameParity(p, q)) {
      setFeedback(
        `Couple (${p}, ${q}) rejeté : p+q impair ⇒ u et v non entiers.`
      );
      return;
    }
    const { u, v } = reconstructUV(p, q);
    const check = u * u - v * v;
    if (check !== d) {
      setFeedback(
        `(${p}, ${q}) ⇒ u=${u}, v=${v}, mais u²−v²=${check} ≠ ${d}.`
      );
      return;
    }
    const exists = solutions.some((s) => s.u === u && s.v === v);
    if (!exists) setSolutions((prev) => [...prev, { u, v, p, q }]);
    setFeedback(
      `Bravo : (${p}, ${q}) ⇒ u=${u}, v=${v}. Vérif : ${u}² − ${v}² = ${d}.`
    );
  };

  return (
    <Box maxW="900px" mx="auto" p={6}>
      <VStack align="stretch" gap={6}>
         <Flex> 
                 <Link
                        to="/dash/courses/euclidean"
                        color="teal.500"
                      >
                        ← Retour à la page précédente
                  </Link>
          </Flex> 
        <Heading size="lg">Résolution interactive de u² − v² = d</Heading>

        {/* Étape 1 */}
        <Card.Root>
          <Card.Header>
            <Heading size="md">Étape 1 · Choix de d</Heading>
          </Card.Header>
          <Card.Body>
            <Stack gap={4}>
              <HStack>
                <Input
                  type="number"
                  value={d}
                  onChange={(e) => setD(parseInt(e.target.value))}
                />
                <Button colorPalette="blue" onClick={start}>
                  Générer
                </Button>
              </HStack>
              {started && (
                <Alert.Root status="info">
                  <Alert.Indicator />
                  <Alert.Description>
                    Rappel : u² − v² = (u − v)(u + v) = d. On cherche des couples
                    (p, q) de diviseurs de d de même parité.
                  </Alert.Description>
                </Alert.Root>
              )}
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Étape 2 */}
        {started && (
          <Card.Root>
            <Card.Header>
              <Heading size="md">Étape 2 · Couples de diviseurs</Heading>
            </Card.Header>
            <Card.Body>
              <Stack gap={3}>
                <HStack wrap="wrap" gap={2}>
                  {pairs.map(([p, q], i) => (
                    <Button
                      key={`${p},${q},${i}`}
                      size="sm"
                      variant="solid"
                      onClick={() => onSelectPair(p, q)}
                    >
                      ({p}, {q})
                    </Button>
                  ))}
                </HStack>

                {selected && (
                  <>
                    <Separator />
                    <Text>
                      Couple choisi : <Badge>({selected[0]}, {selected[1]})</Badge>
                    </Text>
                  </>
                )}

                {feedback && (
                  <Alert.Root
                    status={feedback.startsWith("Bravo") ? "success" : "warning"}
                  >
                    <Alert.Indicator />
                    <Alert.Description>{feedback}</Alert.Description>
                  </Alert.Root>
                )}
              </Stack>
            </Card.Body>
          </Card.Root>
        )}

        {/* Étape 3 */}
        {started && (
          <Card.Root>
            <Card.Header>
              <Heading size="md">Étape 3 · Solutions</Heading>
            </Card.Header>
            <Card.Body>
              {solutions.length === 0 ? (
                <Alert.Root status="info">
                  <Alert.Indicator />
                  <Alert.Description>
                    Aucune solution valide pour l’instant.
                  </Alert.Description>
                </Alert.Root>
              ) : (
                <List.Root gap="2">
                  {solutions.map(({ u, v, p, q }, i) => (
                    <List.Item key={`${u},${v},${i}`}>
                      <Badge colorPalette="green">Solution {i + 1}</Badge>{" "}
                      (u, v) = ({u}, {v}) depuis (p, q) = ({p}, {q})
                    </List.Item>
                  ))}
                </List.Root>
              )}
            </Card.Body>
          </Card.Root>
        )}
      </VStack>
    </Box>
  );
}
