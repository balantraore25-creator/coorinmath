import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { store } from '@/app/store'
import {
  coursesApiSlice,
  defaultGetCoursesArg,
} from '@/features/courses/coursesApiSlice'
import {
  usersApiSlice,
  defaultGetUsersArg,
} from '@/features/users/usersApiSlice'

/**
 * 🧠 Composant de préchargement des données critiques
 * Utilisé pour initier les requêtes RTK Query dès le montage
 */
const Prefetch = () => {
  useEffect(() => {
    console.log('📡 Subscribing to course & user data')

    const coursesSubscription = store.dispatch(
      coursesApiSlice.endpoints.getCourses.initiate(defaultGetCoursesArg)
    )
    const usersSubscription = store.dispatch(
      usersApiSlice.endpoints.getUsers.initiate(defaultGetUsersArg)
    )

    return () => {
      console.log('🧹 Unsubscribing from course & user data')
      coursesSubscription.unsubscribe()
      usersSubscription.unsubscribe()
    }
  }, [])

  return <Outlet />
}

export default Prefetch







