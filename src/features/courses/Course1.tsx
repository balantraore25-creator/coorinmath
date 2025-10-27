import {

  TableRow,
  TableCell,
  Text,
  Link,
  Button,
} from '@chakra-ui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useGetCoursesQuery, defaultGetCoursesArg } from './coursesApiSlice'
import { memo } from 'react'

interface CourseProps {
  courseId: string
}

/**
 * 🧠 Composant affichant une ligne de tableau pour un cours donné
 * Utilise RTK Query + entity adapter pour accéder aux données normalisées
 */
const Course = ({ courseId }: CourseProps) => {
  const navigate = useNavigate()

  // 📦 Sélectionne le cours depuis le cache RTK Query
  const { course } = useGetCoursesQuery(defaultGetCoursesArg, {
    selectFromResult: ({ data }) => ({
      course: data?.entities[courseId],
    }),
  })

  if (!course) return null

  const created = new Date(course.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
  })

  const updated = new Date(course.updatedAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
  })

  const handleEdit = () => navigate(`/dash/courses/${courseId}`)

  return (
    <TableRow>
      <TableCell>
        <Text
          fontWeight="medium"
          color={course.completed ? 'green.600' : 'orange.500'}
        >
          {course.completed ? 'Terminé' : 'Ouvert'}
        </Text>
      </TableCell>
      <TableCell>{created}</TableCell>
      <TableCell>{updated}</TableCell>
      <TableCell>{course.title}</TableCell>
      <TableCell>{course.username}</TableCell>
      <TableCell>
        <Link
          variant="underline"
          href={course.link}
          colorPalette="teal"
         
        >
          🔗 Accéder au cours
        </Link>
      </TableCell>
      <TableCell textAlign="end">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleEdit}
          display="flex"
          alignItems="center"
          gap={2}
        >
          <FontAwesomeIcon icon={faPenToSquare} />
          Modifier
        </Button>
      </TableCell>
    </TableRow>
  )
}

const memoizedCourse = memo(Course)

export default memoizedCourse


