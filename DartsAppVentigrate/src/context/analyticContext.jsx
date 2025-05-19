// eslint-disable-next-line no-unused-vars
import React from "react";
import { createContext, useContext, useState } from "react";

const AnalyticContext = createContext();

export const AnalyticProvider = ({ children }) => {
  const [doublesP1, setDoublesP1] = useState(0);
  const [doublesP2, setDoublesP2] = useState(0);
  const [dartsP1, setDartsP1] = useState(0);
  const [dartsP2, setDartsP2] = useState(0);
  const [lastThrowP1, setLastThrowP1] = useState("");
  const [lastThrowP2, setLastThrowP2] = useState("");

  return (
    <AnalyticContext.Provider
      value={{
        doublesP1, setDoublesP1,
        doublesP2, setDoublesP2,
        dartsP1, setDartsP1,
        dartsP2, setDartsP2,
        lastThrowP1, setLastThrowP1,
        lastThrowP2, setLastThrowP2,
      }}
    >
      {children}
    </AnalyticContext.Provider>
  );
};

export const useAnalytic = () => useContext(AnalyticContext);
