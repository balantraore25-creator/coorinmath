import { useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faFileCirclePlus,
  faFilePen,
  faUserGear,
  faUserPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons"
import { useNavigate, Link as RouterLink, useLocation } from "react-router-dom"
import { useSendLogoutMutation } from "../features/auth/authApiSlice"
import useAuth from "../hooks/useAuth"
import PulseLoader from "react-spinners/PulseLoader"
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  //IconButton
} from "@chakra-ui/react"

const DASH_REGEX = /^\/dash(\/)?$/
const COURSES_REGEX = /^\/dash\/courses(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

const DashHeader: React.FC = () => {
 const { isEncadreur, isAdministrateur } = useAuth()

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation()

  useEffect(() => {
    if (isSuccess) navigate("/")
  }, [isSuccess, navigate])

  const onNewCourseClicked = () => navigate("/dash/courses/new")
  const onNewUserClicked = () => navigate("/dash/users/new")
  const onCoursesClicked = () => navigate("/dash/courses")
  const onUsersClicked = () => navigate("/dash/users")

  const showSmallHeader =
    !DASH_REGEX.test(pathname) &&
    !COURSES_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)

  const newCourseButton =
    COURSES_REGEX.test(pathname) ? (
      <Button
        aria-label="New Course"
        onClick={() => onNewCourseClicked()}
         variant="solid"
        size="xl"
        p={4}
        h="60px"
        minW="60px"
        colorScheme="teal"
        borderRadius="md"
        transition="all 0.3s ease"
        _hover={{
        transform: "scale(1.1)",
        bg: "whiteAlpha.300",
       }}
      >
      <FontAwesomeIcon icon={faFileCirclePlus} size="xl" />
    </Button>
    ) : null

  const newUserButton =
    USERS_REGEX.test(pathname) ? (
      <Button
        aria-label="New User"
        onClick={() => onNewUserClicked()}
         variant="solid"
        size="xl"
        p={4}
        h="60px"
        minW="60px"
        colorScheme="teal"
        borderRadius="md"
        transition="all 0.3s ease"
        _hover={{
        transform: "scale(1.1)",
        bg: "whiteAlpha.300",
       }}
       
      >
      <FontAwesomeIcon icon={faUserPlus} size="xl" />
    </Button>
    ) : null

  const userButton =
    (isEncadreur || isAdministrateur) &&
    !USERS_REGEX.test(pathname) &&
    pathname.includes("/dash") ? (
      <Button
        aria-label="Users"
        onClick={() => onUsersClicked()}
        variant="solid"
        size="xl"
        p={4}
        h="60px"
        minW="60px"
        colorScheme="teal"
        borderRadius="md"
        transition="all 0.3s ease"
        _hover={{
        transform: "scale(1.1)",
        bg: "whiteAlpha.300",
       }}
      >
       <FontAwesomeIcon icon={faUserGear} size="xl" />
    </Button>
    ) : null

  const coursesButton =
    !COURSES_REGEX.test(pathname) && pathname.includes("/dash") ? (
      <Button
        aria-label="Courses"
        onClick={() => onCoursesClicked()}
        variant="solid"
        size="xl"
        p={4}
        h="60px"
        minW="60px"
        colorScheme="teal"
        borderRadius="md"
        transition="all 0.3s ease"
        _hover={{
        transform: "scale(1.1)",
        bg: "whiteAlpha.300",
       }}
      >
       <FontAwesomeIcon icon={faFilePen} size="xl" />
    </Button>
    ) : null

  const logoutButton = (
    <Button
     aria-label="Logout"
      onClick={() => sendLogout()}
      colorScheme="red"
      variant="solid"
      size="xl"
      p={4}
      h="60px"
      minW="60px"
      borderRadius="md"
      transition="all 0.3s ease"
      _hover={{
        transform: "scale(1.1)",
        bg: "whiteAlpha.300",
      }}
    >
      <FontAwesomeIcon icon={faRightFromBracket} size="xl"/>
    </Button>
  )

  const buttonContent = isLoading ? (
    <PulseLoader color="#FFF" />
  ) : (
    <>
      {newCourseButton}
      {newUserButton}
      {coursesButton}
      {userButton}
      {logoutButton}
    </>
  )

  return (
    <Box as="header"  bg="gray.800" color="white"  py={3} px={4}>
      {isError && (
        <Text color="red.300" mb={2}>
          {(error as { data?: { message?: string } })?.data?.message}
        </Text>
      )}
      <Flex
        align="center"
        justify="space-between"
        flexDir={showSmallHeader ? "row" : "row"}
       
      >
       <RouterLink to="/dash">
        <Heading size="md" color="white">
          Siram@th
        </Heading>
      </RouterLink>
        <Flex gap={3} align="center">
          {buttonContent}
        </Flex>
      </Flex>
    </Box>
  )
}

export default DashHeader





