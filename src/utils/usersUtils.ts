// src/utils/userUtils.ts
import type { SanitizedUser } from '../features/users/usersApiSlice'
import type { User } from '../types/user'

export const restoreUser = (u: SanitizedUser): User => ({
  ...u,
  _id: u.id
})
