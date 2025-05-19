import UserProfile from "./userProfile.jsx";
import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Fieldset,
  Group,
  Paper,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useDatabase } from "../context/databaseContext";
import { useNavigate } from "react-router";
import { useMsal } from "@azure/msal-react";
import { fetchUser, updateUser } from "../functionalities/database.js";

function ProfilePage() {
  const [gamemode, setGamemode] = useState();
  const { gamemodes, users, setUsers } = useDatabase();
  const { instance } = useMsal();
  const accounts = instance.getAllAccounts();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [id, setId] = useState(null);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (accounts.length > 0 && users.length > 0) {
      const loginEmail = accounts[0].username;
      const userObj = users.find((u) => u.email === loginEmail);
      if (userObj) {
        setUsername(userObj.name);
        setEmail(userObj.email);
        setDeleted(userObj.isDeleted);
        setId(userObj.id);
        setRole(userObj.role);
      }
    }
  }, [accounts, users]);

  const handleGamemodes = async (value) => {
    setGamemode(value === null ? "" : value);

    const game = gamemodes.find((g) => g.name === value);

    const user = {
      Id: id,
      Name: username,
      Email: email,
      FavoriteGameId: game.id,
      Role: role,
      IsDeleted: deleted,
    };

    await updateUser(id, user);

    await fetchUser().then(setUsers);
  };

  const handleGamemodeData = () => {
    return gamemodes.map((g) => ({ value: g.name, label: g.name }));
  };

  const goHome = () => {
    navigate("/home");
  };

  return (
    <Stack align="center" justify="center" gap="md" p={20} h={"50rem"}>
      <Paper p={15}>
        <Group>
          <h4>Naam:</h4>
          <Text>{username}</Text>
        </Group>
        <Divider></Divider>
        <Group>
          <h4>Email:</h4>
          <Text>{email}</Text>
        </Group>
        <Divider></Divider>
        <Group>
          <h4>Favoriete spel:</h4>
          <Select
            placeholder="Kies het gewenste spel"
            data={handleGamemodeData()}
            value={gamemode}
            onChange={handleGamemodes}
          />
        </Group>
      </Paper>
      <Button
        onClick={() => navigate("/statProfile")}
        variant="outline"
        color="dark"
        bg="#fff"
        size="lg"
        w={290}
        style={{
          boxShadow: "2px 3px black",
          borderRadius: "8px",
        }}
      >
        Statistieken
      </Button>
      <UserProfile></UserProfile>
      <Button
        variant="outline"
        color="dark"
        bg="#fff"
        size="lg"
        w={290}
        style={{
          boxShadow: "2px 3px black",
          borderRadius: "8px",
        }}
        onClick={goHome}
      >
        Home
      </Button>
    </Stack>
  );
}

export default ProfilePage;
