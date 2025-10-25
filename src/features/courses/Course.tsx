import {
  TableRow,
  TableCell,
  Text,
  Button,
  chakra,
} from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import { useGetCoursesQuery, defaultGetCoursesArg } from "./coursesApiSlice"
import { memo } from "react"

interface CourseProps {
  courseId: string
}

// ✅ On crée une version Chakra du RouterLink
const RouterChakraLink = chakra(RouterLink)

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

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
    })

  const handleEdit = () => navigate(`/dash/courses/${courseId}`)

  return (
    <TableRow>
      <TableCell>
        <Text
          fontWeight="medium"
          color={course.completed ? "green.600" : "orange.500"}
        >
          {course.completed ? "Terminé" : "Ouvert"}
        </Text>
      </TableCell>
      <TableCell>{formatDate(course.createdAt)}</TableCell>
      <TableCell>{formatDate(course.updatedAt)}</TableCell>
      <TableCell>{course.title}</TableCell>
      <TableCell>{course.username}</TableCell>
      <TableCell>
        {/* ✅ Navigation interne avec RouterChakraLink */}
        <RouterChakraLink
          to={course.link}
          color="teal.500"
          fontWeight="medium"
        >
          🔗 Accéder au cours
        </RouterChakraLink>
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

// ✅ Typage explicite de memo pour conserver les props
export default memo<CourseProps>(Course)
