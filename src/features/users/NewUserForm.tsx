import { useState, useEffect } from 'react'
import { Stack, Input, Button, Heading, Text } from '@chakra-ui/react'
import { FieldRoot, FieldLabel, FieldErrorText } from '@chakra-ui/react/field'
import { useAddUserMutation } from './usersApiSlice' // ← corrige le nom si besoin
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { Role } from '../../config/roles'
import { RoleSelect } from '../../config/RoleSelect'

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error
}

export default function NewUserForm() {
  const [addUser, { isLoading, isSuccess, isError, error }] = useAddUserMutation()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [validUsername, setValidUsername] = useState(false)
  const [password, setPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)
  const [roles, setRoles] = useState<Role[]>(['Apprenant'])

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username])

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password))
  }, [password])

  useEffect(() => {
    if (isSuccess) {
      setUsername('')
      setPassword('')
      setRoles([])
      navigate('/dash/users')
    }
  }, [isSuccess, navigate])

  const hasValidRoles = roles.length > 0
  const canSave = [hasValidRoles, validUsername, validPassword].every(Boolean) && !isLoading

  const onSaveUserClicked = async (e: React.FormEvent) => {
    e.preventDefault()
    if (canSave) {
      await addUser({ username, password, roles })
    }
  }

  const renderErrorMessage = () => {
    if (isError && isFetchBaseQueryError(error)) {
      return (error.data as any)?.message
    }
    return null
  }

  return (
    <Stack as="form" onSubmit={onSaveUserClicked}>
      {renderErrorMessage() && <Text color="red.500">{renderErrorMessage()}</Text>}

      <Heading size="md">Nouvel utilisateur</Heading>

      {/* Nom d'utilisateur */}
      <FieldRoot invalid={!validUsername}>
        <FieldLabel>Nom d’utilisateur [3-20 lettres]</FieldLabel>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="off"
        />
        {!validUsername && <FieldErrorText>Format invalide</FieldErrorText>}
      </FieldRoot>

      {/* Mot de passe */}
      <FieldRoot invalid={!validPassword}>
        <FieldLabel>Mot de passe [4-12 caractères incl. !@#$%]</FieldLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {!validPassword && <FieldErrorText>Format invalide</FieldErrorText>}
      </FieldRoot>

      {/* Rôles */}
      <FieldRoot invalid={!hasValidRoles}>
        <RoleSelect value={roles} onChange={setRoles} />
        {!hasValidRoles && (
          <FieldErrorText>Sélectionne au moins un rôle</FieldErrorText>
        )}
      </FieldRoot>

      {/* Bouton */}
      <Button 
       colorPalette="green" 
       type="submit" 
       disabled={!canSave}
       size="sm"
       variant="ghost"
       display="flex"
       alignItems="center"
       gap={2}
      >
        <FontAwesomeIcon icon={faSave} style={{ marginRight: '0.5rem' }} />
        Enregistrer
      </Button>
    </Stack>
  )
}
