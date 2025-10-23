// roles.ts
export const ROLES = {
  Appreant: 'Apprenant',
  Encadreur: 'Encadreur',
  Administrateur: 'Administrateur',
} as const

export type Role = typeof ROLES[keyof typeof ROLES]

// Optional: stable list for UIs
export const ROLE_ITEMS: { label: string; value: Role }[] = [
  { label: 'Apprenant', value: ROLES.Appreant },
  { label: 'Encadreur', value: ROLES.Encadreur },
  { label: 'Administrateur', value: ROLES.Administrateur },
] as const
