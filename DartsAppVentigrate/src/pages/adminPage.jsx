import React, { useMemo, useState } from "react";
import {
  Accordion,
  Select,
  Button,
  Modal,
  Stack,
  Table,
  Group,
  Text,
  ScrollArea,
  Affix,
} from "@mantine/core";
import { useDatabase } from "../context/databaseContext";
import { fetchUser, updateUser } from "../functionalities/database";
import { useDisclosure } from "@mantine/hooks";
import GamesPlayedTable from "../pages/gamesPlayedTable";
import { RadarChart } from "@mantine/charts";
import { useNavigate } from "react-router";

function AdminPage() {
  const { matches, users, setUsers } = useDatabase();
  const [updatedUser, setUpdatedUser] = useState("");
  const [role, setRole] = useState("User");
  const [opened, { open, close }] = useDisclosure(false);
  const [didOpened, { open: didOpen, close: didClose }] = useDisclosure(false);

  const navigate = useNavigate()

  const groupedData = useMemo(() => {
    const counts = {};
    for (const { datum } of matches) {
      const date = datum.slice(0, 10);
      counts[date] = (counts[date] || 0) + 1;
    }

    return Object.keys(counts)
      .sort()
      .map((date) => ({ date, count: counts[date] }));
  }, [matches]);

  const saveUser = async () => {
    const user = {
      Id: updatedUser.id,
      Name: updatedUser.name,
      Email: updatedUser.email,
      FavoriteGameId: updatedUser.favoriteGame.id,
      Role: role,
      IsDeleted: false,
    };

    await updateUser(updatedUser.id, user);

    close();

    await fetchUser().then(setUsers);
  };

  const handleInputRole = (value) => {
    setRole(value === null ? "User" : value);
  };

  const handleRole = (u) => {
    setUpdatedUser(u);
    setRole(u.role);
    open();
  };

  const handleDeleteUser = (u) => {
    setUpdatedUser(u);
    didOpen();
  };

  const deleteUser = async () => {
    const user = {
      Id: updatedUser.id,
      Name: updatedUser.name,
      Email: "",
      FavoriteGameId: updatedUser.favoriteGame.id,
      Role: role,
      IsDeleted: true,
    };

    await updateUser(updatedUser.id, user);

    didClose();

    await fetchUser().then(setUsers);
  };

  const AccItems = users.map((u) => (
    <Accordion.Item key={u.name} value={u.name}>
      <Accordion.Control c={u.isDeleted ? "red" : "dark"}>
        {u.name} {u.isDeleted ? "(Verwijderd)" : ""}
      </Accordion.Control>
      <Accordion.Panel>
        <Table variant="vertical" layout="fixed" withTableBorder>
          <Table.Tbody>
            <Table.Tr>
              <Table.Th>Naam</Table.Th>
              <Table.Td>{u.name}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>Email</Table.Th>
              <Table.Td>{u.email}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>Favoriete game</Table.Th>
              <Table.Td>{u.favoriteGame.name}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>Rol</Table.Th>
              <Table.Td>{u.role}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
        <br />
        <Group>
          <Button
            onClick={() => handleRole(u)}
            variant="outline"
            color="dark"
            bg="rgba(255, 255, 255, 1)"
            size="sm"
            w={250}
            style={{ boxShadow: "2px 3px black" }}
            disabled={u.isDeleted}
          >
            Verander de Rol
          </Button>
          <Button
            onClick={() => handleDeleteUser(u)}
            variant="outline"
            color="dark"
            bg="rgba(255, 255, 255, 1)"
            size="sm"
            w={250}
            style={{ boxShadow: "2px 3px black" }}
            disabled={u.isDeleted}
          >
            Verwijder de Gebruiker
          </Button>
        </Group>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Stack align="center" justify="center" spacing="md" p={20} h={"50rem"}>
      <GamesPlayedTable groupedData={groupedData}></GamesPlayedTable>

      <ScrollArea h={500} w="auto">
        <Accordion bg="white" w={300} h="auto">
          {AccItems}
        </Accordion>
      </ScrollArea>

      <Affix position={{top: 20, left: 20}}>
        <Button
          variant="outline"
          color="dark"
          bg="#fff"
          style={{
            boxShadow: "2px 3px black",
            borderRadius: "8px",
          }}
          onClick={() => navigate("/home")}
        >
          Home
        </Button>
      </Affix>
      

      <Modal
        opened={opened}
        onClose={saveUser}
        title="Change role"
        centered
        data-testid="popup"
      >
        <Stack align="center">
          <Select
            label="Rollen"
            placeholder="Kies een rol"
            data={["Admin", "User"]}
            value={role}
            onChange={handleInputRole}
            w={250}
          />
          <Button onClick={saveUser} color="green" fullWidth>
            Save
          </Button>
        </Stack>
      </Modal>
      <Modal
        opened={didOpened}
        onClose={didClose}
        title="Verwijder de Gebruiker?"
        centered
      >
        <Stack align="center">
          <Text>Ben je zeker dat je deze gebruiker wil verwijderen?</Text>
          <Group>
            <Button bg={"red"} onClick={deleteUser}>
              Verwijder
            </Button>
            <Button bg={"yellow"} onClick={didClose}>
              Annuleer
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

export default AdminPage;
