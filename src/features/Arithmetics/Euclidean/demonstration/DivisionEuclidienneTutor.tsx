import {
  Box,
  Heading,
  Text,
  Stack,
  HStack,
  Button,
  Card,
  Dialog,
  NumberInput,
  Switch,
} from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { toaster } from "@/components/ui/toaster";

type Mode = "guide" | "libre";
type Ensemble = "N" | "Z";

function divisionEuclidienne(a: number, b: number) {
  if (b === 0) throw new Error("Division par zéro interdite");
  const absB = Math.abs(b);
  let q = Math.floor(a / b);
  let r = a - b * q;
  if (r < 0) {
    if (b > 0) {
      q -= 1;
      r += absB;
    } else {
      q += 1;
      r += absB;
    }
  }
  return { q, r };
}

export default function DivisionEuclidienneTutor() {
  const [a, setA] = useState<number>(103);
  const [b, setB] = useState<number>(13);
  const [mode, setMode] = useState<Mode>("libre");
  const [ensemble, setEnsemble] = useState<Ensemble>("N");
  const [open, setOpen] = useState(false);

  // Calculs
  const { q, r } = useMemo(() => {
    try {
      return divisionEuclidienne(a, b);
    } catch {
      return { q: 0, r: 0 };
    }
  }, [a, b]);

  const synthese = `Énoncé :
Pour a = ${a}, b = ${b}, il existe un unique couple (q, r) ∈ ℤ² tel que a = bq + r et 0 ≤ r < |b|.

Résultat :
q = ${q}, r = ${r}.
On vérifie : ${b * q} ≤ ${a} < ${b * (q + 1)} et 0 ≤ ${r} < |${b}|.

Conclusion :
Le couple (q, r) est unique.`;

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>
        Division euclidienne interactive
      </Heading>

      {/* Toggles */}
      <HStack mb={6} gap={8}>
        <HStack>
          <Text>Mode guidé</Text>
          <Switch.Root
            checked={mode === "guide"}
            onCheckedChange={(details) =>
              setMode(details.checked ? "guide" : "libre")
            }
          >
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Root>
        </HStack>
        <HStack>
          <Text>Ensemble ℤ</Text>
          <Switch.Root
            checked={ensemble === "Z"}
            onCheckedChange={(details) =>
              setEnsemble(details.checked ? "Z" : "N")
            }
          >
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Root>
        </HStack>
      </HStack>

      {/* Paramètres */}
      <Card.Root mb={6}>
        <Card.Header>
          <Heading size="md">Paramètres</Heading>
        </Card.Header>
        <Card.Body>
          <HStack gap={6}>
            <Box>
              <Text>a (dividende)</Text>
              <NumberInput.Root
                value={a.toString()}
                onValueChange={(details) => setA(Number(details.value))}
              >
                <NumberInput.Input />
                <NumberInput.Control>
                  <NumberInput.IncrementTrigger />
                  <NumberInput.DecrementTrigger />
                </NumberInput.Control>
              </NumberInput.Root>
            </Box>
            <Box>
              <Text>b (diviseur)</Text>
              <NumberInput.Root
                value={b.toString()}
                onValueChange={(details) => setB(Number(details.value))}
              >
                <NumberInput.Input />
                <NumberInput.Control>
                  <NumberInput.IncrementTrigger />
                  <NumberInput.DecrementTrigger />
                </NumberInput.Control>
              </NumberInput.Root>
            </Box>
          </HStack>
        </Card.Body>
      </Card.Root>

      {/* Mode guidé */}
      {mode === "guide" && (
        <Card.Root mb={6}>
          <Card.Header>
            <Heading size="md">Étapes guidées</Heading>
          </Card.Header>
          <Card.Body>
            <Stack gap={4}>
              <Text>1. Propriété d’Archimède : existe-t-il n tel que a &lt; nb ?</Text>
              <HStack>
                <Button
                  onClick={() =>
                    toaster.create({
                      title: "Bonne réponse",
                      description: "Oui, par Archimède, E est non vide.",
                      type: "success",
                    })
                  }
                >
                  Oui
                </Button>
                <Button
                  onClick={() =>
                    toaster.create({
                      title: "Mauvaise réponse",
                      description: "Faux, Archimède garantit l’existence.",
                      type: "error",
                    })
                  }
                >
                  Non
                </Button>
              </HStack>

              <Text>2. Bon ordre : E a-t-il un plus petit élément k ?</Text>
              <HStack>
                <Button
                  onClick={() =>
                    toaster.create({
                      title: "Bonne réponse",
                      description:
                        "Oui, tout sous-ensemble non vide de ℕ a un plus petit élément.",
                      type: "success",
                    })
                  }
                >
                  Oui
                </Button>
                <Button
                  onClick={() =>
                    toaster.create({
                      title: "Mauvaise réponse",
                      description: "Faux, le bon ordre garantit un minimum.",
                      type: "error",
                    })
                  }
                >
                  Non
                </Button>
              </HStack>

              <Text>3. Encadrement : (k−1)b ≤ a &lt; kb ?</Text>
              <HStack>
                <Button
                  onClick={() =>
                    toaster.create({
                      title: "Bonne réponse",
                      description: "Exact, c’est l’encadrement clé.",
                      type: "success",
                    })
                  }
                >
                  Oui
                </Button>
                <Button
                  onClick={() =>
                    toaster.create({
                      title: "Mauvaise réponse",
                      description: "Faux, c’est bien (k−1)b ≤ a &lt; kb.",
                      type: "error",
                    })
                  }
                >
                  Non
                </Button>
              </HStack>

              <Text>4. Définition de q et r</Text>
              <HStack>
                <Button
                  onClick={() =>
                    toaster.create({
                      title: "Bonne réponse",
                      description: "q = k−1, r = a − bq.",
                      type: "success",
                    })
                  }
                >
                  q = k−1, r = a − bq
                </Button>
                <Button
                  onClick={() =>
                    toaster.create({
                      title: "Mauvaise réponse",
                      description: "Non, il faut poser q = k−1.",
                      type: "error",
                    })
                  }
                >
                  Autre
                </Button>
              </HStack>
            </Stack>
          </Card.Body>
        </Card.Root>
      )}

      {/* Mode libre */}
      {mode === "libre" && (
        <Card.Root mb={6}>
          <Card.Header>
            <Heading size="md">Mode libre</Heading>
          </Card.Header>
          <Card.Body>
            <Text>
              Résultat calculé : q = {q}, r = {r}, avec condition 0 ≤ r &lt;{" "}
              {ensemble === "Z" ? `|b| = ${Math.abs(b)}` : b}.
            </Text>
            <Text mt={2}>
              Vérification : {b * q} ≤ {a} &lt; {b * (q + 1)}.
            </Text>
          </Card.Body>
        </Card.Root>
      )}

      {/* Actions */}
      <HStack mt={6} gap={4}>
        <Button colorScheme="blue" onClick={() => setOpen(true)}>
          Synthèse finale
        </Button>
      </HStack>

      {/* Dialog synthèse */}
      <Dialog.Root open={open} onOpenChange={(d) => setOpen(d.open)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.CloseTrigger />
            <Dialog.Header>
              <Dialog.Title>Synthèse finale</Dialog.Title>
                        </Dialog.Header>
            <Dialog.Body>
              <Text whiteSpace="pre-line">{synthese}</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(synthese)}
              >
                Copier
              </Button>
              <Button onClick={() => setOpen(false)} colorScheme="blue">
                Fermer
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
}
