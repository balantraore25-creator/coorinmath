import { useGetCoursesQuery, defaultGetCoursesArg } from './coursesApiSlice'
import { useValidUsers } from '../../hooks/useValidUsers'
import  NewCourseForm  from "./NewCourseForm" // ✅ correct
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



