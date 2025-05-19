import React, { useState } from "react";
import { useTornooi } from "./tornooiContext.jsx";
import { useAnalytic } from "../../context/analyticContext.jsx";
import { calculateNewScore } from "../../functionalities/gameX01.js";
import { IconExclamationCircle } from "@tabler/icons-react";
import { Alert, Button, Group, Input, Notification, Stack, Text } from "@mantine/core";
import { checkWin } from "./tornooi.js";
import { useDatabase } from "../../context/databaseContext.jsx";
import { postThrow } from "../../functionalities/database.js";

function InputThrowTornooi() {
  const [multiplier, setMultiplier] = useState(1);
  const [currentLabel, setCurrentLabel] = useState(1);
  const [label1, setLabel1] = useState(0);
  const [dblLabel1, setDblLabel1] = useState(false);
  const [dblLabel2, setDblLabel2] = useState(false);
  const [dblLabel3, setDblLabel3] = useState(false);
  const [label2, setLabel2] = useState(0);
  const [label3, setLabel3] = useState(0);
  const [error, setError] = useState("");
  const [activeChoice, setActiveChoice] = useState("Single");

  const { users } = useDatabase();

  const {
    scoreP1, setScoreP1,
    scoreP2, setScoreP2,
    currentTurn, setCurrentTurn,
    setWinner,
    player1, player2,
    setPlayer1Sets, player1Sets,
    setPlayer2Sets, player2Sets,
    setPlayer1Legs, player1Legs,
    setPlayer2Legs, player2Legs,
    round, tornooiModus,
    legs, sets
  } = useTornooi();

  const {
    setDoublesP1, doublesP1,
    setDoublesP2, doublesP2,
    setDartsP1, dartsP1,
    setDartsP2, dartsP2,
    setLastThrowP1, setLastThrowP2,
  } = useAnalytic();

  const changeValue = (value) => {
    setActiveChoice(value);
    if (value === "Single") {
      setMultiplier(1);
    } else if (value === "Double") {
      setMultiplier(2);
    } else if (value === "Triple") {
      setMultiplier(3);
    } else if (value === "Bust") {
      setLabel1(0);
      setLabel2(0);
      setLabel3(0);
      setActiveChoice("Single");
      setMultiplier(1);
      let bust = true
      calculateScore(bust);
    }
  };

  const handleButtonClick = async (value) => {
    if (value.toString() === "Clear") {
      setCurrentLabel(1);
      setMultiplier(1);
      setLabel1(0);
      setLabel2(0);
      setLabel3(0);
      setActiveChoice("Single");
      setError("");
      return;
    }

    if (currentLabel === 1) {
      if (value === 25) {
        if (multiplier === 3) {
          setError("25 heeft geen triple!");
        } else {
          setLabel1(value * multiplier);
          multiplier === 2 ? setDblLabel1(true) : setDblLabel1(false);
          setCurrentLabel(2);
        }
      } else {
        setLabel1(value * multiplier);
        multiplier === 2 ? setDblLabel1(true) : setDblLabel1(false);
        setCurrentLabel(2);
      }
    } else if (currentLabel === 2) {
      if (value === 25) {
        if (multiplier === 3) {
          setError("25 heeft geen triple!");
        } else {
          setLabel2(value * multiplier);
          multiplier === 2 ? setDblLabel2(true) : setDblLabel2(false);
          setCurrentLabel(3);
        }
      } else {
        setLabel2(value * multiplier);
        multiplier === 2 ? setDblLabel2(true) : setDblLabel2(false);
        setCurrentLabel(3);
      }
    } else if (currentLabel === 3) {
      if (value === 25) {
        if (multiplier === 3) {
          setError("25 heeft geen triple!");
        } else {
          setLabel3(value * multiplier);
          multiplier === 2 ? setDblLabel3(true) : setDblLabel3(false);
          setCurrentLabel(0);
        }
      } else {
        setLabel3(value * multiplier);
        multiplier === 2 ? setDblLabel3(true) : setDblLabel3(false);
        setCurrentLabel(0);
      }
    } else if (currentLabel === 0) {
      if (value !== "Clear" && value !== "OK") {
        setError("Je kan niet meer dan 3 darts gooien!!!!");
      }
    }

    if (value.toString() === "OK") {
      const speler = currentTurn === 1 ? player1 : player2;

      let playerId = users.find((u) => u.name === speler);

      //save score to database
      const gooi = {
        MatchId: parseInt(localStorage.getItem("tournamentMatchId")),
        Throw1: label1,
        Throw2: label2,
        Throw3: label3,
        SpelerId: playerId.id,
        Datum: new Date().toISOString(),
      };

      await postThrow(gooi);
      let bust = false
      calculateScore(bust);
      setCurrentLabel(1);

      setLabel1(0);
      setLabel2(0);
      setLabel3(0);
      setActiveChoice("Single");
      setError("");
      setMultiplier(1);
      return;
    }
  };

  const calculateScore = async (bust) => {
    let totalThrow = 0
    if(bust === true)
    {
      totalThrow = 0 + 0 + 0
      const speler = currentTurn === 1 ? player1 : player2;

      let playerId = users.find((u) => u.name === speler);

      //save score to database
      const gooi = {
        MatchId: parseInt(localStorage.getItem("tournamentMatchId")),
        Throw1: 0,
        Throw2: 0,
        Throw3: 0,
        SpelerId: playerId.id,
        Datum: new Date().toISOString(),
      };

      await postThrow(gooi);
    }
    else
    {
      totalThrow = label1 + label2 + label3;
    }

    let lastDartDouble = false;
    let dartCount = 3;

    if (label3 !== 0) {
      lastDartDouble = dblLabel3;
      dartCount = 3;
    } else if (label2 !== 0) {
      lastDartDouble = dblLabel2;
      dartCount = 2;
    } else if (label1 !== 0) {
      lastDartDouble = dblLabel1;
      dartCount = 1;
    }

    let doubleCount = 0;
    if (dblLabel1) doubleCount += 1;
    if (dblLabel2) doubleCount += 1;
    if (dblLabel3) doubleCount += 1;

    if (currentTurn === 1) {
      const newScore = calculateNewScore(scoreP1, totalThrow, lastDartDouble);
      if (newScore === 0) {
        const win = checkWin(player1Sets, round, sets);
        if (win) {
          setWinner(player1);
          setDoublesP1(doublesP1 + doubleCount);
          setDartsP1(dartsP1 + dartCount);
          setLastThrowP1(totalThrow);
          setScoreP1(newScore);
          return;
        } else {
          const newLegs = player1Legs + 1;
          setPlayer1Legs(newLegs);
          if (newLegs === legs) {
            const newSets = player1Sets + 1;
            setPlayer1Sets(newSets);
            setPlayer1Legs(0);
            let win = checkWin(newSets, round, sets);
            if (win === true) {
              setWinner(player1);
              setDoublesP1(doublesP1 + doubleCount);
              setDartsP1(dartsP1 + dartCount);
              setLastThrowP1(totalThrow);
              setScoreP1(newScore);
              return;
            }
          }

          setScoreP1(parseInt(tornooiModus));
          setScoreP2(parseInt(tornooiModus));
          currentTurn === 1 ? setCurrentTurn(2) : setCurrentTurn(1);
          setDartsP1(0);
          setDartsP2(0);
        }
      } else {
        setLastThrowP1(totalThrow);
        setDartsP1(dartsP1 + 3);
        setScoreP1(newScore);
        currentTurn === 1 ? setCurrentTurn(2) : setCurrentTurn(1);
      }
    } else {
      const newScore = calculateNewScore(scoreP2, totalThrow, lastDartDouble);
      if (newScore === 0) {
        const win = checkWin(player2Sets, round, sets);
        if (win) {
          setWinner(player2);
          setDoublesP2(doublesP2 + doubleCount);
          setDartsP2(dartsP2 + dartCount);
          setLastThrowP2(totalThrow);
          setScoreP2(newScore);
          return;
        } else {
          const newLegs = player2Legs + 1;
          setPlayer2Legs(newLegs);
          if (newLegs === legs) {
            const newSets = player2Sets + 1;
            setPlayer2Sets(newSets);
            setPlayer2Legs(0);
            let win2 = checkWin(newSets, round, sets);
            if (win2 === true) {
              setWinner(player2);
              setDoublesP2(doublesP2 + doubleCount);
              setDartsP2(dartsP2 + dartCount);
              setLastThrowP2(totalThrow);
              setScoreP2(newScore);
              return;
            }
          }

          setScoreP1(parseInt(tornooiModus));
          setScoreP2(parseInt(tornooiModus));
          currentTurn === 2 ? setCurrentTurn(1) : setCurrentTurn(2);
          setDartsP1(0);
          setDartsP2(0);
        }
      } else {
        setLastThrowP2(totalThrow);
        setDartsP2(dartsP2 + 3);
        setScoreP2(newScore);
        currentTurn === 2 ? setCurrentTurn(1) : setCurrentTurn(2);
      }
    }
  };

  const choices = ["Single", "Double", "Triple", "Bust"];
  const numbers = [
    [1, 2, 3, 4, 5, 6],
    [7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18],
    ["Clear", 19, 20, 0, 25, "OK"],
  ];

  const icon = <IconExclamationCircle />;

  return (
    <Stack align="center" justify="center" gap="md">
      <Group gap="xl">
        <Group
          bg="white"
          pr={20}
          pl={20}
          bd={"3px solid"}
          style={{ borderRadius: "10px" }}
        >
          <Text
            fw={'bold'}
            fz={25}
            data-testid="label1"
          >
            {label1}
          </Text>

          <Text
            fw={'bold'}
            fz={25}
          >
            {label2}
          </Text>

          <Text
            fw={'bold'}
            fz={25}
          >
            {label3}
          </Text>
        </Group>
      </Group>
      <Group gap="xs">
        {choices.map((choice) => (
          <Button
            key={choice}
            onClick={() => changeValue(choice)}
            variant="outline"
            color="dark"
            bg={activeChoice === choice ? "#4caf50" : "#fff"}
            c={activeChoice === choice ? "white" : "dark"}
            style={{ boxShadow: "1px 2px black" }}
            data-testid={choice}
          >
            {choice}
          </Button>
        ))}
      </Group>
      <Stack gap="xs" align="center" justify="center">
        {numbers.map((row, rowIndex) => (
          <Group key={rowIndex} gap="xs">
            {row.map((num) => (
              <Button
                key={num}
                onClick={() => handleButtonClick(num)}
                h="50px"
                w="50px"
                variant="outline"
                color="dark"
                bg={num === "OK" ? "#4caf50" : "#fff"}
                c={num === "OK" ? "white" : "dark"}
                display={'flex'}
                fz={"18px"}
                p={0}
                radius={15}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "1px 2px black",
                }}
              >
                {num}
              </Button>
            ))}
          </Group>
        ))}
      </Stack>
      {error != "" && (
        <Notification
            icon={icon}
            color="red"
            title="Error!"
            withCloseButton={false}
        >
            {error}
        </Notification>
      )}
    </Stack>
  );
}

export default InputThrowTornooi;
