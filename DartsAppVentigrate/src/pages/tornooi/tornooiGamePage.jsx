import { useTornooi } from "./tornooiContext.jsx";
import { useAnalytic } from "../../context/analyticContext.jsx";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { fetchCheckout } from "../../functionalities/database.js";
import { Button, Card, Divider, Group, Loader, Modal, Stack, Text, Title } from "@mantine/core";
import { calculateDoublePercent } from "../../functionalities/calculateDoublePercent.js";
import { IconCornerDownLeft } from "@tabler/icons-react";
import { calculateAvg } from "../../functionalities/calculateAvg.js";
import InputThrowTornooi from "./inputThrowTornooi.jsx";
import { useDatabase } from "../../context/databaseContext.jsx";
import { updateMatch } from "../../functionalities/database.js";

function TornooiGamePage() {
  const {
    player1, player2,
    tornooiModus,
    setBracket,
    winner, setWinner,
    player1Sets, setPlayer1Sets,
    player2Sets, setPlayer2Sets,
    player1Legs, setPlayer1Legs,
    player2Legs, setPlayer2Legs,
    currentTurn, setCurrentTurn,
    scoreP1, setScoreP1,
    scoreP2, setScoreP2,
    match, setMatch,
  } = useTornooi();

  const { dartsP1, dartsP2, lastThrowP1, lastThrowP2, doublesP1, doublesP2 } = useAnalytic();

  const { databaseMatch, users, checkouts } = useDatabase();

  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();

  useEffect(() => {
    setScoreP1(parseInt(tornooiModus));
    setScoreP2(parseInt(tornooiModus));
  }, [tornooiModus]);

  useEffect(() => {
    if (winner) {
      open();
    }
  }, [winner, open]);

  const resetGame = async () => {
    setBracket((prevBracket) =>
      prevBracket.map((match) => {
        if (
          (match.player1 === player1 && match.player2 === player2) ||
          (match.player1 === player2 && match.player2 === player1)
        ) {
          return {
            ...match,
            winner: winner,
          };
        }
        return match;
      })
    );

    let matchWinner = users.find((w) => w.name === winner);
    let matchId = parseInt(localStorage.getItem("tournamentMatchId"), 10);

    if (!matchWinner) {
      console.error("no winner found in users");
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
    setMatch(match + 1);
    setPlayer1Legs(0);
    setPlayer2Legs(0);
    setPlayer1Sets(0);
    setPlayer2Sets(0);
    close();
    navigate("/tornooiOverview");
  };

  const findCheckout = (score) => {
    if (!checkouts || checkouts.length === 0) {
      return "Loading";
    }

    const checkoutInfo = checkouts.find((item) => item.score === score);

    if (checkoutInfo) {
      return `${checkoutInfo.checkoutPath}`;
    } else {
      return "No checkout";
    }
  };

  return (
    <Stack align="center" spacing="sm">
      <Group position="center" spacing="lg" pt={40}>
        <Card
          shadow="sm"
          radius="md"
          withBorder
          w={130}
          h="auto"
          data-testid="p1"
          style={{
            border: currentTurn === 1 ? "3px solid #4caf50" : "none",
            boxShadow: currentTurn === 2 ? "2px 3px black" : "none",
          }}
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
          <Text>AVG: {calculateAvg(scoreP1, tornooiModus, dartsP1)}</Text>
          <Text>Sets: {player1Sets}</Text>
          <Text>Legs: {player1Legs}</Text>
          <Text>Vorige worp: {lastThrowP1}</Text>
          <Text>{findCheckout(scoreP1)}</Text>
        </Card>

        <Card
          shadow="sm"
          radius="md"
          withBorder
          w={130}
          h="auto"
          data-testid="p2"
          style={{
            border: currentTurn === 2 ? "3px solid #4caf50" : "none",
            boxShadow: currentTurn === 1 ? "2px 3px black" : "none",
          }}
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
          <Text>AVG: {calculateAvg(scoreP2, tornooiModus, dartsP2)}</Text>
          <Text>Sets: {player2Sets}</Text>
          <Text>Legs: {player2Legs}</Text>
          <Text>Vorige worp: {lastThrowP2}</Text>
          <Text>{findCheckout(scoreP2)}</Text>
        </Card>
      </Group>

      <Divider size={3} color="dark" w={350} />

      <InputThrowTornooi />

      <Modal
        opened={opened}
        onClose={resetGame}
        title="🎉 Game Over!"
        centered
        data-testid="popup"
      >
        <Stack align="center">
          <Title order={2}>{winner} heeft gewonnen! 🏆</Title>
          <Text>Aantal gegooide darts: {winner === player1 ? dartsP1 : dartsP2}</Text>
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

export default TornooiGamePage;
