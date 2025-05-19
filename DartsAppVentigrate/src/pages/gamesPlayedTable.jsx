import { Stack, Paper, Title, Table, ScrollArea, Divider } from "@mantine/core";

function GamesPlayedTable({groupedData}) {

    return (
        <Paper
          withBorder
          shadow="sm"
          radius="md"
          p="xs"
          w={250}
          sx={{
            width: "100%",
            maxWidth: 380,
            margin: "auto",
            backgroundColor: "white",
          }}
        >
          <Stack spacing="md">
            <Title order={5} align="center">
              Gespeelde spellen
            </Title>
            <Divider/>
    
            <Table.ScrollContainer>
              <Table
                highlightOnHover
                fontSize="sm"
                sx={{ minWidth: 300 }}
                withRowBorders={false}
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Datum</Table.Th>
                    <Table.Th>Aantal</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {groupedData.map(({ date, count }) => (
                    <Table.Tr key={date}>
                      <Table.Td>{date}</Table.Td>
                      <Table.Td>{count}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Stack>
        </Paper>
      );
}

export default GamesPlayedTable;