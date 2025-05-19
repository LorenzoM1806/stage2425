/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useGame } from "../context/gameContext.jsx";
import { Button, Group, Paper, Stack, Text, Title, Alert, Modal, Divider, Notification } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { useDatabase } from "../context/databaseContext.jsx";
import { updateMatch } from "../functionalities/database.js";
import { postThrow } from "../functionalities/database.js";

function CutThroatPage() {
  const { player1, player2, currentTurn, setCurrentTurn } = useGame();

  const { users, databaseMatch } = useDatabase();

  const [player1Hits, setPlayer1Hits] = useState({
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0,
    20: 0,
    25: 0,
  });
  const [player2Hits, setPlayer2Hits] = useState({
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0,
    20: 0,
    25: 0,
  });

  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [throwCount, setThrowCount] = useState(1);
  const [error, setError] = useState("");
  const [multiplier, setMultiplier] = useState(1);
  const [choice, setChoice] = useState("Single");

  const [opened, { open, close }] = useDisclosure(false);
  const [winner, setWinner] = useState(null);
  const navigate = useNavigate();

  const [throw1, setThrow1] = useState(0);
  const [throw2, setThrow2] = useState(0);
  const [throw3, setThrow3] = useState(0);

  const numbers = [15, 16, 17, 18, 19, 20, 25];
  const multipliers = ["Single", "Double", "Triple"];

  const handleThrow = (number) => {
    if (throwCount > 3) {
      setError("Je kan niet meer dan 3 darts per ronde gooien!");
      return;
    }

    if (number === 25 && multiplier === 3) {
      setError("De bull heeft geen triple!");
      return;
    }
    setError("");

    if (currentTurn === 1) {
      setPlayer1Hits((prevHits) => {
        const newHits = {
          ...prevHits,
          [number]: prevHits[number] + multiplier,
        };
        if (newHits[number] > 3) {
          setPlayer2Score(
            player2Score + getPoints(number, player2Hits, newHits, multiplier)
          );
        }
        return newHits;
      });
    } else {
      setPlayer2Hits((prevHits) => {
        const newHits = {
          ...prevHits,
          [number]: prevHits[number] + multiplier,
        };
        if (newHits[number] > 3) {
          setPlayer1Score(
            player1Score + getPoints(number, player1Hits, newHits, multiplier)
          );
        }
        return newHits;
      });
    }

    if (throwCount === 1) {
      setThrow1(number * multiplier);
    } else if (throwCount === 2) {
      setThrow2(number * multiplier);
    } else if (throwCount === 3) {
      setThrow3(number * multiplier);
    }

    setThrowCount(throwCount + 1);
  };

  const getPoints = (number, opponentHits, yourHits, multiplier) => {
    if (opponentHits[number] < 3 && yourHits[number] >= 3) {
      return parseInt(number) * multiplier;
    }
    return 0;
  };

  const isPlayerFinished = (playerHits) => {
    return Object.values(playerHits).every((hitCount) => hitCount >= 3);
  };

  const nextTurn = async () => {
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

    if (currentTurn === 1) {
      if (isPlayerFinished(player1Hits)) {
        if (player1Score <= player2Score) {
          setWinner(player1);
          open();
        }
      }
    } else {
      if (isPlayerFinished(player2Hits)) {
        if (player2Score <= player1Score) {
          setWinner(player2);
          open();
        }
      }
    }
    // Rest
    setCurrentTurn(currentTurn === 1 ? 2 : 1);
    setChoice("Single");
    setMultiplier(1);
    setError("");
    setThrowCount(1);
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

  const renderPlayerHits = (hits) => (
    <Paper>
      {numbers.map((num) => (
        <Text key={num}>
          {num === 25 ? "Bull" : num}: {hits[num] >= 3 ? "Finished" : hits[num]}
        </Text>
      ))}
    </Paper>
  );

  const handleMulti = (value) => {
    if (value === "Single") {
      setMultiplier(1);
      setChoice("Single");
    } else if (value === "Double") {
      setMultiplier(2);
      setChoice("Double");
    } else if (value === "Triple") {
      setMultiplier(3);
      setChoice("Triple");
    }
  };

  const cancelGame = () => {
    setWinner(null);
    setCurrentTurn(1);
    navigate("/start");
  };

  return (
    <Stack align="center" justify="center" gap="md" p={20} h={'50rem'}>
      <Group gap="xl">
        <Stack gap="xs" align="center">
          <Paper
            data-testid="p1"
            padding="md"
            shadow="xs"
            radius="md"
            style={{
              width: "150px",
              textAlign: "center",
              border: currentTurn === 1 ? "3px solid #4caf50" : "none",
              boxShadow: currentTurn === 2 ? "2px 3px black" : "none",
            }}
          >
            <Title order={4}>{player1}</Title>
            <Divider size={2} color="dark"></Divider>
            {renderPlayerHits(player1Hits)}
          </Paper>
          <Text>Score: {player1Score}</Text>
        </Stack>

        <Stack gap="xs" align="center">
          <Paper
            data-testid="p2"
            padding="md"
            shadow="xs"
            radius="md"
            style={{
              width: "150px",
              textAlign: "center",
              border: currentTurn === 2 ? "3px solid #4caf50" : "none",
              boxShadow: currentTurn === 1 ? "2px 3px black" : "none",
            }}
          >
            <Title order={4}>{player2}</Title>
            <Divider size={2} color="dark"></Divider>
            {renderPlayerHits(player2Hits)}
          </Paper>
          <Text>Score: {player2Score}</Text>
        </Stack>
      </Group>
      <Group gap="md">
        {multipliers.map((multi) => (
          <Button
            data-testid={multi}
            variant="outline"
            color="dark"
            bg={choice === multi ? "#4caf50" : "rgba(255, 255, 255, 1)"}
            c={choice === multi ? "white" : "dark"}
            style={{ boxShadow: "1px 2px black" }}
            key={multi}
            onClick={() => handleMulti(multi)}
          >
            {multi}
          </Button>
        ))}
      </Group>

      <Group gap="md" align="center" justify="center">
        {numbers.map((num) => (
          <Button
            variant="outline"
            color="dark"
            bg={"rgba(255, 255, 255, 1)"}
            c={"dark"}
            key={num}
            style={{ boxShadow: "1px 2px black" }}
            onClick={() => handleThrow(num)}
            disabled={player1Hits[num] >= 3 && player2Hits[num] >= 3}
          >
            Hit {num === 25 ? "Bull" : num}
          </Button>
        ))}
      </Group>

      <Group>
        <Button
          variant="outline"
          color="dark"
          bg={"rgba(255, 255, 255, 1)"}
          c={"dark"}
          onClick={nextTurn}
          style={{ boxShadow: "1px 2px black" }}
        >
          Volgende Speler
        </Button>
        <Button
          variant="outline"
          color="dark"
          bg={"rgba(255, 255, 255, 1)"}
          c={"dark"}
          onClick={cancelGame}
          style={{ boxShadow: "1px 2px black" }}
        >
          Annuleer het Spel
        </Button>
      </Group>

      {error != "" && (
        <Notification
            icon={<IconExclamationCircle/>}
            color="red"
            title="Error!"
            withCloseButton={false}
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

export default CutThroatPage;
