import {
  FaTools,
  FaCheckCircle,
  FaCalculator,
} from "react-icons/fa"

export type ExerciceType =
  | "bcd"
  | "8421"
  | "complement2"
  | "ieee754"
  | "addition"
  | "soustraction"
  | "multiplication"
  | "debordement"
  | "division"

export type LinkItem = {
  to: string
  label: string
  icon: React.ComponentType
}

// ✅ Liens pédagogiques spécifiques aux types d'exercices de numération
export const correctionLinks: Record<ExerciceType, LinkItem> = {
  
  bcd: {
    to: "/dash/courses/numeration/conversiondebase",
    label: "Code BCD",
    icon: FaCalculator,
  },
  "8421": {
    to: "/dash/courses/numeration/conversiondebase",
    label: "Code 8421",
    icon: FaCalculator,
  },
  complement2: {
    to: "/dash/courses/numeration/conversiondebase",
    label: "Complément à deux",
    icon: FaCalculator,
  },
  ieee754: {
    to: "/dash/courses/numeration/conversiondebase",
    label: "Représentation IEEE 754",
    icon: FaCalculator,
  },
  addition: {
    to: "/dash/courses/numeration/operations",
    label: "Addition binaire",
    icon: FaTools,
  },
  soustraction: {
    to: "/dash/courses/numeration/operations",
    label: "Soustraction binaire",
    icon: FaTools,
  },
  multiplication: {
    to: "/dash/courses/numeration/operations",
    label: "Multiplication binaire",
    icon: FaTools,
  },
  debordement: {
    to: "/dash/courses/numeration/#debordement",
    label: "Débordement en calcul binaire",
    icon: FaCheckCircle,
  },
  division: {
    to: "/dash/courses/numeration/#division",
    label: "Division binaire",
    icon: FaCheckCircle,
  },
}

// ✅ Accès programmatique au lien pédagogique d’un exercice
export function getCorrectionLink(type: ExerciceType): LinkItem {
  return correctionLinks[type]
}
