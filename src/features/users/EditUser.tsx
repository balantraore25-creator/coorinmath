import {
  Box,
  Spinner,
  Text,
  Center,
  Heading,
} from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useGetUsersQuery, defaultGetUsersArg } from './usersApiSlice'
import EditUserForm from './EditUserForm'
import { ROLES } from '@/config/roles'
import type { Role } from '@/config/roles'
import type { SanitizedUser } from './usersApiSlice'

/**
 * 🧠 Composant de modification d’un utilisateur
 * Récupère l’utilisateur via RTK Query + entity adapter
 * Sécurise les rôles et affiche un formulaire typé
 */
export default function EditUser() {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return (
      <Center h="100vh">
        <Box textAlign="center">
          <Text color="red.500">Identifiant utilisateur manquant.</Text>
        </Box>
      </Center>
    )
  }

  const { user } = useGetUsersQuery(defaultGetUsersArg, {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id] as SanitizedUser | undefined,
    }),
  })

  if (!user) {
    return (
      <Center h="100vh">
        <Box textAlign="center">
          <Spinner size="xl" color="blue.500" />
          <Text mt={4}>Chargement de l'utilisateur...</Text>
        </Box>
      </Center>
    )
  }

  // ✅ Sécurisation des rôles : cast + filtrage
  const safeRoles = user.roles.filter((r): r is Role =>
    Object.values(ROLES).includes(r as Role)
  )

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>
        Modifier l'utilisateur
      </Heading>
      <EditUserForm
        user={{
          id: user.id,
          username: user.username,
          roles: safeRoles,
          active: user.active,
        }}
      />
    </Box>
  )
}
