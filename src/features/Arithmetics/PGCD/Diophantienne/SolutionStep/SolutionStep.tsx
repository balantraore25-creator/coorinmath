// src/features/Arithmetics/PGCD/Diophantienne/SolutionStep/SolutionStep.tsx

import {
  VStack,
  Text,
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@chakra-ui/react";

import { SolutionPreview } from "./SolutionPreview";
import { GeneraleSolution } from "./GeneraleSolution";
import { ChallengeMatricielle } from "./ChallengeMatricielle";

interface SolutionStepProps {
  a: number;
  b: number;
  c: number;
}

export const SolutionStep = ({ a, b, c }: SolutionStepProps) => {
  // ⚡ Exemple de solution particulière (à remplacer par ton algo d’Euclide étendu)
  const x0 = 1;
  const y0 = (c - a * x0) / b; // si b ≠ 0

  return (
    <VStack align="stretch" gap={6}>
      <Text fontWeight="bold" fontSize="lg">
        Résolution de {a}x + {b}y = {c}
      </Text>

      <TabsRoot defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
          <TabsTrigger value="generale">Solution générale</TabsTrigger>
          <TabsTrigger value="challenge">Challenge</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <SolutionPreview x0={x0} y0={y0} equation={{ a, b, c }} />
        </TabsContent>

        <TabsContent value="challenge">
          <ChallengeMatricielle
            a={a}
            b={b}
            onSuccess={(u, v) =>
              console.log(`✅ Coefficients de Bézout trouvés : u=${u}, v=${v}`)
            }
          />
        </TabsContent>

         <TabsContent value="generale">
          <GeneraleSolution a={a} b={b} c={c} />
        </TabsContent>
      </TabsRoot>
    </VStack>
  );
};
