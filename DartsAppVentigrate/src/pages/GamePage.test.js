import React, { act } from "react";
import GamePage from "./gamePage.jsx";
import { render, screen, fireEvent, renderHook, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { GameProvider, useGame } from "../context/gameContext.jsx";
import { AnalyticProvider } from "../context/analyticContext.jsx";
import '@testing-library/jest-dom';
import { MantineProvider } from "@mantine/core";
import * as checkoutModule from "../functionalities/database.js";
import { DatabaseProvider } from "../context/databaseContext.jsx";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

jest.mock('../functionalities/database', () => ({
    fetchCheckout: jest.fn(),
    updateMatch: jest.fn()
}));

jest.mock('../context/databaseContext.jsx', () => ({
    useDatabase: () => ({
        users: [{ id: 1, name: "Player 1" }, { id: 2, name: "Player 2" }],
        matches: [],
        throws: [],
        setThrows: jest.fn(),
        setMatches: jest.fn(),
        databaseMatch: {
            Player1Id: 1,
            Player2Id: 2,
            GamemodeId: 1,
            Datum: "2025-01-01"
          },
    }),
    DatabaseProvider: ({ children }) => children,
}))

jest.mock("../context/gameContext.jsx", () => ({
    useGame: () => ({
        player1: "Player 1",
        player2: "Player 2",
        scoreP1: 50,
        scoreP2: 50,
        currentTurn: 1,
        winner: "Player 1",
        setScoreP1: jest.fn(),
        setScoreP2: jest.fn(),
        setCurrentTurn: jest.fn(),
        setWinner: jest.fn(),
        setPlayer1: jest.fn(),
        setPlayer2: jest.fn(),
    }),
    GameProvider: ({ children }) => children, // Simply render children
}));

jest.mock("../context/analyticContext.jsx", () => ({
    useAnalytic: () => ({
        dartsP1: 3,
        dartsP2: 5,
        lastThrowP1: 20,
        lastThrowP2: 15,
        doublesP1: 2,
        doublesP2: 1,
    }),
    AnalyticProvider: ({ children }) => children,
}));

describe("GamePage", () => {
    const navigateMock = jest.fn();

    beforeEach(() => {
        // Reset mocks before each test
        useNavigate.mockReturnValue(navigateMock);
        act(() => {
            checkoutModule.fetchCheckout.mockResolvedValue([{ score: 100, checkoutPath: 'T20 T20 D20' }]);
        })
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const gameContextMock = {
        scoreP1: 50,
        scoreP2: 50,
        player1: "Player 1",
        player2: "Player 2",
        currentTurn: 1,
        setCurrentTurn: jest.fn(),
        setWinner: jest.fn(),
        setPlayer1: jest.fn(),
        setPlayer2: jest.fn(),
    };

    const page = () => {
        return render(
            <MemoryRouter>
                <DatabaseProvider>
                <GameProvider value={gameContextMock}>
                    <AnalyticProvider>
                        <MantineProvider>
                            <GamePage />
                        </MantineProvider>
                    </AnalyticProvider>
                </GameProvider>
                </DatabaseProvider>
            </MemoryRouter>
        );
    };

    it("shows up correctly", () => {
        page();
    });

    it("sets the starting scores", () => {
        page();
        const valueP1 = screen.getByTestId("valueP1");
        const valueP2 = screen.getByTestId("valueP2");

        expect(valueP1).toHaveTextContent("50");
        expect(valueP2).toHaveTextContent("50");
    });

    it("switches correctly to player 2", async () => {
        const { rerender } = render(
            <MemoryRouter>
                <DatabaseProvider>
                <GameProvider value={gameContextMock}>
                    <AnalyticProvider>
                        <MantineProvider>
                            <GamePage />
                        </MantineProvider>
                    </AnalyticProvider>
                </GameProvider>
                </DatabaseProvider>
            </MemoryRouter>
        );

        const player1 = screen.getByTestId("p1");
        const player2 = screen.getByTestId("p2");

        expect(player1).toHaveStyle("border: 3px solid #4caf50");
        expect(player2).toHaveStyle("border: none");

        act(() => {
            gameContextMock.setCurrentTurn(2);
        });
        act(() => {
            gameContextMock.currentTurn = 2;
        })
        rerender(
            <MemoryRouter>
                <DatabaseProvider>
                <GameProvider value={gameContextMock}>
                    <AnalyticProvider>
                        <MantineProvider>
                            <GamePage />
                        </MantineProvider>
                    </AnalyticProvider>
                </GameProvider>
                </DatabaseProvider>
            </MemoryRouter>
        );

        // Check for updated styles
        await waitFor(() => {
            expect(gameContextMock.currentTurn).toBe(2)
        });
    });

    it("shows the winner popup", async () => {
        render(
            <MemoryRouter>
                <DatabaseProvider>
                <GameProvider>
                    <AnalyticProvider>
                        <MantineProvider>
                            <GamePage />
                        </MantineProvider>
                    </AnalyticProvider>
                </GameProvider>
                </DatabaseProvider>
            </MemoryRouter>
        );

        const { result } = renderHook(() => useGame());

        act(() => {
            result.current.setWinner("Player 1");
        })

        const popup = await screen.findByTestId("popup");

        expect(popup).toBeInTheDocument();
    });

    it("navigates to start page when reset button is clicked", async () => {
        
        act(() => {
            gameContextMock.setWinner("Player 1");
            localStorage.setItem("matchId", "1")
        });

        page();

        const popup = await screen.findByTestId("popup");
        expect(popup).toBeInTheDocument();

        const resetButton = await screen.findByTestId("button");

        expect(resetButton).toBeInTheDocument();

        act(() => {
            fireEvent.click(resetButton);
        })


        await waitFor(() => expect(navigateMock).toHaveBeenCalledWith("/start"));
    });
});
