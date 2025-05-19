import {
  Button,
  Divider,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useTornooi } from "./tornooiContext.jsx";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { useDatabase } from "../../context/databaseContext.jsx";
import {
  fetchThrow,
  fetchTournamentMatch,
  postMatch,
  postTournamentMatch,
  updateTournament,
} from "../../functionalities/database.js";

function TornooiOverviewPage() {
  const {
    tournamentWinner,
    setTournamentWinner,
    tornooiModus,
    bracket,
    setBracket,
    round,
    setRound,
    setPlayer1,
    setPlayer2,
    match,
    setMatch,
  } = useTornooi();
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);

  const {
    users,
    gamemodes,
    setDatabaseMatch,
    databaseTournament,
    setTournamentMatches,
    setThrows
  } = useDatabase();

  const [oldMatches, setOldMatches] = useState([]);

  useEffect(() => {
    if (tournamentWinner) {
      open();
    }
  }, [tournamentWinner, open]);

  useEffect(() => {
    async function loadOldMatches() {
      const all = await fetchTournamentMatch();
      let tournamentId = parseInt(localStorage.getItem("tornooiId"), 10);
      const matches = all.filter((m) => m.tournament.id === tournamentId);
      setOldMatches(matches);
    }
    loadOldMatches();
  }, []);

  const pastByRound = useMemo(() => {
    return oldMatches
      .filter((m) => m.round !== round)
      .reduce((groups, m) => {
        (groups[m.round] = groups[m.round] || []).push(m);
        return groups;
      }, {});
  }, [oldMatches, round]);

  const resetGame = async () => {
    let newTournamentWinner = await users.find(
      (w) => w.name === tournamentWinner[0]
    );
    let tournamentId = parseInt(localStorage.getItem("tornooiId"), 10);

    if (!newTournamentWinner) {
      return;
    }

    const updatedTournament = {
      Id: tournamentId,
      WinnerId: newTournamentWinner.id,
      Datum: databaseTournament.Datum,
    };

    await updateTournament(tournamentId, updatedTournament);

    setTournamentWinner("");
    close();

    const all = await fetchTournamentMatch();
    setTournamentMatches(all);

    const allThrows = await fetchThrow();
    setThrows(allThrows);

    navigate("/statTornooi");
  };

  const startGame = async () => {
    const allMatchesHaveWinner = bracket.every(
      (match) => match.winner !== null
    );

    if (allMatchesHaveWinner) {
      if (round === "Finale") {
        setTournamentWinner(bracket.map((b) => b.winner));
        return;
      }

      const newBracket = [];
      let num = 1;
      bracket.forEach((b, i) => {
        if (i % 2 === 0) {
          newBracket.push({
            match: num++,
            player1: b.winner || "Bye",
            player2: bracket[i + 1]?.winner || "Bye",
            winner: null,
          });
        }
      });
      setBracket(newBracket);
      setMatch(1);
      if (newBracket.length === 1) setRound("Finale");
      return;
    }
    if (bracket.length === 1) {
      setRound("Finale");
    }
    const currentMatch = bracket.find(
      (brack) => brack.match === match && !brack.winner
    );

    if (!currentMatch) {
      return;
    }

    setPlayer1(currentMatch.player1);
    setPlayer2(currentMatch.player2);

    let game = gamemodes.find((g) => g.name === tornooiModus.toString());
    let p1 = users.find((u1) => u1.name === currentMatch.player1);
    let p2 = users.find((u2) => u2.name === currentMatch.player2);

    const NewMatch = {
      Player1Id: p1.id,
      Player2Id: p2.id,
      GamemodeId: game.id,
      WinnerId: null,
      Finished: false,
      Datum: new Date().toISOString(),
    };

    setDatabaseMatch(NewMatch);

    const createdMatch = await postMatch(NewMatch);

    if (createdMatch && createdMatch.id) {
      localStorage.setItem("tournamentMatchId", createdMatch.id);
    }

    const tournamentId = localStorage.getItem("tornooiId");
    const matchId = localStorage.getItem("tournamentMatchId");

    const newTournmantMatch = {
      TournamentId: tournamentId,
      MatchId: matchId,
      Round: round,
    };

    await postTournamentMatch(newTournmantMatch);

    navigate("/tornooiGamePage");
  };

  return (
    <Stack align="center" justify="center" gap="sm" h="auto">
      <Title order={2}>Tournament overview: {tornooiModus}</Title>
      {Object.entries(pastByRound).map(([r, matches]) => (
        <Paper w="95%" p="md" key={r}>
          <Title order={4} mb="xs">
            Ronde: {r}
          </Title>
          <Divider mb="sm" />
          {matches.map((entry) => (
            <Text key={entry.match.id}>
              {entry.match.player1.name} vs {entry.match.player2.name}
              {entry.match.winner
                ? ` — Winnaar: ${entry.match.winner.name}`
                : ""}
            </Text>
          ))}
        </Paper>
      ))}
      <Paper w={"95%"} p={"md"} data-testid="bracket">
        <Title order={4} mb={"xs"}>
          Ronde: {round}
        </Title>
        <Divider mb={"sm"} />
        {bracket.map((players) => (
          <Text key={players.player1}>
            {players.player1} vs {players.player2}{" "}
            {players.winner
              ? `- Winnaar: ${players.winner}`
              : "(Nog geen winnaar)"}
          </Text>
        ))}
      </Paper>

      <Button
        variant="outline"
        color="dark"
        bg="rgba(255, 255, 255, 1)"
        size="md"
        w={250}
        style={{ boxShadow: "2px 3px black" }}
        onClick={startGame}
      >
        Volgende Ronde
      </Button>

      <Modal
        opened={opened}
        onClose={resetGame}
        title="🎉 Game Over!"
        centered
        data-testid="popup"
      >
        <Stack align="center">
          <Title order={2}>{tournamentWinner} heeft gewonnen! 🏆</Title>
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

export default TornooiOverviewPage;
