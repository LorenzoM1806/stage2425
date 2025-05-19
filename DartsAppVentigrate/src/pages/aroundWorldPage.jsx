import { Alert, Button, Center, Group, Modal, Notification, Paper, Stack, Text, Title } from "@mantine/core";
import React, { useState } from "react";
import { useGame } from "../context/gameContext.jsx";
import { IconExclamationCircle } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { useDatabase } from "../context/databaseContext.jsx";
import { postThrow, updateMatch } from "../functionalities/database.js";

function AroundWorldPage() {
  const { player1, player2, currentTurn, setCurrentTurn } = useGame();

  const { users, databaseMatch } = useDatabase();

  const [numberP1, setNumberP1] = useState(1);
  const [numberP2, setNumberP2] = useState(1);
  const [throwCount, setThrowCount] = useState(0);
  const [error, setError] = useState("");

  const [throw1, setThrow1] = useState(0);
  const [throw2, setThrow2] = useState(0);
  const [throw3, setThrow3] = useState(0);

  const [opened, { open, close }] = useDisclosure(false);
  const [winner, setWinner] = useState(null);
  const navigate = useNavigate();

  const nextNum = async () => {
    if (throwCount >= 3) {
      setError("Je kan niet meer dan 3 darts gooien!");
      return;
    }

    if (currentTurn === 1) {
      if (numberP1 === 20) {
        if (throwCount === 0) {
          setThrow1(numberP1);
        } else if (throwCount === 1) {
          setThrow2(numberP1);
        } else if (throwCount === 2) {
          setThrow3(numberP1);
        }
        setNumberP1(25);
      } else if (numberP1 === 25) {
        if (throwCount === 0) {
          setThrow1(numberP1);
        } else if (throwCount === 1) {
          setThrow2(numberP1);
        } else if (throwCount === 2) {
          setThrow3(numberP1);
        }
        setNumberP1(50);
      } else if (numberP1 === 50) {
        if (throwCount === 0) {
          setThrow1(numberP1);
        } else if (throwCount === 1) {
          setThrow2(numberP1);
        } else if (throwCount === 2) {
          setThrow3(numberP1);
        }
        const speler = currentTurn === 1 ? player1 : player2;

        let playerId = users.find((u) => u.name === speler);

        const gooi = {
          MatchId: parseInt(localStorage.getItem("matchId")),
          Throw1: throw1,
          Throw2: throw2,
          Throw3: throw3,
          SpelerId: playerId.id,
          Datum: new Date().toISOString(),
        };

        await postThrow(gooi);

        setThrow1(0);
        setThrow2(0);
        setThrow3(0);

        setWinner(player1);
        open();
      } else {
        if (throwCount === 0) {
          setThrow1(numberP1);
        } else if (throwCount === 1) {
          setThrow2(numberP1);
        } else if (throwCount === 2) {
          setThrow3(numberP1);
        }
        setNumberP1(numberP1 + 1);
      }
    } else {
      if (numberP2 === 20) {
        if (throwCount === 0) {
          setThrow1(numberP2);
        } else if (throwCount === 1) {
          setThrow2(numberP2);
        } else if (throwCount === 2) {
          setThrow3(numberP2);
        }
        setNumberP2(25);
      } else if (numberP2 === 25) {
        if (throwCount === 0) {
          setThrow1(numberP2);
        } else if (throwCount === 1) {
          setThrow2(numberP2);
        } else if (throwCount === 2) {
          setThrow3(numberP2);
        }
        setNumberP2(50);
      } else if (numberP2 === 50) {
        if (throwCount === 0) {
          setThrow1(numberP2);
        } else if (throwCount === 1) {
          setThrow2(numberP2);
        } else if (throwCount === 2) {
          setThrow3(numberP2);
        }
        const speler = currentTurn === 1 ? player1 : player2;

        let playerId = users.find((u) => u.name === speler);

        const gooi = {
          MatchId: parseInt(localStorage.getItem("matchId")),
          Throw1: throw1,
          Throw2: throw2,
          Throw3: throw3,
          SpelerId: playerId.id,
        };

        await postThrow(gooi);

        setThrow1(0);
        setThrow2(0);
        setThrow3(0);

        setWinner(player2);
        open();
      } else {
        if (throwCount === 0) {
          setThrow1(numberP2);
        } else if (throwCount === 1) {
          setThrow2(numberP2);
        } else if (throwCount === 2) {
          setThrow3(numberP2);
        }
        setNumberP2(numberP2 + 1);
      }
    }
    setThrowCount(throwCount + 1);
  };

  const nextPlayer = async () => {
    const speler = currentTurn === 1 ? player1 : player2;

    let playerId = users.find((u) => u.name === speler);

    const gooi = {
      MatchId: parseInt(localStorage.getItem("matchId")),
      Throw1: throw1,
      Throw2: throw2,
      Throw3: throw3,
      SpelerId: playerId.id,
    };

    await postThrow(gooi);

    setThrow1(0);
    setThrow2(0);
    setThrow3(0);

    currentTurn === 1 ? setCurrentTurn(2) : setCurrentTurn(1);
    setError("");
    setThrowCount(0);
  };

  const resetGame = async () => {
    let matchWinner = users.find((w) => w.name === winner);
    let matchId = parseInt(localStorage.getItem("matchId"), 10);

    if (!matchWinner) {
      return;
    }

    const newMatch = {
      Id: matchId,
      Player1Id: databaseMatch.Player1Id,
      Player2Id: databaseMatch.Player2Id,
      GamemodeId: databaseMatch.GamemodeId,
      WinnerId: matchWinner.id,
      Finished: true,
      Datum: databaseMatch.Datum,
    };

    await updateMatch(matchId, newMatch);

    setWinner(null);
    setCurrentTurn(1);
    close();
    navigate("/start");
  };

  const cancelGame = () => {
    setWinner(null);
    setCurrentTurn(1);
    setNumberP1(1);
    setNumberP2(1);
    setError("");
    navigate("/start");
  };

  return (
    <Stack align="center" justify="center" gap="md" h={'50rem'} p={20}>
      <Group gap="xl">
        <div>
          <Title order={4}>{player1}</Title>
          <Center
            p={30}
            style={{
              border: currentTurn === 1 ? "3px solid #4caf50" : "none",
              boxShadow: currentTurn === 2 ? "2px 3px black" : "none",
            }}
            bg={'white'}
            fw={'bold'}
            data-testid="p1"
          >
            {numberP1}
          </Center>
        </div>

        <div>
          <Title order={4}>{player2}</Title>
          <Center
            style={{
              border: currentTurn === 2 ? "3px solid #4caf50" : "none",
              boxShadow: currentTurn === 1 ? "2px 3px black" : "none",
            }}
            p={30}
            data-testid="p2"
            bg={'white'}
            fw={'bold'}
          >
            {numberP2}
          </Center>
        </div>
      </Group>

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
        onClick={nextNum}
      >
        Volgende Nummer
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
        onClick={nextPlayer}
      >
        Volgende Speler
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
        onClick={cancelGame}
      >
        Annuleer het Spel
      </Button>
      {error && (
        <Notification
          color="red"
          icon={<IconExclamationCircle />}
          withCloseButton={false}
          title="Error!"
        >
          {error}
        </Notification>
      )}
      <Modal
        opened={opened}
        onClose={resetGame}
        title="🎉 Game Over!"
        centered
        data-testid="popup"
      >
        <Stack align="center">
          <Title order={2}>{winner} heeft gewonnen! 🏆</Title>
          <Button onClick={resetGame} color="green" fullWidth>
            Ok
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}

export default AroundWorldPage;
