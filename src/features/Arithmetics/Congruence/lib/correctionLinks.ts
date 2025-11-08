import {
  FaTools,
  FaCheckCircle,
  FaBookOpen,
  FaLightbulb,
  FaCalculator,
} from "react-icons/fa"

export type ExerciceType =
  | "simple"
  | "equationmod"
  | "fermat"
  | "period"
  | "inversemod"
  | "classmod"

export type LinkItem = {
  to: string
  label: string
  icon: React.ComponentType
}

export const correctionLinks: Record<ExerciceType, LinkItem> = {
  simple: {
    to: "/dash/courses/congruence/simple",
    label: "Définition de la congruence",
    icon: FaBookOpen,
  },
  equationmod: {
    to: "/dash/courses/congruence/eqmodulaire",
    label: "Équations modulaires",
    icon: FaTools,
  },
  fermat: {
    to: "/dash/courses/congruence/fermat",
    label: "Petit théorème de Fermat",
    icon: FaLightbulb,
  },
  period: {
    to: "/dash/courses/congruence/periodicite",
    label: "Périodicité des puissances",
    icon: FaCheckCircle,
  },
  inversemod: {
    to: "/dash/courses/congruence/inversemodulon",
    label: "Inverse modulo n",
    icon: FaCalculator,
  },
  classmod: {
    to: "/dash/courses/congruence/classmodulon",
    label: "Classes de congruence modulo n",
    icon: FaBookOpen,
  },
}

export function getCorrectionLink(type: ExerciceType): LinkItem {
  return correctionLinks[type]
}
