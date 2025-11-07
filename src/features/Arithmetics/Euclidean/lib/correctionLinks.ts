import {
  FaBookOpen,
  FaLightbulb,
  FaTools,
  FaCheckCircle,
} from "react-icons/fa"

export type ExerciceType = "definition" | "identite" | "euclidienne" | "reste"

export type LinkItem = {
  to: string
  label: string
  icon: React.ComponentType
}

// ✅ Liens pédagogiques spécifiques aux types d'exercices
export const correctionLinks: Record<ExerciceType, LinkItem> = {
  definition: {
    to: "/dash/courses/euclidean/definition",
    label: "Définition de la divisibilité",
    icon: FaBookOpen,
  },
  identite: {
    to: "/dash/courses/euclidean/identite",
    label: "Identité remarquable",
    icon: FaLightbulb,
  },
  euclidienne: {
    to: "/dash/courses/euclidean/division",
    label: "Division euclidienne",
    icon: FaTools,
  },
  reste: {
    to: "/dash/courses/euclidean/reste",
    label: "Reste et factorisation",
    icon: FaCheckCircle,
  },
}

// ✅ Accès programmatique au lien pédagogique d’un exercice
export function getCorrectionLink(type: ExerciceType): LinkItem {
  return correctionLinks[type]
}
