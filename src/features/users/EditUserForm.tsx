import { useState, useEffect } from 'react'
import { Input, Checkbox, Stack, HStack, Heading, Text } from '@chakra-ui/react'
import { FieldRoot, FieldLabel, FieldErrorText } from '@chakra-ui/react/field'
import { useUpdateUserMutation, useDeleteUserMutation } from './usersApiSlice'
import { useNavigate } from 'react-router-dom'
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Icon } from "@chakra-ui/react"
import { FaSave, FaTrash } from "react-icons/fa" // ou FontAwesome
//import {  faTrashCan } from '@fortawesome/free-solid-svg-icons'
//import { isFetchBaseQueryError } from '@reduxjs/toolkit/query'



import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { Role } from '../../config/roles'
import { RoleSelect } from '../../config/RoleSelect'


const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

// ✅ Type guard maison
function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error
}

interface EditUserFormProps {
  user: {
    id: string
    username: string
    roles: Role[]
    active: boolean
  }
}

interface UpdateUserPayload {
  id: string
  username: string
  password?: string
  roles: Role[]
  active: boolean
}

export default function EditUserForm({ user }: EditUserFormProps) {
  const [updateUser, { isLoading, isSuccess, isError, error }] = useUpdateUserMutation()
  const [deleteUser, { isSuccess: isDelSuccess, isError: isDelError, error: delError }] =
    useDeleteUserMutation()
  const navigate = useNavigate()

  const [username, setUsername] = useState(user.username)
  const [validUsername, setValidUsername] = useState(false)
  const [password, setPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)
  const [roles, setRoles] = useState<Role[]>(user.roles)
  const [active, setActive] = useState(user.active)

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
    setValidPassword(PWD_REGEX.test(password))
  }, [username, password])

  useEffect(() => {
    if (isSuccess || isDelSuccess) navigate('/dash/users')
  }, [isSuccess, isDelSuccess, navigate])

  const hasValidRoles = roles.length > 0
  const hasValidUser = validUsername && hasValidRoles
  const hasValidPwd = password ? validPassword : true
  const canSave = hasValidUser && hasValidPwd && !isLoading

 const onSaveUserClicked = async () => {
  const payload: UpdateUserPayload = password
    ? { id: user.id, username, password, roles, active }
    : { id: user.id, username, roles, active }

  try {
    await updateUser(payload).unwrap()
  } catch (err) {
    console.error("Erreur lors de la mise à jour :", err)
  }
}

const onDeleteUserClicked = async () => {
  try {
    await deleteUser(user.id).unwrap()
  } catch (err) {
    console.error("Erreur lors de la suppression :", err)
  }
}


  const renderErrorMessage = () => {
    if (isError && isFetchBaseQueryError(error)) return (error.data as any)?.message
    if (isDelError && isFetchBaseQueryError(delError)) return (delError.data as any)?.message
    return null
  }

  return (
    <Stack as="form" onSubmit={(e) => e.preventDefault()}>
      {renderErrorMessage() && <Text color="red.500">{renderErrorMessage()}</Text>}
      <Heading size="md">Modifier l’utilisateur</Heading>

      <FieldRoot invalid={!validUsername}>
        <FieldLabel>Nom d’utilisateur [3-20 lettres]</FieldLabel>
        <Input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="off" />
        {!validUsername && <FieldErrorText>Format invalide</FieldErrorText>}
      </FieldRoot>

      <FieldRoot invalid={password.length > 0 && !validPassword}>
        <FieldLabel>Mot de passe [vide = pas de changement] [4-12 caractères incl. !@#$%]</FieldLabel>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {password && !validPassword && <FieldErrorText>Format invalide</FieldErrorText>}
      </FieldRoot>

      <FieldRoot invalid={!hasValidRoles}>
        <RoleSelect value={roles} onChange={setRoles} />
        {!hasValidRoles && <FieldErrorText>Sélectionne au moins un rôle</FieldErrorText>}
      </FieldRoot>

      <Checkbox.Root
  checked={active}
  onCheckedChange={(e) => setActive(!!e.checked)}
>
  <Checkbox.HiddenInput />
  <Checkbox.Control />
  <Checkbox.Label>Actif</Checkbox.Label>
</Checkbox.Root>


      <HStack>
        <Button
  colorPalette="green"
  onClick={onSaveUserClicked}
  disabled={!canSave}
>
  <Icon>
    <FaSave />
  </Icon>
  Enregistrer
</Button>
        <Button
  colorPalette="red"
  onClick={onDeleteUserClicked}
>
 <Icon>
    <FaTrash />
  </Icon>
  Supprimer
</Button>
      </HStack>
    </Stack>
  )
}
