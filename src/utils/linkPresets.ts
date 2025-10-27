// utils/linkPresets.ts
import {
  FaDivide,
  FaSortNumericDown,
  FaEquals,
  FaInfinity,
 
} from "react-icons/fa"
import type { IconType } from "react-icons"

// ✅ Interface pour les liens rapides
export interface LinkItem {
  to: string
  label: string
  icon: IconType
}

// ✅ Collection centralisée des liens pédagogiques
export const linkCollection: LinkItem[] = [
  {
    to: "https://siramath.onrender.com/dash/courses/euclidean",
    label: "Division Euclidienne",
    icon: FaDivide,
  },
  {
    to: "https://siramath.onrender.com/dash/courses/numeration",
    label: "Numeration",
    icon: FaSortNumericDown,
  },
  {
    to: "https://siramath.onrender.com/dash/courses/pgcd",
    label: "PGCD",
    icon: FaEquals,
  },
  {
    to: "https://siramath.onrender.com/dash/courses/congruence",
    label: "Congruence mod n",
    icon: FaInfinity,
  },
  
]

