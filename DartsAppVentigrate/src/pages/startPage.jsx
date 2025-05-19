// eslint-disable-next-line no-unused-vars
import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGame } from "../context/gameContext.jsx";
import { useAnalytic } from "../context/analyticContext.jsx";
import LogoVentigrate from "../assets/LogoVentigrate.png";
import { Button, Image, Paper, Select, Stack } from "@mantine/core";
import { IconUser, IconUsers, IconDeviceGamepad2 } from "@tabler/icons-react";
import {
  fetchGamemode,
  fetchUser,
  postMatch,
} from "../functionalities/database.js";
import { useDatabase } from "../context/databaseContext.jsx";

function StartPage() {
  const {
    player1, setPlayer1,
    player2, setPlayer2,
    gameMode, setGameMode,
    setCurrentTurn,
  } = useGame();
  const [error, setError] = useState({
    player1: "",
    player2: "",
    gameMode: "",
  });
  const { users, gamemodes, setDatabaseMatch } =
    useDatabase();

  const {
    setDoublesP1, setDoublesP2,
    setDartsP1, setDartsP2,
    setLastThrowP1, setLastThrowP2,
  } = useAnalytic();

  const navigate = useNavigate();

  const handleInputSpeler1 = (value) => {
    setPlayer1(value === null ? "" : value);
    if (value) {
      setError((prevError) => ({ ...prevError, player1: "" }));
    }
  };
  const handleInputSpeler2 = (value) => {
    setPlayer2(value === null ? "" : value);
    if (value) {
      setError((prevError) => ({ ...prevError, player2: "" }));
    }
  };
  const handleGameModes = (value) => {
    setGameMode(value === null ? "" : value);
    if (value && value !== "Kies het gewenste spel") {
      setError((prevError) => ({ ...prevError, gameMode: "" }));
    }
  };
  const handleUsersData = () => {
    return users.filter(u => u.isDeleted === false).map((u) => ({ value: u.name, label: u.name }));
  };
  const handleGamemodesData = () => {
    return gamemodes.map((g) => ({ value: g.name, label: g.name }));
  };
  const goHome = () => {
    navigate("/home");
  };
  const startGame = async () => {
    let validationError = false;

    // Error handling
    if (!player1 || player1 === null) {
      setError((prevError) => ({
        ...prevError,
        player1: "Selecteer speler 1!",
      }));
      validationError = true;
    }
    if (!player2 || player2 === null) {
      setError((prevError) => ({
        ...prevError,
        player2: "Selecteer speler 2!",
      }));
      validationError = true;
    }
    if (
      !gameMode ||
      gameMode === "Kies het gewenste spel" ||
      gameMode === null
    ) {
      setError((prevError) => ({
        ...prevError,
        gameMode: "Selecteer een spelmodus!",
      }));
      validationError = true;
    }

    if (validationError) return;

    setCurrentTurn(1);
    setDoublesP1(0);
    setDoublesP2(0);
    setDartsP1(0);
    setDartsP2(0);
    setLastThrowP1(0);
    setLastThrowP2(0);

    let game = gamemodes.find((g) => g.name === gameMode);
    let p1 = users.find((u1) => u1.name === player1);
    let p2 = users.find((u2) => u2.name === player2);

    const match = {
      Player1Id: p1.id,
      Player2Id: p2.id,
      GamemodeId: game.id,
      WinnerId: null,
      Finished: false,
      Datum: new Date().toISOString(),
    };

    setDatabaseMatch(match);

    if (gameMode === "501" || gameMode === "301") {
      const createdMatch = await postMatch(match);

      if (createdMatch && createdMatch.id) {
        localStorage.setItem("matchId", createdMatch.id);
      }

      navigate("/game");
    } else if (gameMode === "Cut throat") {
      const createdMatch = await postMatch(match);

      if (createdMatch && createdMatch.id) {
        localStorage.setItem("matchId", createdMatch.id);
      }

      navigate("/cutThroat");
    } else if (gameMode === "Around the world") {
      const createdMatch = await postMatch(match);

      if (createdMatch && createdMatch.id) {
        localStorage.setItem("matchId", createdMatch.id);
      }

      navigate("/aroundWorld");
    }
  };

  const user = <IconUser />;
  const user2 = <IconUsers />;
  const game = <IconDeviceGamepad2 />;

  return (
    <Stack align="center" justify="center" gap="sm" p={20} h={'50rem'}>
      <Paper bg="var(--mantine-color-dark-9)" size="xs" radius="lg" p={20}>
        <Image h="auto" w={250} fit="contain" src={LogoVentigrate} p={15} />
      </Paper>

      <Select
        leftSectionPointerEvents="none"
        leftSection={user}
        label="Speler 1:"
        placeholder="Kies speler 1"
        data={handleUsersData()}
        value={player1}
        onChange={handleInputSpeler1}
        w={290}
        error={error.player1}
        radius={7}
      />

      <Select
        leftSectionPointerEvents="none"
        leftSection={user2}
        label="Speler 2:"
        placeholder="Kies speler 2"
        data={handleUsersData()}
        value={player2}
        onChange={handleInputSpeler2}
        w={290}
        error={error.player2}
        radius={7}
      />

      <Select
        leftSectionPointerEvents="none"
        leftSection={game}
        label="Spelmodus:"
        placeholder="Kies het gewenste spel"
        data={handleGamemodesData()}
        value={gameMode}
        onChange={handleGameModes}
        w={290}
        error={error.gameMode}
        radius={7}
      />

      <Button
        variant="outline"
        color="dark"
        bg="#fff"
        size="lg"
        w={290}
        style={{
          boxShadow: "2px 3px black",
          borderRadius: "8px"
        }}
        onClick={startGame}
      >
        Start
      </Button>
      <Button
       variant="outline"
       color="dark"
       bg="#fff"
       size="lg"
       w={290}
       style={{
         boxShadow: "2px 3px black",
         borderRadius: "8px"
       }}
        onClick={goHome}
      >
        Home
      </Button>
    </Stack>
  );
}

export default StartPage;
