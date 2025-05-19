// eslint-disable-next-line no-unused-vars
import React, { act } from "react";
import StartPage from "./startPage.jsx";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { GameProvider } from "../context/gameContext.jsx";
import { AnalyticProvider } from "../context/analyticContext.jsx";
import '@testing-library/jest-dom'
import { MantineProvider } from "@mantine/core";
import { DatabaseProvider } from "../context/databaseContext.jsx";
import * as checkoutModule from "../functionalities/database.js";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));
let mockP1 = '';
let mockP2 = '';
let mockGameMode = '';
jest.mock("../context/gameContext.jsx", () => ({
    useGame: () => ({
        player1: mockP1,
        player2: mockP2,
        scoreP1: 501,
        scoreP2: 501,
        currentTurn: 1,
        gameMode: mockGameMode,
        setPlayer1: jest.fn(),
        setPlayer2: jest.fn(),
        setGameMode: jest.fn(),
        setCurrentTurn: jest.fn(),
        setDoublesP1: jest.fn(),
        setDoublesP2: jest.fn(),
        setDartsP1: jest.fn(),
        setDartsP2: jest.fn(),
        setLastThrowP1: jest.fn(),
        setLastThrowP2: jest.fn(),
    }),
    GameProvider: ({ children }) => children,
}));

jest.mock('../context/databaseContext.jsx', () => ({
    useDatabase: () => ({
        users: [{ id: 1, name: "Player 1" }, { id: 2, name: "Player 2" }],
        matches: [],
        throws: [],
        gamemodes: [
            {name: '501'}, {name: "301"}, {name: "Cut throat"}, {name: "Around the world"}
        ],
        setThrows: jest.fn(),
        setMatches: jest.fn(),
        databaseMatch: {
            Player1Id: 1,
            Player2Id: 2,
            GamemodeId: 1,
            Datum: "2025-01-01"
          },
        setDatabaseMatch: jest.fn()
    }),
    DatabaseProvider: ({ children }) => children,
}))
jest.mock('../functionalities/database', () => ({
    fetchGamemode: jest.fn(),
    fetchUser: jest.fn(),
    postMatch: jest.fn()
}));

describe("StartPage", () => {

    const navigateMock = jest.fn();

    beforeEach(() => {
        // Reset mocks before each test
        useNavigate.mockReturnValue(navigateMock);
        checkoutModule.fetchUser.mockResolvedValue([{name: 'Guest', email: 'Guest@Guest.be', favoriteGameId: 1}])
        checkoutModule.fetchGamemode.mockResolvedValue([{name: '501'}, {name: '301'}, {name: 'Around the world'}, {name: 'Cut throat'}])
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("shows up correctly", () => {
        render(
            <MemoryRouter>
                <DatabaseProvider>
                <GameProvider>
                    <AnalyticProvider>
                        <MantineProvider>
                            <StartPage></StartPage>
                        </MantineProvider>
                    </AnalyticProvider>
                </GameProvider>
                </DatabaseProvider>
            </MemoryRouter>
        )
    })

    it("updates player 1 input values correctly", () => {
        render(
            <MemoryRouter>
                <DatabaseProvider>
                <GameProvider>
                    <AnalyticProvider>
                        <MantineProvider>
                            <StartPage></StartPage>
                        </MantineProvider>
                    </AnalyticProvider>
                </GameProvider>
                </DatabaseProvider>
            </MemoryRouter>
        );

        const player1 = screen.getByPlaceholderText(/Kies speler 1/i);


        act(() => {
            fireEvent.change(player1, { target: { value: 'Player 1' } });
        })

        expect(player1.value).toBe('Player 1')
    });

    it("updates player 2 input values correctly", () => {
        render(
            <MemoryRouter>
                <DatabaseProvider>
                <GameProvider>
                    <AnalyticProvider>
                        <MantineProvider>
                            <StartPage></StartPage>
                        </MantineProvider>
                    </AnalyticProvider>
                </GameProvider>
                </DatabaseProvider>
            </MemoryRouter>
        );

        const player2 = screen.getByPlaceholderText(/Kies speler 2/i);

        act(() => {
            fireEvent.change(player2, { target: { value: 'Player 2' } });
        })

        expect(player2.value).toBe('Player 2')
    });

    it("updates game mode correctly", () => {
        render(
            <MemoryRouter>
                <DatabaseProvider>
                <GameProvider>
                    <AnalyticProvider>
                        <MantineProvider>
                            <StartPage></StartPage>
                        </MantineProvider>
                    </AnalyticProvider>
                </GameProvider>
                </DatabaseProvider>
            </MemoryRouter>
        );

        const gameMode = screen.getByPlaceholderText(/Kies het gewenste spel/i);

        act(() => {
            fireEvent.change(gameMode, { target: { value: '501' } });
        })

        expect(gameMode.value).toBe('501')
    })

    it("shows an error if Speler 1 is missing", () => {

        render(
            <MemoryRouter>
                <DatabaseProvider>
                <GameProvider>
                    <AnalyticProvider>
                        <MantineProvider>
                            <StartPage></StartPage>
                        </MantineProvider>
                    </AnalyticProvider>
                </GameProvider>
                </DatabaseProvider>
            </MemoryRouter>
        );

        act(() => {
            fireEvent.click(screen.getByText(/Start/i))
        })

        const speler1Error = screen.getByText("Selecteer speler 1!");
        expect(speler1Error).toBeInTheDocument();
    })

    it("shows an error if Speler 2 is missing", () => {
        render(
            <MemoryRouter>
                <DatabaseProvider>
                <GameProvider>
                    <AnalyticProvider>
                        <MantineProvider>
                            <StartPage></StartPage>
                        </MantineProvider>
                    </AnalyticProvider>
                </GameProvider>
                </DatabaseProvider>
            </MemoryRouter>
        );

        act(() => {
            fireEvent.click(screen.getByText(/Start/i))
        })

        const speler2Error = screen.getByText("Selecteer speler 2!");
        expect(speler2Error).toBeInTheDocument();
    })
    it("shows an error if game mode is not selected", () => {
        render(
            <MemoryRouter>
                <DatabaseProvider>
                <GameProvider>
                    <AnalyticProvider>
                        <MantineProvider>
                            <StartPage></StartPage>
                        </MantineProvider>
                    </AnalyticProvider>
                </GameProvider>
                </DatabaseProvider>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText(/Start/i))

        const gamemodeError = screen.getByText("Selecteer een spelmodus!");
        expect(gamemodeError).toBeInTheDocument();
    })

    it("navigates to /game when all fields are filled", async () => {

        mockP1 = "Player 1"
        mockP2 = "Player 2"
        mockGameMode = "501"

        render(
            <MemoryRouter>
                <DatabaseProvider>
                <GameProvider>
                    <AnalyticProvider>
                        <MantineProvider>
                            <StartPage></StartPage>
                        </MantineProvider>
                    </AnalyticProvider>
                </GameProvider>
                </DatabaseProvider>
            </MemoryRouter>
        );

        const player1 = screen.getByPlaceholderText(/Kies speler 1/i);
        act(() => {
            fireEvent.change(player1, { target: { value: 'Player 1' } });
        })

        const player2 = screen.getByPlaceholderText(/Kies speler 2/i);
        act(() => {
            fireEvent.change(player2, { target: { value: 'Player 2' } });
        })

        const gameMode = screen.getByPlaceholderText(/Kies het gewenste spel/i);
        act(() => {
            fireEvent.change(gameMode, { target: { value: '501' } });
        })

        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /Start/i }))
        })

        await waitFor(() => {
            expect(navigateMock).toHaveBeenCalledWith("/game");
        })
    })

    it("navigates to /home when Back is clicked", () => {
        render(
            <MemoryRouter>
                <DatabaseProvider>
                <GameProvider>
                    <AnalyticProvider>
                        <MantineProvider>
                            <StartPage></StartPage>
                        </MantineProvider>
                    </AnalyticProvider>
                </GameProvider>
                </DatabaseProvider>
            </MemoryRouter>
        );

        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /Home/i }))
        })

        expect(navigateMock).toHaveBeenCalledTimes(1);
        expect(navigateMock).toHaveBeenCalledWith("/home");

    })
})
