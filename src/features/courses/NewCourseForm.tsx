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
  Flex,
} from "@chakra-ui/react"
import {
  FaSave,
  FaDivide,
  FaSortNumericDown,
  FaEquals,
  FaInfinity,
} from "react-icons/fa"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAddCourseMutation } from "./coursesApiSlice"
import type { SanitizedUser } from "../users/usersApiSlice"

interface NewCourseFormProps {
  users: SanitizedUser[]
}

const NewCourseForm = ({ users }: NewCourseFormProps) => {
  const [addCourse, { isLoading, isSuccess, isError, error }] = useAddCourseMutation()
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [assignedUsers, setAssignedUsers] = useState<string[]>([])
  const [linkType, setLinkType] = useState<string>("")

  // ✅ Collection des utilisateurs
  const userCollection = createListCollection({
    items: users.map((user) => ({
      label: user.username,
      value: user.id,
    })),
  })

  // ✅ Collection des liens (sans icônes, juste label + value)
  const linkCollection = createListCollection({
    items: [
      { value: "/dash/courses/euclidean", label: "Euclidean Division" },
      { value: "/dash/courses/numeration", label: "Numeration" },
      { value: "/dash/courses/pgcd", label: "GCD" },
      { value: "/dash/courses/congruence", label: "Congruence mod n" },
    ],
  })

  // Tableau des icônes dans le même ordre
  const linkIcons = [FaDivide, FaSortNumericDown, FaEquals, FaInfinity]

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
              collection={linkCollection}
              value={[linkType]}
              onValueChange={({ value }) => setLinkType(value[0])}
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
                  {linkCollection.items.map((item, idx) => (
                    <Select.Item key={item.value} item={item}>
                      <Flex align="center" gap={2}>
                        <Icon as={linkIcons[idx]} />
                        <Text>{item.label}</Text>
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

          {/* Bouton */}
          <Button type="submit" colorScheme="teal" disabled={!canSave} >
           <Icon>
                        <FaSave />
                      </Icon>
            Save
          </Button>
        </VStack>
      </form>
    </Box>
  )
}

export default NewCourseForm
