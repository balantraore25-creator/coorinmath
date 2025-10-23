import { TableRow, TableCell, Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useGetUsersQuery, defaultGetUsersArg } from './usersApiSlice'
import type { SanitizedUser } from './usersApiSlice'
import { memo } from 'react'

interface UserProps {
  userId: string
}

/**
 * 🧠 Composant affichant une ligne de tableau pour un utilisateur donné
 * Utilise RTK Query + entity adapter pour accéder aux données normalisées
 * Compatible Chakra UI v3 avec primitives Ark
 */
const User = ({ userId }: UserProps) => {
  const navigate = useNavigate()

  const { user } = useGetUsersQuery(defaultGetUsersArg, {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId] as SanitizedUser | undefined,
    }),
  })

  if (!user) return null

  const handleEdit = () => navigate(`/dash/users/${userId}`)

  return (
    <TableRow>
      <TableCell>{user.username}</TableCell>
      <TableCell>{user.roles.join(', ')}</TableCell>
      <TableCell textAlign="end">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleEdit}
          display="flex"
          alignItems="center"
          gap={2}
        >
          <FontAwesomeIcon icon={faPenToSquare} />
          Modifier
        </Button>
      </TableCell>
    </TableRow>
  )
}

const memoizedUser = memo(User)

export default memoizedUser


