import { Outlet, Link as RouterLink } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useRefreshMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from './authSlice'
import.meta.env.MODE


import {
  Box,
  Spinner,
  Text,
} from '@chakra-ui/react'

const PersistLogin = (): React.ReactElement => {
  const [persist] = usePersist()
  const token = useSelector(selectCurrentToken)
  const effectRan = useRef(false)
  const [trueSuccess, setTrueSuccess] = useState(false)

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] = useRefreshMutation()

  useEffect(() => {
   // if (effectRan.current === true || process.env.NODE_ENV !== 'development') 
      if (effectRan.current === true || import.meta.env.MODE !== 'development') {
      const verifyRefreshToken = async () => {
        try {
          await refresh()
          setTrueSuccess(true)
        } catch (err) {
          console.error(err)
        }
      }

      if (!token && persist) verifyRefreshToken()
    }

    return () => {
      effectRan.current = true
    }
  }, [])

  const content: React.ReactElement = (() => {
    if (!persist) return <Outlet />
   

    if (isLoading) {
      return (
        <Box textAlign="center" py={10}>
          <Spinner size="lg" />
          <Text mt={4}>Loading...</Text>
        </Box>
      )
    }

    if (isError) {
      const message =
        'status' in error
          ? (error.data as { message?: string })?.message ?? 'Login failed'
          : 'An unexpected error occurred'

      return (
        <Box textAlign="center" py={10}>
          <Text color="red.500" mb={2}>
            {message}
          </Text>
           <RouterLink to="/login" color="teal.500">
               Please login again     
            </RouterLink>
        </Box>
      )
    }

    if ((isSuccess && trueSuccess) || (token && isUninitialized)) {
      return <Outlet />
    }

    return (
      <Box textAlign="center" py={10}>
        <Text>Verifying session...</Text>
      </Box>
    )
  })()

  return content
}

export default PersistLogin
