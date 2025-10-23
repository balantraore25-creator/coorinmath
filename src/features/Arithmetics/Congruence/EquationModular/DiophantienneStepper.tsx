import  { useState, useMemo } from "react";
import {
  Card, HStack, Heading, Stack, Text, Button, Progress, Input,
  Alert, Tag
} from "@chakra-ui/react";
import type { EquationProps } from "./EquationProps";
import { mod, egcd, modInverse } from "./utils";


type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export default function DiophantienneStepper({ a, b, n }: EquationProps) {
  const [step, setStep] = useState<Step>(0);
  const [invProposed, setInvProposed] = useState("");
  const [x0Proposed, setX0Proposed] = useState("");

  const progress = useMemo(() => (step / 6) * 100, [step]);

  const d = useMemo(() => egcd(a, n)[0], [a, n]);
  const conditionOK = b % d === 0;

  const aPrime = a / d;
  const bPrime = b / d;
  const nPrime = n / d;

  const invAprime = useMemo(() => modInverse(aPrime, nPrime), [aPrime, nPrime]);
  const x0 = invAprime !== undefined ? mod(invAprime * bPrime, nPrime) : undefined;

  const solutions = useMemo(() => {
    if (x0 === undefined) return [];
    const sols: number[] = [];
    for (let t = 0; t < d; t++) {
      sols.push(mod(x0 + t * nPrime, n));
    }
    return sols;
  }, [x0, d, nPrime, n]);

  return (
    <Card.Root size="lg" variant="elevated">
      <Card.Header>
        <HStack justify="space-between" w="100%">
          <Heading size="md">Méthode diophantienne</Heading>
          <HStack w="40%">
            <Progress.Root value={progress} max={100} w="100%" colorPalette="teal" size="sm">
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
            <Text>{Math.round(progress)}%</Text>
          </HStack>
        </HStack>
      </Card.Header>

      <Card.Body>
        {step === 0 && (
          <Stack gap={4}>
            <Text>On veut résoudre : {a}·x ≡ {b} (mod {n})</Text>
            <Button colorPalette="teal" onClick={() => setStep(1)}>Commencer</Button>
          </Stack>
        )}

        {step === 1 && (
          <Stack gap={4}>
            <Text>On traduit la congruence en équation diophantienne :</Text>
            <Text>{a}·x − {n}·k = {b}</Text>
            <Button onClick={() => setStep(2)}>Continuer</Button>
          </Stack>
        )}

        {step === 2 && (
          <Stack gap={4}>
            <Text>PGCD : d = gcd({a}, {n}) = {d}</Text>
            <Tag.Root variant={conditionOK ? "solid" : "subtle"} colorPalette={conditionOK ? "green" : "red"}>
              <Tag.Label>{conditionOK ? "Condition d | b vérifiée" : "Pas de solution"}</Tag.Label>
            </Tag.Root>
            {conditionOK && <Button onClick={() => setStep(3)}>Réduire l'équation</Button>}
          </Stack>
        )}

        {step === 3 && (
          <Stack gap={4}>
            <Text>Réduction :</Text>
            <Text>a' = {aPrime}, b' = {bPrime}, n' = {nPrime}</Text>
            <Text>gcd(a', n') = 1</Text>
            <Button onClick={() => setStep(4)}>Trouver l'inverse de a' mod n'</Button>
          </Stack>
        )}

        {step === 4 && (
          <Stack gap={4}>
            {invAprime === undefined ? (
              <Alert.Root status="error" variant="subtle">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>Pas d’inverse</Alert.Title>
                  <Alert.Description>gcd(a', n') ≠ 1, méthode impossible.</Alert.Description>
                </Alert.Content>
              </Alert.Root>
            ) : (
              <>
                <Text>Propose u tel que {aPrime}·u ≡ 1 (mod {nPrime})</Text>
                <Input value={invProposed} onChange={(e) => setInvProposed(e.target.value)} w="200px" />
                <Button
                  onClick={() => {
                    if (Number(invProposed) === invAprime) setStep(5);
                  }}
                >
                  Valider
                </Button>
              </>
            )}
          </Stack>
        )}

        {step === 5 && (
          <Stack gap={4}>
            <Text>Propose la solution particulière x₀ :</Text>
            <HStack>
              <Input
                value={x0Proposed}
                onChange={(e) => setX0Proposed(e.target.value)}
                w="200px"
              />
              <Button
                onClick={() => {
                  if (Number(x0Proposed) === x0) setStep(6);
                }}
              >
                Valider
              </Button>
            </HStack>
          </Stack>
        )}

        {step === 6 && (
          <Stack gap={4}>
            <Alert.Root status="success" variant="subtle">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Solutions</Alert.Title>
                <Alert.Description>
                  x ≡ {solutions.join(", ")} (mod {n})
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>
            <HStack>
              <Button variant="surface" onClick={() => setStep(5)}>Retour</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setInvProposed("");
                  setX0Proposed("");
                  setStep(0);
                }}
              >
                Nouvel exercice
              </Button>
            </HStack>
          </Stack>
        )}
      </Card.Body>
    </Card.Root>
  );
}
