import React, { useEffect, useState } from "react";
import InputThrowX01 from "./inputThrowX01.jsx";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/gameContext.jsx";
import { useAnalytic } from "../context/analyticContext.jsx";
import { calculateAvg } from "../functionalities/calculateAvg.js";
import { calculateDoublePercent } from "../functionalities/calculateDoublePercent.js";
import { Button, Card, Divider, Group, Loader, Modal, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCornerDownLeft } from "@tabler/icons-react";
import { fetchCheckout, updateMatch } from "../functionalities/database.js";
import { useDatabase } from "../context/databaseContext.jsx";

function GamePage() {
  const {
    player1, setPlayer1,
    player2, setPlayer2,
    gameMode,
    scoreP1, setScoreP1,
    scoreP2, setScoreP2,
    currentTurn, setCurrentTurn,
    winner, setWinner,
  } = useGame();

  const { dartsP1, dartsP2, lastThrowP1, lastThrowP2, doublesP1, doublesP2 } =
    useAnalytic();

  const { databaseMatch, users, checkouts } = useDatabase();

  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();

  useEffect(() => {
    setScoreP1(parseInt(gameMode));
    setScoreP2(parseInt(gameMode));
  }, [gameMode, setScoreP1, setScoreP2]);

  useEffect(() => {
    if (winner) {
      open();
    }
  }, [winner, open]);

  const resetGame = async () => {
    setCurrentTurn(1);
    setPlayer1(player1);
    setPlayer2(player2);

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
      Datum: databaseMatch.Datum,
      Finished: !databaseMatch.Finished,
    };

    await updateMatch(matchId, newMatch);

    setWinner(null);
    close();
    navigate("/start");
  };

  const findCheckout = (score) => {
    if (!checkouts || checkouts.length === 0) {
      return "";
    }

    const checkoutInfo = checkouts.find((item) => item.score === score);

    if (checkoutInfo) {
      return `${checkoutInfo.checkoutPath}`;
    } else {
      return "Geen checkout";
    }
  };

  return (
    <Stack align="center" spacing="sm" p={20} h={'50rem'}>
      <Group position="center" spacing="lg" pt={50}>
        <Card
          shadow="sm"
          radius="md"
          withBorder
          w={150}
          h={200}
          style={{
            border: currentTurn === 1 ? "3px solid #4caf50" : "none",
            boxShadow: currentTurn === 2 ? "2px 3px black" : "none",
          }}
          data-testid="p1"
        >
          <Group grow>
            <Title order={4}>{player1}</Title>
            {currentTurn === 1 ? (
              <IconCornerDownLeft color="#4caf50"></IconCornerDownLeft>
            ) : (
              ""
            )}
          </Group>
          <Text data-testid="valueP1">Score: {scoreP1}</Text>
          <Text>Darts: {dartsP1}</Text>
          <Text>AVG: {calculateAvg(scoreP1, gameMode, dartsP1)}</Text>
          <Text>Vorige worp: {lastThrowP1}</Text>
          <Text>{findCheckout(scoreP1)}</Text>
        </Card>

        <Card
          shadow="sm"
          radius="md"
          withBorder
          w={150}
          h={200}
          style={{
            border: currentTurn === 2 ? "3px solid #4caf50" : "none",
            boxShadow: currentTurn === 1 ? "2px 3px black" : "none",
          }}
          data-testid="p2"
        >
          <Group grow>
            <Title order={4}>{player2}</Title>
            {currentTurn === 2 ? (
              <IconCornerDownLeft color="#4caf50"></IconCornerDownLeft>
            ) : (
              ""
            )}
          </Group>
          <Text data-testid="valueP2">Score: {scoreP2}</Text>
          <Text>Darts: {dartsP2}</Text>
          <Text>AVG: {calculateAvg(scoreP2, gameMode, dartsP2)}</Text>
          <Text>Vorige worp: {lastThrowP2}</Text>
          <Text>{findCheckout(scoreP2)}</Text>
        </Card>
      </Group>

      <Divider size={3} color="dark" w={350} />

      <InputThrowX01 />

      <Modal
        opened={opened}
        onClose={resetGame}
        title="🎉 Game Over!"
        centered
        data-testid="popup"
      >
        <Stack align="center">
          <Title order={2}>{winner} heeft gewonnen! 🏆</Title>
          <Text>Darts gegooid: {winner === player1 ? dartsP1 : dartsP2}</Text>
          <Text>
            Doubles %:{" "}
            {winner === player1
              ? calculateDoublePercent(doublesP1)
              : calculateDoublePercent(doublesP2)}
          </Text>
          <Button
            onClick={resetGame}
            color="green"
            fullWidth
            data-testid="button"
          >
            Ok
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}

export default GamePage;
