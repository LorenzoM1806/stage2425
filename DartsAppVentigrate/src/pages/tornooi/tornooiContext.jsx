import React, { use } from "react";
import { createContext, useContext, useState } from "react";

const TornooiContext = createContext();

export const TornooiProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [tornooiModus, setTornooiModus] = useState(0);
  const [round, setRound] = useState("1");
  const [match, setMatch] = useState(1);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [winner, setWinner] = useState(null);
  const [tournamentWinner, setTournamentWinner] = useState(null);
  const [player1Sets, setPlayer1Sets] = useState(0);
  const [player2Sets, setPlayer2Sets] = useState(0);
  const [player1Legs, setPlayer1Legs] = useState(0);
  const [player2Legs, setPlayer2Legs] = useState(0);
  const [bracket, setBracket] = useState([]);
  const [scoreP1, setScoreP1] = useState(0);
  const [scoreP2, setScoreP2] = useState(0);
  const [sets, setSets] = useState(0);
  const [legs, setLegs] = useState(0);

  return (
    <TornooiContext.Provider
      value={{
        players, setPlayers,
        player1, setPlayer1,
        player2, setPlayer2,
        tornooiModus, setTornooiModus,
        round, setRound,
        currentTurn, setCurrentTurn,
        winner, setWinner,
        tournamentWinner, setTournamentWinner,
        player1Sets, setPlayer1Sets,
        player2Sets, setPlayer2Sets,
        player1Legs, setPlayer1Legs,
        player2Legs, setPlayer2Legs,
        bracket, setBracket,
        scoreP1, setScoreP1,
        scoreP2, setScoreP2,
        match, setMatch,
        sets, setSets,
        legs, setLegs
      }}
    >
      {children}
    </TornooiContext.Provider>
  );
};
export const useTornooi = () => useContext(TornooiContext);
