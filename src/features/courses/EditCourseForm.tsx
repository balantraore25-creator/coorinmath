import {
  Box,
  Heading,
  Text,
  VStack,
  Input,
  Textarea,
  IconButton,
  Icon,
  Field,
  Select,
  Checkbox,
  createListCollection,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from "./coursesApiSlice";
import { FaSave, FaTrash } from "react-icons/fa";
import type { ChangeEvent } from "react";
import type { Course } from "../../types/course";
import type { User } from "../../types/user";

interface EditCourseFormProps {
  course: Course;
  users: User[];
}

const EditCourseForm = ({ course, users }: EditCourseFormProps) => {
  const [updateCourse, { isLoading, isSuccess, isError, error }] =
    useUpdateCourseMutation();

  const [
    deleteCourse,
    { isSuccess: isDelSuccess, isError: isDelError, error: delError },
  ] = useDeleteCourseMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState(course.title);
  const [text, setText] = useState(course.text);
  const [completed, setCompleted] = useState(course.completed);
  const [userId, setUserId] = useState(course.user);

  const userCollection = createListCollection({
    items: users.map((user) => ({
      label: user.username,
      value: user.id,
    })),
  });

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle("");
      setText("");
      setUserId("");
      navigate("/dash/courses/:id");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const canSave = Boolean(title && text && userId) && !isLoading;

  const onSaveCourseClicked = async () => {
    if (canSave) {
      await updateCourse({
        id: course.id,
        user: userId,
        title,
        text,
        completed,
      });
    }
  };

  const onDeleteCourseClicked = async () => {
   await deleteCourse(course.id);

  };

  const created = new Date(course.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const updated = new Date(course.updatedAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const errContent =
    (error as any)?.data?.message || (delError as any)?.data?.message || "";

  return (
    <Box maxW="lg" mx="auto" py={6}>
      <Heading size="md" mb={4}>
        Edit Course #{course.ticket}
      </Heading>

      {(isError || isDelError) && (
        <Text color="red.500" mb={4}>
          {errContent}
        </Text>
      )}

      <VStack align="stretch">
        {/* Champ Title */}
        <Field.Root required invalid={!title.trim()}>
          <Field.Label>Title</Field.Label>
          <Input
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            placeholder="Course title"
          />
          {!title.trim() && (
            <Field.ErrorText>Title is required</Field.ErrorText>
          )}
        </Field.Root>

        {/* Champ Text */}
        <Field.Root required invalid={!text.trim()}>
          <Field.Label>Text</Field.Label>
          <Textarea
            value={text}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setText(e.target.value)
            }
            placeholder="Course content"
            resize="vertical"
          />
          {!text.trim() && <Field.ErrorText>Text is required</Field.ErrorText>}
        </Field.Root>

        {/* Checkbox Work Complete */}
        <Checkbox.Root
          checked={completed}
          onCheckedChange={(details) =>
            setCompleted(details.checked === true)
          }
        >
          <Checkbox.HiddenInput name="completed" />
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Label>Work complete</Checkbox.Label>
        </Checkbox.Root>

        {/* Select Assigned To */}
        <Field.Root required invalid={!userId}>
          <Field.Label>Assigned to</Field.Label>
          <Select.Root
            collection={userCollection}
            value={userId ? [userId] : []}
            onValueChange={({ value }) => setUserId(value[0] ?? "")}
          >
            <Select.HiddenSelect name="userId" />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select a user" />
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
          {!userId && (
            <Field.ErrorText>User assignment is required</Field.ErrorText>
          )}
        </Field.Root>

        {/* Dates */}
        <Text fontSize="sm" color="gray.500">
          Created: {created}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Updated: {updated}
        </Text>

        {/* Boutons */}
        <VStack direction="row">
          <IconButton
            aria-label="Save"
            colorScheme="teal"
            onClick={onSaveCourseClicked}
            disabled={!canSave}
          >
            <Icon>
              <FaSave />
            </Icon>
          </IconButton>

          <IconButton
            aria-label="Delete"
            colorScheme="red"
            onClick={onDeleteCourseClicked}
          >
            
            <Icon>
              <FaTrash />
            </Icon>
          </IconButton>
        </VStack>
      </VStack>
    </Box>
  );
};

export default EditCourseForm;

