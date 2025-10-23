import { useRef, useState, useEffect } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../app/store'
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import usePersist from '@/hooks/usePersist'

import {
  Box,
  Button,
  Field,
  Input,
  Text,
  Heading,
  VStack,
  Link,
} from '@chakra-ui/react'
import { Checkbox } from '@chakra-ui/react/checkbox'
import { toaster } from '@/components/ui/toaster'

const Login: React.FC = () => {
  const userRef = useRef<HTMLInputElement>(null)
  const errRef = useRef<HTMLParagraphElement>(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [persist, setPersist] = usePersist()

  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const [login, { isLoading }] = useLoginMutation()

  useEffect(() => {
    userRef.current?.focus()
  }, [])

  useEffect(() => {
    setErrMsg('')
  }, [username, password])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const { accessToken } = await login({ username, password }).unwrap()
      dispatch(setCredentials({ accessToken }))
      setUsername('')
      setPassword('')
      navigate('/dash')
    } catch (err: any) {
      const message =
        !err?.status
          ? 'No Server Response'
          : err.status === 400
          ? 'Missing Username or Password'
          : err.status === 401
          ? 'Unauthorized'
          : err.data?.message || 'Login failed'

      setErrMsg(message)
      errRef.current?.focus()

      toaster.create({
        title: 'Login Error',
        description: message,
        type: 'error',
        duration: 5000,
      })
    }
  }

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="lg">Chargement...</Text>
      </Box>
    )
  }

  return (
    <Box
      as="section"
      maxW="md"
      mx="auto"
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
    >
      <Heading mb={6} textAlign="center">
        Connexion Apprénant
      </Heading>

      {errMsg && (
        <Text
          ref={errRef}
          color="red.500"
          mb={4}
          aria-live="assertive"
          role="alert"
        >
          {errMsg}
        </Text>
      )}

      {/* Formulaire natif + Field.Root par champ */}
      <form onSubmit={handleSubmit} noValidate>
        <VStack align="stretch">
          <Field.Root required>
            <Field.Label htmlFor="username">Utilisateur</Field.Label>
            <Input
              id="username"
              name="username"
              type="text"
              ref={userRef}
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              autoComplete="username"
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label htmlFor="password">Mot de passe</Field.Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              autoComplete="current-password"
            />
          </Field.Root>

          <Field.Root>
            <Checkbox.Root
             id="persist"
             checked={persist}
             onCheckedChange={(details) => setPersist(details.checked === true)}
            >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Faites confiance à cet appareil</Checkbox.Label>
            </Checkbox.Root>
          </Field.Root>

          <Button type="submit" colorPalette="teal" width="full">
            Connexion
          </Button>
        </VStack>
      </form>

      <Box mt={6} textAlign="center">
        <Link asChild color="teal.500">
          <RouterLink to="/">Rétour à l'acceuil</RouterLink>
        </Link>
      </Box>
    </Box>
  )
}

export default Login
