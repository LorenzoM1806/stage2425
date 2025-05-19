// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoVentigrate from "../assets/LogoVentigrate.png";
import { Button, Image, Paper, Stack, Loader, Text, Alert } from "@mantine/core";
import { useDatabase } from "../context/databaseContext";
import { fetchCheckout, fetchGamemode, fetchMatch, fetchThrow, fetchTournamentMatch, fetchUser } from "../functionalities/database";
import { useMsal } from "@azure/msal-react";
import { IconExclamationMark } from "@tabler/icons-react";

function HomePage() {

  const {setUsers, setGamemodes, setCheckouts, setThrows, setTournamentMatches, setMatches, users} = useDatabase();
  const [databaseLoading, setDatabaseLoading] = useState();
  const { instance } = useMsal();

  useEffect(() => {
    setDatabaseLoading(true);
    fetchUser().then(setUsers)
    fetchGamemode().then(setGamemodes)
    fetchCheckout().then(setCheckouts)
    fetchThrow().then(setThrows)
    fetchTournamentMatch().then(setTournamentMatches)
    fetchMatch().then(setMatches)
    setDatabaseLoading(false)
  }, [])

  const [isAdmin, setIsAdmin] = useState(false)
  const icon = <IconExclamationMark/>;

  const checkAdmin = () => {
      const user = instance.getAllAccounts()
      const loginUser = user[0].username

      const foundUser = users.find(u => u.email === loginUser)

      if(foundUser.role === "Admin")
      {
        setIsAdmin(false)
        navigate("/admin")
      }
      else
      {
        setIsAdmin(true)
      }
  }

  const navigate = useNavigate();

  return (
    <>
      <Stack align="center" justify="center" gap="md" p={20} h={'50rem'}>
        <Paper bg="var(--mantine-color-dark-9)" size="xs" radius="lg" p={20}>
          <Image h="auto" w={250} fit="contain" src={LogoVentigrate} p={15} />
        </Paper>
        <Button
          variant="outline"
          color="dark"
          bg="#fff"
          size="lg"
          w={290}
          style={{ boxShadow: "2px 3px black", borderRadius: "8px" }}
          onClick={() => navigate("/start")}
        >
          Start
        </Button>
        <Button
          variant="outline"
          color="dark"
          bg="#fff"
          size="lg"
          w={290}
          style={{ boxShadow: "2px 3px black", borderRadius: "8px" }}
          onClick={() => navigate("/tornooi")}
        >
          Tornooi
        </Button>
        <Button
          variant="outline"
          color="dark"
          bg="#fff"
          size="lg"
          w={290}
          style={{ boxShadow: "2px 3px black", borderRadius: "8px" }}
          onClick={() => navigate("/profile")}
        >
          Profiel
        </Button>
        <Button
          variant="outline"
          color="dark"
          bg="#fff"
          size="lg"
          w={290}
          style={{ boxShadow: "2px 3px black", borderRadius: "8px" }}
          onClick={() => navigate("/statHome")}
        >
          Statistieken
        </Button>
        <Button
          variant="outline"
          color="dark"
          bg="#fff"
          size="lg"
          w={290}
          style={{ boxShadow: "2px 3px black", borderRadius: "8px" }}
          onClick={() => checkAdmin()}
        >
          Admin Pagina
        </Button>
        {databaseLoading && (
                <Text>
                  <Loader size="xs" color="blue" /> Database is loading
                </Text>
              )}
        {isAdmin && 
        <Alert variant="filled" color="red" title="Admin check" 
               withCloseButton radius="lg" icon={icon}
        >
            Alleen de Admin is teogelaten op deze pagina!!!!!
        </Alert>}
      </Stack>
    </>
  );
}

export default HomePage;
