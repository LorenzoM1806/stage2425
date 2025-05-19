// eslint-disable-next-line no-unused-vars
import React from "react";
import { createContext, useContext, useState } from "react";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [gameMode, setGameMode] = useState("");
  const [scoreP1, setScoreP1] = useState(0);
  const [scoreP2, setScoreP2] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [winner, setWinner] = useState(null);

  return (
    <GameContext.Provider
      value={{
        player1, setPlayer1,
        player2, setPlayer2,
        gameMode, setGameMode,
        scoreP1, setScoreP1,
        scoreP2, setScoreP2,
        currentTurn, setCurrentTurn,
        winner, setWinner,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
