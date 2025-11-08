import {
  FaTools,
  FaCheckCircle,
  FaBookOpen,
  FaLightbulb,
  FaCalculator,
} from "react-icons/fa"

export type ExerciceType =
  | "pgcd"
  | "ppmc"
  | "relation"
  | "bezout"
  | "gauss"
  | "corollaire"
  | "premiers"
  | "diophantienne"
  | "reduction"
  | "lemme"

export type LinkItem = {
  to: string
  label: string
  icon: React.ComponentType
}

export const correctionLinks: Record<ExerciceType, LinkItem> = {
  pgcd: {
    to: "/dash/courses/pgcd/gcdcalculate",
    label: "Calcul du PGCD",
    icon: FaCalculator,
  },
  ppmc: {
    to: "/dash/courses/pgcd/gcdcalculate",
    label: "Calcul du PPMC",
    icon: FaCalculator,
  },
  relation: {
    to: "/dash/courses/pgcd/proprietes",
    label: "Relation entre PGCD et PPMC",
    icon: FaLightbulb,
  },
  bezout: {
    to: "/dash/courses/pgcd/bezout",
    label: "Identité de Bézout",
    icon: FaTools,
  },
  gauss: {
    to: "/dash/courses/pgcd/divisibility",
    label: "Théorème de Gauss",
    icon: FaBookOpen,
  },
  corollaire: {
    to: "/dash/courses/pgcd/divisibility",
    label: "Corollaire du théorème de Gauss",
    icon: FaCheckCircle,
  },
  premiers: {
    to: "/dash/courses/pgcd/divisibility",
    label: "Nombres premiers et coprimauté",
    icon: FaLightbulb,
  },
  diophantienne: {
    to: "/dash/courses/pgcd/diophantienne",
    label: "Équations diophantiennes",
    icon: FaTools,
  },
  reduction: {
    to: "/dash/courses/pgcd/applications",
    label: "Réduction de fractions",
    icon: FaCalculator,
  },
  lemme: {
    to: "/dash/courses/pgcd/divisibility",
    label: "Lemme de Gauss",
    icon: FaBookOpen,
  },
}

export function getCorrectionLink(type: ExerciceType): LinkItem {
  return correctionLinks[type]
}
