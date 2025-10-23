// src/components/history/FermatAttemptHistory.tsx
import { Stack, Text, Table } from "@chakra-ui/react";

export type FermatAttempt = {
  a: number;
  p: number;
  apMinus1: number;
  ap: number;
  okTheorem: boolean;
  okCorollary: boolean;
  at: string;
};

type Props = {
  items: FermatAttempt[];
};

export const FermatAttemptHistory = ({ items }: Props) => {
  if (!items.length) {
    return <Text color="fg.muted">Aucun historique pour l’instant.</Text>;
  }

  return (
    <Stack gap={3}>
      <Text fontWeight="bold">Historique des vérifications</Text>
      <Table.Root size="sm" striped showColumnBorder>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Date</Table.ColumnHeader>
            <Table.ColumnHeader>a</Table.ColumnHeader>
            <Table.ColumnHeader>p</Table.ColumnHeader>
            <Table.ColumnHeader>a^(p-1) mod p</Table.ColumnHeader>
            <Table.ColumnHeader>Théorème</Table.ColumnHeader>
            <Table.ColumnHeader>a^p mod p</Table.ColumnHeader>
            <Table.ColumnHeader>Corollaire</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((att, idx) => (
            <Table.Row key={idx}>
              <Table.Cell>{new Date(att.at).toLocaleString()}</Table.Cell>
              <Table.Cell>{att.a}</Table.Cell>
              <Table.Cell>{att.p}</Table.Cell>
              <Table.Cell>{att.apMinus1}</Table.Cell>
              <Table.Cell color={att.okTheorem ? "green.600" : "red.600"}>
                {att.okTheorem ? "OK" : "Échec"}
              </Table.Cell>
              <Table.Cell>{att.ap}</Table.Cell>
              <Table.Cell color={att.okCorollary ? "green.600" : "red.600"}>
                {att.okCorollary ? "OK" : "Échec"}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Stack>
  );
};
