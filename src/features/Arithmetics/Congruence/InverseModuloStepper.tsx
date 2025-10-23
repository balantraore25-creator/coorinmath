import {
  Box,
  Button,
  HStack,
  RadioGroup,
  Stack,
  Text,
  //seDisclosure,
  Separator,
} from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useEffect, useMemo, useState } from "react";
import { NumberField } from "../../../components/fields/NumberField";
import type { EuclidResult } from "./math/extended-euclid";
import { extendedEuclid } from "./math/extended-euclid";
import { bruteForceInverse } from "./math/bruteforce-inverse";
import { gcd, mod } from "./math/number";
import { EuclidStepList } from "../../../components/euclid/EuclidStepList";
import { BezoutVisualizer } from "../../../components/euclid/BezoutVisualizer";
import type { Attempt } from "../../../components/history/AttemptHistory";
import { AttemptHistory } from "../../../components/history/AttemptHistory";

type Props = {
  initialA?: number;
  initialN?: number;
  onValidate?: (payload: {
    a: number;
    n: number;
    method: "euclid" | "bruteforce";
    result: number | null;
    gcd: number;
    steps: EuclidResult["steps"];
  }) => void;
  persistKey?: string;
};

export const InverseModuloStepper = ({
  initialA = 3,
  initialN = 7,
  onValidate,
  persistKey = "inverse-modulo-history",
}: Props) => {
  const [a, setA] = useState(initialA);
  const [n, setN] = useState(initialN);
  const [method, setMethod] = useState<"euclid" | "bruteforce">("euclid");
  const [euclid, setEuclid] = useState<EuclidResult | null>(null);
  const [brute, setBrute] = useState<{ inverse: number | null; tries: number[] } | null>(null);
  const [history, setHistory] = useState<Attempt[]>([]);
  //const disclosure = useDisclosure();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(persistKey);
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, [persistKey]);

  const isInvalidN = useMemo(() => n <= 1, [n]);
  const isInvalidA = useMemo(() => Number.isNaN(a) || Number.isNaN(n), [a, n]);
  const currentGcd = useMemo(() => gcd(a, n), [a, n]);

  const compute = () => {
    if (isInvalidN) {
      toaster.create({ title: "n doit être ≥ 2", type: "warning", duration: 3000 });
      return;
    }
    if (!Number.isFinite(a) || !Number.isFinite(n)) {
      toaster.create({ title: "Entrées invalides", type: "warning", duration: 3000 });
      return;
    }

    if (method === "euclid") {
      const res = extendedEuclid(a, n);
      setEuclid(res);
      setBrute(null);
      onValidate?.({ a, n, method, result: res.inverse, gcd: res.gcd, steps: res.steps });
      pushHistory({ a, n, method, result: res.inverse, gcd: res.gcd, at: new Date().toISOString() });
      toaster.create({
        title: res.inverse !== null
          ? `Inverse trouvé: ${a}⁻¹ mod ${n} = ${res.inverse}`
          : `Pas d’inverse: gcd(${a}, ${n}) = ${res.gcd} ≠ 1`,
        type: res.inverse !== null ? "success" : "error",
        duration: 4000,
      });
    } else {
      const res = bruteForceInverse(a, n);
      setBrute(res);
      setEuclid(null);
      pushHistory({ a, n, method, result: res.inverse, gcd: currentGcd, at: new Date().toISOString() });
      toaster.create({
        title: res.inverse !== null
          ? `Inverse trouvé: ${a}⁻¹ mod ${n} = ${res.inverse}`
          : `Pas d’inverse (essai de 0 à ${n - 1})`,
        type: res.inverse !== null ? "success" : "error",
        duration: 4000,
      });
    }
  };

  const pushHistory = (item: Attempt) => {
    setHistory(prev => {
      const next = [item, ...prev].slice(0, 20);
      try { localStorage.setItem(persistKey, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const verified = useMemo(() => {
    const candidate = method === "euclid" ? euclid?.inverse ?? null : brute?.inverse ?? null;
    if (candidate === null) return { ok: false, a, n, candidate: null };
    return { ok: mod(a * candidate, n) === 1, a, n, candidate };
  }, [a, n, method, euclid, brute]);

  return (
    <Stack gap={6}>
      {/* Toaster rendu ici si tu veux le localiser à ce composant */}
      <Toaster />

      <Box p={4} borderWidth="1px" rounded="md">
        <Text fontWeight="bold" mb={2}>Paramètres</Text>
        <Stack gap={4}>
          <NumberField
            label="Entier a"
            value={a}
            min={-1_000_000}
            onChange={setA}
            isInvalid={isInvalidA}
            error="a invalide"
          />
          <NumberField
            label="Modulo n"
            value={n}
            min={2}
            onChange={setN}
            isInvalid={isInvalidN}
            error="n doit être ≥ 2"
          />
          <Stack>
            <Text fontWeight="medium">Méthode</Text>
            <RadioGroup.Root
              value={method}
              onValueChange={(details) => setMethod(details.value as "euclid" | "bruteforce")}
              colorPalette="teal"
            >
              <HStack gap={6}>
                <RadioGroup.Item value="euclid">
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>Euclide étendu</RadioGroup.ItemText>
                </RadioGroup.Item>
                <RadioGroup.Item value="bruteforce">
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>Brute force (pédagogie)</RadioGroup.ItemText>
                </RadioGroup.Item>
              </HStack>
            </RadioGroup.Root>
          </Stack>
          <HStack>
            <Button colorPalette="teal" onClick={compute}>Calculer</Button>
            <Button variant="outline" onClick={() => { setEuclid(null); setBrute(null); }}>
              Réinitialiser
            </Button>
          </HStack>
        </Stack>
      </Box>

      <Box p={4} borderWidth="1px" rounded="md">
        <Text fontWeight="bold" mb={2}>Résultat</Text>
        {method === "euclid" && euclid && (
          <Stack gap={3}>
            <Text>
              gcd({a}, {n}) = <b>{euclid.gcd}</b>{euclid.gcd === 1 ? `, inverse = ${euclid.inverse}` : ", pas d’inverse"}
            </Text>
            <EuclidStepList steps={euclid.steps} n={n} a={a} />
            <BezoutVisualizer s={euclid.s} t={euclid.t} n={n} a={a} gcd={euclid.gcd} />
          </Stack>
        )}

        {method === "bruteforce" && brute && (
          <Stack gap={2}>
            <Text>
              Essais de x = 0 à {n - 1}. {brute.inverse !== null ? `Trouvé: ${brute.inverse}` : "Aucun x tel que a·x ≡ 1 (mod n)."}
            </Text>
            <Text fontSize="sm" color="fg.muted">
              Tries: {brute.tries.slice(0, 30).join(", ")}{brute.tries.length > 30 ? "…" : ""}
            </Text>
          </Stack>
        )}

        {!euclid && !brute && <Text color="fg.muted">Aucun calcul en cours.</Text>}

        <Separator my={3} />
        <Text fontWeight="medium">Vérification</Text>
        <Text fontSize="sm" color={verified.ok ? "green.600" : "fg.muted"}>
                    {verified.candidate !== null
            ? `Check: (${a} × ${verified.candidate}) mod ${n} = ${(a * verified.candidate) % n} → ${verified.ok ? "OK (≡ 1)" : "Échec"}`
            : "Pas de candidat à vérifier"}
        </Text>
      </Box>

      <Box p={4} borderWidth="1px" rounded="md">
        <Text fontWeight="bold" mb={2}>Historique</Text>
        <AttemptHistory items={history} />
      </Box>
    </Stack>
  );
};
