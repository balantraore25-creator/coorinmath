import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Input,
  Textarea,
  Icon,
  Field,
  Select,
  createListCollection,
  Tooltip,
  IconButton,
  Flex,
} from "@chakra-ui/react"
import {
  FaSave,
  FaDivide,
  FaSortNumericDown,
  FaEquals,
  FaInfinity,
} from "react-icons/fa"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAddCourseMutation } from "./coursesApiSlice"
import type { SanitizedUser } from "../users/usersApiSlice"

interface NewCourseFormProps {
  users: SanitizedUser[]
}

const MotionIconButton = motion(IconButton)

const linkCollection = [
  { to: "/dash/courses/euclidean", label: "Euclidean Division", icon: <FaDivide /> },
  { to: "/dash/courses/numeration", label: "Numeration", icon: <FaSortNumericDown /> },
  { to: "/dash/courses/pgcd", label: "GCD", icon: <FaEquals /> },
  { to: "/dash/courses/congruence", label: "Congruence mod n", icon: <FaInfinity /> },
]

const NewCourseForm = ({ users }: NewCourseFormProps) => {
  const [addCourse, { isLoading, isSuccess, isError, error }] = useAddCourseMutation()
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [assignedUsers, setAssignedUsers] = useState<string[]>([])
  const [linkType, setLinkType] = useState<string>("")

  const userCollection = createListCollection({
    items: users.map((user) => ({
      label: user.username,
      value: user.id,
    })),
  })

  useEffect(() => {
    if (isSuccess) {
      setTitle("")
      setText("")
      setAssignedUsers([])
      setLinkType("")
      navigate("/dash/courses")
    }
  }, [isSuccess, navigate])

  const canSave =
    Boolean(title && text && assignedUsers.length > 0 && linkType !== "") &&
    !isLoading

  const onSaveCourseClicked = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (canSave) {
      await addCourse({ title, text, user: assignedUsers[0], link: linkType })
    }
  }

  return (
    <Box maxW="lg" mx="auto" py={6}>
      <Heading size="md" mb={4}>
        New Course
      </Heading>

      {isError && (
        <Text color="red.500" mb={4}>
          {"data" in error && typeof error.data === "object"
            ? (error.data as { message?: string }).message
            : "Error while saving the course"}
        </Text>
      )}

      <form onSubmit={onSaveCourseClicked}>
        <VStack align="stretch" gap={4}>
          {/* Champ Titre */}
          <Field.Root required invalid={!title}>
            <Field.Label>Title</Field.Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Course title"
            />
            {!title && <Field.ErrorText>Title is required</Field.ErrorText>}
          </Field.Root>

          {/* Champ Contenu */}
          <Field.Root required invalid={!text}>
            <Field.Label>Content</Field.Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Course content"
              resize="vertical"
            />
            {!text && <Field.ErrorText>Content is required</Field.ErrorText>}
          </Field.Root>

          {/* Champ Type de lien */}
          <Field.Root required invalid={!linkType}>
            <Field.Label>Link Type</Field.Label>
            <Select.Root
              collection={createListCollection({
                items: linkCollection.map(({ to, label }) => ({
                  value: to,
                  label,
                })),
              })}
              value={[linkType]}
              onValueChange={({ value }) => setLinkType(value[0])} // ✅ sélection seule
            >
              <Select.HiddenSelect name="linkType" />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select a link type" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                  <Select.ClearTrigger aria-label="Clear selection" />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content>
                  {linkCollection.map(({ to, label, icon }) => (
                    <Select.Item key={to} item={{ value: to, label }}>
                      <Flex align="center" gap={2}>
                        <Icon as={() => icon} />
                        <Text>{label}</Text>
                      </Flex>
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
            {!linkType && <Field.ErrorText>Link type is required</Field.ErrorText>}
          </Field.Root>

          {/* Champ Assignation utilisateur */}
          <Field.Root required invalid={assignedUsers.length === 0}>
            <Field.Label>Assigned to</Field.Label>
            <Select.Root
              multiple
              collection={userCollection}
              value={assignedUsers}
              onValueChange={({ value }) => setAssignedUsers(value)}
            >
              <Select.HiddenSelect name="assignedUsers" />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select one or more users" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                  <Select.ClearTrigger aria-label="Clear selection" />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content>
                  {userCollection.items.map((item) => (
                    <Select.Item key={item.value} item={item}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
            {assignedUsers.length === 0 && (
              <Field.ErrorText>At least one user must be selected</Field.ErrorText>
            )}
          </Field.Root>

          {/* Bouton Save */}
          <Button type="submit" colorScheme="teal" disabled={!canSave}>
             <Icon>
              <FaSave />
            
            </Icon>
            Save
          </Button>
        </VStack>
      </form>

      {/* 🚀 Section liens rapides (navigation uniquement ici) */}
      <Flex gap={4} mt={8} justify="center">
        {linkCollection.map(({ to, label, icon }) => (
          <Tooltip.Root key={to} openDelay={300} closeDelay={100}>
            <Tooltip.Trigger asChild>
              <Link to={to}>
                <MotionIconButton
                  aria-label={label}
                  variant="ghost"
                  whileHover={{ scale: 1.2, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                   {icon}
                </MotionIconButton> 
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Positioner>
              <Tooltip.Content
                bg="gray.800"
                color="white"
                px={3}
                py={2}
                borderRadius="md"
                fontSize="sm"
              >
                {label}
                <Tooltip.Arrow />
              </Tooltip.Content>
            </Tooltip.Positioner>
          </Tooltip.Root>
        ))}
      </Flex>
    </Box>
  )
}

export default NewCourseForm
