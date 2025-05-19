import React from "react";
import { createContext, useContext, useState } from "react";

const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [gamemodes, setGamemodes] = useState([]);
  const [databaseMatch, setDatabaseMatch] = useState();
  const [databaseTournament, setDatabaseTournament] = useState();
  const [checkouts, setCheckouts] = useState([]);
  const [throws, setThrows] = useState([])
  const [tournamentMatches, setTournamentMatches] = useState([]);
  const [matches, setMatches] = useState([]);

  return (
    <DatabaseContext.Provider
      value={{
        users, setUsers,
        gamemodes, setGamemodes,
        databaseMatch, setDatabaseMatch,
        databaseTournament, setDatabaseTournament,
        checkouts, setCheckouts,
        throws, setThrows,
        tournamentMatches, setTournamentMatches,
        matches, setMatches
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);
