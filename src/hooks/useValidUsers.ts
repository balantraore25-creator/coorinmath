import { useGetUsersQuery, defaultGetUsersArg } from '../features/users/usersApiSlice'
import type { SanitizedUser } from '../features/users/usersApiSlice'

export const useValidUsers = () => {
  const {
    data: usersData,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useGetUsersQuery(defaultGetUsersArg)

  const users: SanitizedUser[] = isSuccess
    ? usersData.ids
        .map(id => usersData.entities[id])
        .filter((user): user is SanitizedUser => user && typeof user.id === 'string')
    : []

  return {
    users,
    isLoading,
    isError,
    error,
    isSuccess,
  }
}
