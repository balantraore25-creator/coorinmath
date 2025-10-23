import  { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  HStack,
  Heading,
  Stack,
  Text,
  Button,
  Progress,
  NumberInput,
  Input,
  Tabs,
  Alert,
  Tag,
  VStack,
} from "@chakra-ui/react";

type Step = 0 | 1 | 2 | 3 | 4;

interface Persisted {
  a: number;
  b: number;
  n: number;
  method: "soustraction" | "division" | "egalite";
  kSub?: number;       // quotient proposé pour (a - b) / n
  rA?: number;         // reste de a mod n proposé
  rB?: number;         // reste de b mod n proposé
  kEq?: number;        // k proposé pour a = b + kn
  step: Step;
}

const STORAGE_KEY = "congruence_proof_stepper_v3";

function mod(a: number, n: number) {
  if (n === 0) return NaN;
  const r = a % n;
  return r < 0 ? r + Math.abs(n) : r;
}

export default function CongruenceProofStepper() {
  // Etats principaux
  const [a, setA] = useState(37);
  const [b, setB] = useState(5);
  const [n, setN] = useState(8);
  const [method, setMethod] = useState<Persisted["method"]>("soustraction");
  const [step, setStep] = useState<Step>(0);

  // Saisies élève
  const [kSubInput, setKSubInput] = useState(""); // pour soustraction: (a - b) = k * n
  const [rAInput, setRAInput] = useState("");     // pour division euclidienne: a mod n
  const [rBInput, setRBInput] = useState("");     // pour division euclidienne: b mod n
  const [kEqInput, setKEqInput] = useState("");   // pour égalité: a = b + k n

  // Persistance
  const [persist, setPersist] = useState<Persisted>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw
        ? (JSON.parse(raw) as Persisted)
        : {
            a,
            b,
            n,
            method,
            step: 0,
          };
    } catch {
      return { a, b, n, method, step: 0 };
    }
  });

  const firstMount = useRef(true);
  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      setA(persist.a);
      setB(persist.b);
      setN(persist.n);
      setMethod(persist.method);
      setStep(persist.step);
      if (persist.kSub !== undefined) setKSubInput(String(persist.kSub));
      if (persist.rA !== undefined) setRAInput(String(persist.rA));
      if (persist.rB !== undefined) setRBInput(String(persist.rB));
      if (persist.kEq !== undefined) setKEqInput(String(persist.kEq));
    }
  }, [persist]);

  useEffect(() => {
    const newPersist: Persisted = {
      a,
      b,
      n,
      method,
      kSub: kSubInput === "" ? undefined : Number(kSubInput),
      rA: rAInput === "" ? undefined : Number(rAInput),
      rB: rBInput === "" ? undefined : Number(rBInput),
      kEq: kEqInput === "" ? undefined : Number(kEqInput),
      step,
    };
    setPersist(newPersist);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPersist));
  }, [a, b, n, method, kSubInput, rAInput, rBInput, kEqInput, step]);

  // Progression
  const progress = useMemo(() => {
    switch (step) {
      case 0: return 10;
      case 1: return 45;
      case 2: return 70;
      case 3: return 90;
      case 4: return 100;
      default: return 0;
    }
  }, [step]);

  // Résultats attendus
  const diff = a - b;
  const expectedKSub = n !== 0 ? diff / n : NaN;
  const isDiffDivisible = n !== 0 && Number.isInteger(expectedKSub);

  const expectedRA = useMemo(() => (n !== 0 ? mod(a, Math.abs(n)) : NaN), [a, n]);
  const expectedRB = useMemo(() => (n !== 0 ? mod(b, Math.abs(n)) : NaN), [b, n]);
  const sameRemainder = expectedRA === expectedRB && Number.isFinite(expectedRA);

  const expectedKEq = n !== 0 ? (a - b) / n : NaN;
  const isEqualityValid = n !== 0 && Number.isInteger(expectedKEq);

  // Validations
  function validateMethodSoustraction() {
    if (!Number.isFinite(expectedKSub) || !isDiffDivisible) return;
    if (Number(kSubInput) !== expectedKSub) return;
    setStep(2);
  }
  function validateMethodDivision() {
    if (!Number.isFinite(expectedRA) || !Number.isFinite(expectedRB)) return;
    if (Number(rAInput) !== expectedRA) return;
    if (Number(rBInput) !== expectedRB) return;
    if (expectedRA !== expectedRB) return;
    setStep(3);
  }
  function validateMethodEgalite() {
    if (!Number.isFinite(expectedKEq) || !isEqualityValid) return;
    if (Number(kEqInput) !== expectedKEq) return;
    setStep(4);
  }

  // Résumé final si au moins une méthode est validée
  const anyMethodWorks = isDiffDivisible || sameRemainder || isEqualityValid;

  return (
    <Card.Root size="lg" variant="elevated">
      <Card.Header>
        <HStack justify="space-between" w="100%">
          <Heading size="md">Montrer a ≡ b (mod n)</Heading>
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
            <HStack>
              <LabeledNumber label="a" value={a} onChange={setA} />
              <LabeledNumber label="b" value={b} onChange={setB} />
              <LabeledNumber label="n" value={n} onChange={setN} min={1} />
            </HStack>
            <Text>Choisis la méthode pour construire la preuve :</Text>
            <Tabs.Root
              defaultValue={method}
              value={method}
              onValueChange={(d) => setMethod(d.value as Persisted["method"])}
              variant="enclosed"
              colorPalette="teal"
            >
              <Tabs.List>
                <Tabs.Trigger value="soustraction">Soustraction</Tabs.Trigger>
                <Tabs.Trigger value="division">Division euclidienne</Tabs.Trigger>
                <Tabs.Trigger value="egalite">Égalité</Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="soustraction">
                <MethodExplainer
                  title="Par soustraction"
                  items={[
                    { label: "Idée", text: "Calculer a − b et vérifier si n | (a − b)." },
                    { label: "Critère", text: "Si (a − b) = k · n pour un entier k, alors a ≡ b (mod n)." },
                  ]}
                />
              </Tabs.Content>

              <Tabs.Content value="division">
                <MethodExplainer
                  title="Par division euclidienne"
                  items={[
                    { label: "Idée", text: "Comparer les restes de a et b modulo n." },
                    { label: "Critère", text: "Si a mod n = b mod n, alors a ≡ b (mod n)." },
                  ]}
                />
              </Tabs.Content>

              <Tabs.Content value="egalite">
                <MethodExplainer
                  title="Par égalité"
                  items={[
                    { label: "Idée", text: "Chercher un entier k tel que a = b + k · n." },
                    { label: "Critère", text: "Cette égalité équivaut à a ≡ b (mod n)." },
                  ]}
                />
              </Tabs.Content>
            </Tabs.Root>

            <Button colorPalette="teal" onClick={() => setStep(1)}>
              Commencer la preuve
            </Button>
          </Stack>
        )}

        {step === 1 && (
          <Stack gap={4}>
            <Text>Étape 1 — Choisis ta méthode et propose la valeur demandée.</Text>
            <Tabs.Root
              defaultValue={method}
              value={method}
              onValueChange={(d) => setMethod(d.value as Persisted["method"])}
              variant="enclosed"
              colorPalette="teal"
            >
              <Tabs.List>
                <Tabs.Trigger value="soustraction">Soustraction</Tabs.Trigger>
                <Tabs.Trigger value="division">Division euclidienne</Tabs.Trigger>
                <Tabs.Trigger value="egalite">Égalité</Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="soustraction">
                <Stack gap={3}>
                  <Text>a − b = {a} − {b} = {diff}</Text>
                  <HStack>
                    <Input
                      w="220px"
                      placeholder="Propose k tel que (a − b) = k · n"
                      value={kSubInput}
                      onChange={(e) => setKSubInput(e.target.value)}
                    />
                    <Tag.Root variant={isDiffDivisible ? "solid" : "subtle"} colorPalette={isDiffDivisible ? "green" : "red"}>
                      <Tag.Label>{isDiffDivisible ? "Divisible par n" : "Pas divisible par n"}</Tag.Label>
                    </Tag.Root>
                  </HStack>
                  <Button
                    colorPalette="teal"
                    onClick={validateMethodSoustraction}
                    disabled={!isDiffDivisible}
                    title={!isDiffDivisible ? "Ici (a − b) n'est pas multiple de n" : ""}
                  >
                    Valider la méthode soustraction
                  </Button>
                </Stack>
              </Tabs.Content>

              <Tabs.Content value="division">
                <Stack gap={3}>
                  <HStack>
                    <Input
                      w="220px"
                      placeholder="Propose r_a = a mod n"
                      value={rAInput}
                      onChange={(e) => setRAInput(e.target.value)}
                    />
                    <Input
                      w="220px"
                      placeholder="Propose r_b = b mod n"
                      value={rBInput}
                      onChange={(e) => setRBInput(e.target.value)}
                    />
                  </HStack>
                  <Text>Rappel: r_a attendu = {String(expectedRA)}, r_b attendu = {String(expectedRB)}</Text>
                  <Tag.Root variant={sameRemainder ? "solid" : "subtle"} colorPalette={sameRemainder ? "green" : "orange"}>
                    <Tag.Label>{sameRemainder ? "Reste(s) identique(s)" : "Reste(s) différent(s)"}</Tag.Label>
                  </Tag.Root>
                  <Button
                    colorPalette="teal"
                    onClick={validateMethodDivision}
                    disabled={!sameRemainder}
                    title={!sameRemainder ? "Les restes doivent être égaux" : ""}
                  >
                    Valider la méthode division
                  </Button>
                </Stack>
              </Tabs.Content>

              <Tabs.Content value="egalite">
                <Stack gap={3}>
                  <Text>Chercher k tel que a = b + k · n</Text>
                  <HStack>
                    <Input
                      w="260px"
                      placeholder="Propose k pour a = b + k · n"
                      value={kEqInput}
                      onChange={(e) => setKEqInput(e.target.value)}
                    />
                    <Text>
                      Vérifie: b + k · n = {b} + k · {n}
                    </Text>
                  </HStack>
                  <Tag.Root variant={isEqualityValid ? "solid" : "subtle"} colorPalette={isEqualityValid ? "green" : "orange"}>
                    <Tag.Label>{isEqualityValid ? "k existe (entier)" : "k non entier pour ces valeurs"}</Tag.Label>
                  </Tag.Root>
                  <Button
                    colorPalette="teal"
                    onClick={validateMethodEgalite}
                    disabled={!isEqualityValid}
                    title={!isEqualityValid ? "Ici k doit être entier" : ""}
                  >
                    Valider la méthode égalité
                  </Button>
                </Stack>
              </Tabs.Content>
            </Tabs.Root>

            <HStack>
              <Button variant="surface" onClick={() => setStep(0)}>Retour</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setA(37); setB(5); setN(8);
                  setMethod("soustraction");
                  setKSubInput(""); setRAInput(""); setRBInput(""); setKEqInput("");
                  setStep(0);
                }}
              >
                Réinitialiser
              </Button>
            </HStack>
          </Stack>
        )}

        {step === 2 && (
          <Stack gap={4}>
            <ProofBadge title="Soustraction validée" color="green" />
            <Text>Tu as montré que (a − b) = {diff} est un multiple de n. Donc n | (a − b) et a ≡ b (mod n).</Text>
            <NextOrFinish anyMethodWorks={anyMethodWorks} onNext={() => setStep(3)} />
          </Stack>
        )}

        {step === 3 && (
          <Stack gap={4}>
            <ProofBadge title="Division euclidienne validée" color="green" />
            <Text>Tu as montré que a mod n = b mod n. Donc a et b ont le même reste modulo n, d’où a ≡ b (mod n).</Text>
            <NextOrFinish anyMethodWorks={anyMethodWorks} onNext={() => setStep(4)} />
          </Stack>
        )}

        {step === 4 && (
          <Stack gap={4}>
            <Alert.Root status="success" variant="subtle">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Conclusion</Alert.Title>
                <Alert.Description>
                  Les méthodes confirment que a ≡ b (mod n). Tu peux revoir ou lancer un nouvel exercice.
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>
            <HStack>
              <Button variant="surface" onClick={() => setStep(1)}>Revoir les méthodes</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setKSubInput(""); setRAInput(""); setRBInput(""); setKEqInput("");
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

function MethodExplainer({ title, items }: { title: string; items: { label: string; text: string }[] }) {
  return (
    <Stack gap={2} mt={3}>
      <Heading size="sm">{title}</Heading>
      <Stack gap={1}>
        {items.map((it) => (
          <HStack key={it.label}>
            <Tag.Root variant="subtle" colorPalette="teal"><Tag.Label>{it.label}</Tag.Label></Tag.Root>
            <Text>{it.text}</Text>
          </HStack>
        ))}
      </Stack>
    </Stack>
  );
}

function ProofBadge({ title, color }: { title: string; color: "green" | "teal" | "blue" }) {
  return (
    <Tag.Root variant="solid" colorPalette={color}>
      <Tag.Label>{title}</Tag.Label>
    </Tag.Root>
  );
}

function NextOrFinish({ anyMethodWorks, onNext }: { anyMethodWorks: boolean; onNext: () => void }) {
  return (
    <HStack>
      <Button colorPalette="teal" onClick={onNext}>Continuer</Button>
      {!anyMethodWorks && (
        <Tag.Root variant="subtle" colorPalette="red">
          <Tag.Label>Attention: aucune méthode valide pour ces valeurs</Tag.Label>
        </Tag.Root>
      )}
    </HStack>
  );
}

interface LabeledNumberProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
}
function LabeledNumber({ label, value, onChange, min }: LabeledNumberProps) {
  return (
    <VStack align="start">
      <Text>{label}</Text>
      <NumberInput.Root
        value={value.toString()}
        min={min ?? Number.NEGATIVE_INFINITY}
        onValueChange={(details) => {
          const num = Number(details.value);
          if (!Number.isNaN(num)) onChange(num);
        }}
        w="140px"
      >
        <NumberInput.Input />
        <NumberInput.Control />
      </NumberInput.Root>
    </VStack>
  );
}
