import { Table } from "@chakra-ui/react";
import { useGetUsersQuery } from "./usersApiSlice";
import { defaultGetUsersArg } from "./usersApiSlice"; // ✅ import de l'argument typé
import User from "./User";
import { Spinner, Alert } from "@chakra-ui/react";
import { getErrorMessage } from "../../utils/errorUtils";

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery(defaultGetUsersArg, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return (
      <Alert.Root
        borderStartWidth="3px"
        borderStartColor="colorPalette.600"
        title="We are loading something"
      >
        <Alert.Indicator>
          <Spinner size="sm" />
        </Alert.Indicator>
        <Alert.Title>We are loading something</Alert.Title>
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
    const { ids } = users;

    return (
      <Table.Root size="sm" interactive striped showColumnBorder>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Nom d'utilisateur</Table.ColumnHeader>
            <Table.ColumnHeader>Rôles</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Modifier</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {ids?.length && ids.map((userId) => (
            <User key={userId} userId={userId} />
          ))}
        </Table.Body>
      </Table.Root>
    );
  }

  return null;
};

export default UsersList;
