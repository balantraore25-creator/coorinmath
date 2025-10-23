import { useGetCoursesQuery, defaultGetCoursesArg } from './coursesApiSlice'
import { useValidUsers } from '../../hooks/useValidUsers'
import NewCourseForm from './NewCourseForm'
import PulseLoader from 'react-spinners/PulseLoader'
//import useTitle from '../../hooks/useTitle'
import { restoreUser } from '../../utils/usersUtils'
import type { User } from '../../types/user'

const NewCourse = () => {
  //useTitle('techCourses: New Course')

  const {
    users: sanitizedUsers,
    isLoading: isUsersLoading,
  } = useValidUsers()

  const {
  
    isLoading: isCoursesLoading,
  } = useGetCoursesQuery(defaultGetCoursesArg)

  const users: User[] = sanitizedUsers.map(restoreUser)

  if (isUsersLoading || isCoursesLoading || !users.length) {
    return <PulseLoader color="#FFF" />
  }

  return <NewCourseForm users={users} />
}

export default NewCourse




/*import { useSelector } from 'react-redux'
import type { RootState } from '../../app/store' // adapte le chemin si besoin
import { selectAllUsers } from '../users/usersApiSlice'
import NewCourseForm from './NewCourseForm'
import { Alert } from '@chakra-ui/react'

const NewCourse: React.FC = () => {
  const users = useSelector((state: RootState) => selectAllUsers(state))

  if (!users?.length) {
    return (
       <Alert.Root status="info" title="This is the alert title">
      <Alert.Indicator />
      <Alert.Title>Aucun cours disponible pour le moment</Alert.Title>
    </Alert.Root>
    )
  }

  return <NewCourseForm users={users} />
}

export default NewCourse*/
