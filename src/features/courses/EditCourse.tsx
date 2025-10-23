import { useParams } from 'react-router-dom'
import { Alert, Spinner } from '@chakra-ui/react'
import EditCourseForm from './EditCourseForm'
import { useGetCoursesQuery, defaultGetCoursesArg } from './coursesApiSlice'
import useAuth from '../../hooks/useAuth'
import { getErrorMessage } from '../../utils/errorUtils'
import { useValidUsers } from '../../hooks/useValidUsers'
import { restoreUser } from '../../utils/usersUtils'
import type { Course } from '../../types/course'
import type { User } from '../../types/user'

const EditCourse = () => {
  const { id } = useParams<{ id: string }>()
  const { username, isEncadreur, isAdministrateur } = useAuth()

  const {
    data: courses,
    isLoading: isCoursesLoading,
    isError: isCoursesError,
    error: coursesError,
    isSuccess: isCoursesSuccess,
  } = useGetCoursesQuery(defaultGetCoursesArg)

  const {
    users: sanitizedUsers,
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
  } = useValidUsers()

  const course = isCoursesSuccess && id ? courses?.entities[id] : undefined
  const users: User[] = sanitizedUsers.map(restoreUser)

  // 🔍 Vérification défensive
  const isCourseValid = course && typeof course === 'object' && 'id' in course
  const hasAccess = isEncadreur || isAdministrateur || course?.username === username

  // ⏳ Chargement
  if (isCoursesLoading || isUsersLoading) {
    return (
      <Alert.Root borderStartWidth="3px" borderStartColor="colorPalette.600">
        <Alert.Indicator>
          <Spinner size="sm" />
        </Alert.Indicator>
        <Alert.Title>Chargement des données...</Alert.Title>
      </Alert.Root>
    )
  }

  // ❌ Erreurs de requête
  if (isCoursesError || isUsersError) {
    return (
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Title>{getErrorMessage(coursesError || usersError)}</Alert.Title>
      </Alert.Root>
    )
  }

  // ❌ Données manquantes ou invalides
  if (!id || !isCourseValid || users.length === 0) {
    return (
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Title>Le cours ou les utilisateurs sont introuvables.</Alert.Title>
      </Alert.Root>
    )
  }

  // 🚫 Accès non autorisé
  if (!hasAccess) {
    return (
      <Alert.Root status="warning">
        <Alert.Indicator />
        <Alert.Title>Accès refusé : vous n’êtes pas autorisé à modifier ce cours.</Alert.Title>
      </Alert.Root>
    )
  }

  // ✅ Rendu du formulaire
  return <EditCourseForm course={course as Course} users={users} />
}

export default EditCourse
