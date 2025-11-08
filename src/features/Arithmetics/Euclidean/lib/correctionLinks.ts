import {
  FaBookOpen,
  FaLightbulb,
  FaTools,
  FaCheckCircle,
} from "react-icons/fa"

export type ExerciceType =
  | "division-relatifs"
  | "reste-negatif"
  | "identite-remarquable"
  | "disjonction-cas"

export type LinkItem = {
  to: string
  label: string
  icon: React.ComponentType
}

// ✅ Liens pédagogiques spécifiques aux types d'exercices
export const correctionLinks: Record<ExerciceType, LinkItem> = {
  "division-relatifs": {
    to: "/dash/courses/euclidean/division-relatifs",
    label: "Division euclidienne des relatifs",
    icon: FaTools,
  },
  "reste-negatif": {
    to: "/dash/courses/euclidean/reste-negatif",
    label: "Division avec reste négatif",
    icon: FaCheckCircle,
  },
  "identite-remarquable": {
    to: "/dash/courses/euclidean/identite-remarquable",
    label: "Identité remarquable",
    icon: FaLightbulb,
  },
  "disjonction-cas": {
    to: "/dash/courses/euclidean/disjonction-cas",
    label: "Disjonction de cas",
    icon: FaBookOpen,
  },
}

// ✅ Accès programmatique au lien pédagogique d’un exercice
export function getCorrectionLink(type: ExerciceType): LinkItem {
  return correctionLinks[type]
}




