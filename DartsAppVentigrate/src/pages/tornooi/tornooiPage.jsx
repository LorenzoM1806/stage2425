import {
  ActionIcon,
  Alert,
  Button,
  Card,
  Divider,
  Group,
  Image,
  List,
  Modal,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
  Title,
  Notification
} from "@mantine/core";
import LogoVentigrate from "../../assets/LogoVentigrate.png";
import React, { useEffect, useState } from "react";
import {
  IconDeviceGamepad2,
  IconExclamationCircle,
  IconTrash,
  IconUserPlus,
} from "@tabler/icons-react";
import { useTornooi } from "./tornooiContext.jsx";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import {
  fetchGamemode,
  fetchUser,
  postTournament,
  postTournamentParticipant,
} from "../../functionalities/database.js";
import { useDatabase } from "../../context/databaseContext.jsx";

function TornooiPage() {
  const {
    tornooiModus,
    setTornooiModus,
    players,
    setPlayers,
    setBracket,
    sets,
    setSets,
    legs,
    setLegs,
    setRound
  } = useTornooi();
  const [opened, { open, close }] = useDisclosure(false);
  const [addedPlayer, setAddedPlayer] = useState("");
  const navigate = useNavigate();
  const [playerError, setPlayerError] = useState(null);
  const [gamemodeError, setGamemodeError] = useState(true);

  const goHome = () => {
    navigate("/home");
  };

  const { users, setDatabaseTournament } = useDatabase();

  const game = <IconDeviceGamepad2 />;
  const trash = <IconTrash />;
  const icon = <IconExclamationCircle />;

  const handleTornooiModus = (value) => {
    setTornooiModus(parseInt(value));
    setGamemodeError(false);
  };

  const addPlayer = () => {
    close();
    setPlayers((prevPlayers) => [...prevPlayers, addedPlayer]);
    setAddedPlayer("");
  };

  const removePlayer = (playerToRemove) => {
    setPlayers((prevPlayers) =>
      prevPlayers.filter((player) => player !== playerToRemove)
    );
  };

  const generateBracket = () => {
    const newBracket = [];
    let num = 1;
    for (let i = 0; i < players.length; i += 2) {
      newBracket.push({
        match: num,
        player1: players[i],
        player2: players[i + 1] || "Bye",
        winner: null,
      });
      num = num + 1;
    }
    setBracket(newBracket);
  };

  const handleInputSpeler = (value) => {
    setAddedPlayer(value === null ? "" : value);
  };

  const handleUsersData = () => {
    return users
      .filter((u) => u.isDeleted === false)
      .map((u) => ({ value: u.name, label: u.name }));
  };

  const startGame = async () => {
    const amountPlayers = players.length;

    if (tornooiModus === 0) {
      setGamemodeError(true);
      return;
    }
    if (sets === 0 | sets === null || sets === "")
    {
      setPlayerError("Geen sets meegegeven!!!")
      return;
    }
    if (legs === 0 | legs === null || legs === "")
      {
        setPlayerError("Geen legs meegegeven!!!")
        return;
      }

    if ([2, 4, 8, 16, 32].includes(amountPlayers)) {
      generateBracket();

      if(players.length === 2) { setRound("Finale")}

      const tornooi = {
        WinnerId: null,
        Datum: new Date().toISOString(),
      };

      const createdTournament = await postTournament(tornooi);
      if (createdTournament && createdTournament.id) {
        localStorage.setItem("tornooiId", createdTournament.id);
      }

      setDatabaseTournament(tornooi);

      for (const playerName of players) {
        const player = users.find((u) => u.name === playerName);
        const tournamentId = localStorage.getItem("tornooiId");

        if (!player) continue;

        const tournamentParticipant = {
          TournamentId: tournamentId,
          PlayerId: player.id,
        };

        await postTournamentParticipant(tournamentParticipant);
      }
      navigate("/tornooiOverview");
    } else {
      setPlayerError(
        "Met deze hoeveelheid spelers kan er geen tornooi worden opgestart. Er moet minstens één van de volgende hoeveelheid spelers aanwezig zijn: 2, 4, 8, 16, of 32."
      );
    }
  };

  return (
    <Stack align="center" justify="center" gap="sm" p={20} h={"50rem"}>
      <Paper bg="var(--mantine-color-dark-9)" size="xs" radius="lg" p={20}>
        <Image h="auto" w={250} fit="contain" src={LogoVentigrate} p={15} />
      </Paper>

      <Card w={290} shadow="sm" radius={"md"}>
        <div
          style={{
            padding: "5px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title order={5}>Spelers:</Title>
          <Button
            leftSection={<IconUserPlus size={16} />}
            variant="outline"
            color="dark"
            size="sm"
            miw={120}
            onClick={open}
          >
            Speler Toevoegen
          </Button>
        </div>

        <Divider />

        <List w={"100%"} p={"sm"} spacing={"xs"} center>
          {players.length > 0 ? (
            players.map((player, idx) => (
              <List.Item
                key={player}
                display={"flex"}
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                p={"xs"}
              >
                <Text>
                  {idx + 1}. {player}
                  <ActionIcon
                    color="red"
                    variant="outline"
                    size={"sm"}
                    onClick={() => removePlayer(player)}
                    data-testid="trash"
                    ml={15}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Text>
              </List.Item>
            ))
          ) : (
            <Text c={"dimmed"} mt={"sm"} style={{ alignContent: "center" }}>
              Nog geen spelers.
            </Text>
          )}
        </List>
      </Card>

      <Select
        leftSectionPointerEvents="none"
        leftSection={game}
        label="Spelmodus:"
        placeholder="Kies het gewenste spel"
        data={["301", "501"]}
        value={tornooiModus}
        onChange={handleTornooiModus}
        w={290}
        error={gamemodeError ? "Selecteer een spelmodus!" : null}
      />

      <Group w={290} style={{justifyContent:'space-between'}}>
        <NumberInput
          value={sets}
          onChange={setSets}
          defaultValue={0}
          allowNegative={false}
          max={10}
          min={1}
          label="Hoeveelheid sets:"
          w={120}
        />
        <NumberInput
          value={legs}
          onChange={setLegs}
          defaultValue={0}
          allowNegative={false}
          max={5}
          min={1}
          label="Hoeveelheid legs:"
          w={120}
        />
      </Group>
      <Text>Het aantal sets in de finale zal {sets+2} zijn!!!</Text>
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
        onClick={startGame}
      >
        Start Spel
      </Button>
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

      {playerError && (
        <Notification 
        icon={icon} 
        color="red" 
        title="Error!"
        withCloseButton={false}
      >
        {playerError}
      </Notification>
      )}

      <Modal
        opened={opened}
        onClose={close}
        title="Add a player"
        centered
        data-testid="popup"
      >
        <Stack align="center">
          <Select
            label="Spelers"
            placeholder="Kies een speler"
            data={handleUsersData()}
            value={addedPlayer}
            onChange={handleInputSpeler}
            w={250}
          />
          <Button onClick={addPlayer} color="green" fullWidth>
            Ok
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}

export default TornooiPage;
