// src/components/MathRenderer.tsx

import { Text } from "@chakra-ui/react";
import { MathJax } from "better-react-mathjax";

interface MathRendererProps {
  /** Expression LaTeX à afficher */
  expression: string;
  /** Affichage inline ou block */
  inline?: boolean;
  /** Props Chakra optionnels pour styliser le texte */
  textProps?: React.ComponentProps<typeof Text>;
}

/**
 * Composant réutilisable pour afficher des expressions LaTeX avec MathJax.
 * Utilise Chakra UI pour la mise en forme et supporte l'affichage inline ou block.
 *
 * 🧠 Onboarding Notes:
 * - Utiliser `inline` pour les expressions intégrées dans du texte.
 * - `expression` doit être une chaîne LaTeX valide.
 * - Peut être stylisé via `textProps` (ex: fontSize, color).
 */
export const MathRender = ({ expression, inline = false, textProps }: MathRendererProps) => {
  return (
    <Text fontFamily="Latin Modern Math" {...textProps}>
      <MathJax inline={inline}>{inline ? `\\(${expression}\\)` : `\

\[${expression}\\]

`}</MathJax>
    </Text>
  );
};
