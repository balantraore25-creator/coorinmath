import { Table, Spinner, Alert } from "@chakra-ui/react";
import { useGetCoursesQuery } from "./coursesApiSlice";
import { defaultGetCoursesArg } from "./coursesApiSlice"; // ✅ argument typé pour DevTools
import Course from "./Course";
import { getErrorMessage } from "../../utils/errorUtils";
import useAuth from "../../hooks/useAuth"

const CourseList = () => {
   const {username, isEncadreur, isAdministrateur } = useAuth()
  const {
    data: courses,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetCoursesQuery(defaultGetCoursesArg, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return (
      <Alert.Root
        borderStartWidth="3px"
        borderStartColor="colorPalette.600"
        title="Chargement des cours"
      >
        <Alert.Indicator>
          <Spinner size="sm" />
        </Alert.Indicator>
        <Alert.Title>Chargement des cours</Alert.Title>
      </Alert.Root>
    );
  }

  if (isError) {
    return (
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Title>{getErrorMessage(error)}</Alert.Title>
      </Alert.Root>
    );
  }

  if (isSuccess) {
    const { ids, entities } = courses;

     let filteredIds
        if  (isEncadreur || isAdministrateur) {
            filteredIds = [...ids]
        } else {
            filteredIds = ids.filter(noteId => entities[noteId].username === username)
        }

    return (
      <Table.Root size="sm" interactive striped showColumnBorder>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Statut</Table.ColumnHeader>
            <Table.ColumnHeader>Créé le</Table.ColumnHeader>
            <Table.ColumnHeader>Mis à jour</Table.ColumnHeader>
            <Table.ColumnHeader>Titre</Table.ColumnHeader>
            <Table.ColumnHeader>Auteur</Table.ColumnHeader>
            <Table.ColumnHeader>Lien</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Modifier</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {ids?.length && filteredIds.map((courseId) => (
            <Course key={courseId} courseId={courseId} />
          ))}
        </Table.Body>
      </Table.Root>
    );
  }

  return null;
};

export default CourseList;
