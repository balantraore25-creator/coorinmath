import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../features/auth/authSlice'
import { jwtDecode } from 'jwt-decode'
import type { JwtPayload } from 'jwt-decode'


/**
 * Shape of the JWT payload's UserInfo object
 */
interface UserInfo {
  username: string
  roles: string[]
}

/**
 * Shape of the decoded JWT payload
 */
interface DecodedToken extends JwtPayload {
  UserInfo: UserInfo
}

/**
 * Return type for the useAuth hook
 */
interface UseAuthResult {
  username: string
  roles: string[]
  status: 'Apprenant' | 'Encadreur' | 'Administrateur'
  isEncadreur: boolean
  isAdministrateur: boolean
}

const useAuth = (): UseAuthResult => {
  const token = useSelector(selectCurrentToken)
  let isEncadreur = false
  let isAdministrateur = false
  let status: UseAuthResult['status'] = 'Apprenant'
  let username = ''
  let roles: string[] = []

  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token)
      username = decoded.UserInfo.username
      roles = decoded.UserInfo.roles

      isEncadreur = roles.includes('Encadreur')
      isAdministrateur = roles.includes('Administrateur')

      if (isEncadreur) status = 'Encadreur'
      if (isAdministrateur) status = 'Administrateur'
    } catch (error) {
      console.error('Invalid token format', error)
    }
  }

  return { username, roles, status, isEncadreur, isAdministrateur }
}

export default useAuth
