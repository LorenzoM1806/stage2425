import React, {act} from "react";
import '@testing-library/jest-dom';
import {fireEvent, render, renderHook, screen, waitFor, within} from "@testing-library/react"
import {MemoryRouter, useNavigate} from "react-router-dom";
import * as checkoutModule from "../../functionalities/database.js";
import {AnalyticProvider} from "../../context/analyticContext.jsx";
import {MantineProvider} from "@mantine/core";
import {TornooiProvider, useTornooi} from "./tornooiContext.jsx";
import TornooiGamePage from "./tornooiGamePage.jsx";
import {GameProvider} from "../../context/gameContext.jsx";
import { DatabaseProvider } from "../../context/databaseContext.jsx";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

jest.mock('../../functionalities/database', () => ({
    fetchCheckout: jest.fn(),
    updateMatch: jest.fn()
}));

jest.mock('../../context/databaseContext.jsx', () => ({
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

jest.mock("../tornooi/tornooiContext.jsx", () => ({
    useTornooi: () => ({
        player1: "Player 1",
        player2: "Player 2",
        scoreP1: 50,
        scoreP2: 50,
        currentTurn: 1,
        winner: "Player 1", // Winner is set so the popup should show
        setScoreP1: jest.fn(),
        setScoreP2: jest.fn(),
        setCurrentTurn: jest.fn(),
        setWinner: jest.fn(),
        setPlayer1: jest.fn(),
        setPlayer2: jest.fn(),
        setBracket: jest.fn(),
        setMatch: jest.fn(),
        setPlayer1Legs: jest.fn(),
        setPlayer2Legs: jest.fn(),
        setPlayer1Sets: jest.fn(),
        setPlayer2Sets: jest.fn(),
    }),
    TornooiProvider: ({ children }) => children, // Simply render children
}));

jest.mock("../../context/analyticContext.jsx", () => ({
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

describe("TornooiGamePage", () => {
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

    const tornooiContextMock = {
        scoreP1: 50,
        scoreP2: 50,
        player1: "Player 1",
        player2: "Player 2",
        currentTurn: 1,
        setCurrentTurn: jest.fn(),
        setWinner: jest.fn(),
        setPlayer1: jest.fn(),
        setPlayer2: jest.fn(),
        setBracket: jest.fn(),
        setMatch: jest.fn(),
        setPlayer1Legs: jest.fn(),
        setPlayer2Legs: jest.fn(),
        setPlayer1Sets: jest.fn(),
        setPlayer2Sets: jest.fn(),
    };

    const page = () => {
        return render(
            <MemoryRouter>
                <DatabaseProvider>
                <TornooiProvider value={tornooiContextMock}>
                    <GameProvider>
                        <AnalyticProvider>
                            <MantineProvider>
                                <TornooiGamePage />
                            </MantineProvider>
                        </AnalyticProvider>
                    </GameProvider>
                </TornooiProvider>
                </DatabaseProvider>
            </MemoryRouter>
        );
    };

    it('should show the page correct', () => {
        page()

        expect(screen.getByRole("button", {name: /Ok/i}))
    });
    it('should set the starting scores correct', () => {
        page()
        const valueP1 = screen.getByTestId("valueP1");
        const valueP2 = screen.getByTestId("valueP2");

        expect(valueP1).toHaveTextContent("50")
        expect(valueP2).toHaveTextContent("50")
    });
    it('should switch correctly to player 2', async () => {
        const { rerender } = render(
            <MemoryRouter>
                <DatabaseProvider>
                <TornooiProvider value={tornooiContextMock}>
                    <GameProvider>
                        <AnalyticProvider>
                            <MantineProvider>
                                <TornooiGamePage />
                            </MantineProvider>
                        </AnalyticProvider>
                    </GameProvider>
                </TornooiProvider>
                </DatabaseProvider>
            </MemoryRouter>
        );

        const player1 = screen.getByTestId("p1");
        const player2 = screen.getByTestId("p2");

        // Initial assertions for Player 1 and Player 2
        expect(player1).toHaveStyle("border: 3px solid #4caf50");
        expect(player2).toHaveStyle("border: none");

        // Update state and rerender
        act(() => {
            tornooiContextMock.setCurrentTurn(2);
            tornooiContextMock.currentTurn = 2;
        });

        rerender(
            <MemoryRouter>
                <DatabaseProvider>
                <TornooiProvider value={tornooiContextMock}>
                    <GameProvider>
                        <AnalyticProvider>
                            <MantineProvider>
                                <TornooiGamePage />
                            </MantineProvider>
                        </AnalyticProvider>
                    </GameProvider>
                </TornooiProvider>
                </DatabaseProvider>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(tornooiContextMock.currentTurn).toBe(2)
        });
    });
    it('should show the winner popup', async () => {
        page()

        const { result } = renderHook(() => useTornooi());

        act(() => {
            result.current.setWinner("Player 1");
        })

        const popup = await screen.findByTestId("popup");

        expect(popup).toBeInTheDocument();
    });
    it('should navigate to tornooiOverview page when reset button is clicked', async () => {
        act(() => {
            tornooiContextMock.setWinner("Player 1");
            localStorage.setItem("tournamentMatchId", "1");
        });

        page()

        const popup = await screen.findByTestId("button");
        expect(popup).toBeInTheDocument();

        act(()=> {
            fireEvent.click(popup);
        })

        await waitFor(() => expect(navigateMock).toHaveBeenCalledWith("/tornooiOverview"));
    });
})