import '@testing-library/jest-dom';
import React, { act } from "react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { GameProvider } from "../context/gameContext.jsx";
import { AnalyticProvider } from "../context/analyticContext.jsx";
import { MantineProvider } from "@mantine/core";
import AroundWorldPage from "./aroundWorldPage.jsx";
import { DatabaseProvider } from '../context/databaseContext.jsx';
import { postThrow } from '../functionalities/database.js';

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));
jest.mock("../context/gameContext.jsx", () => ({
    useGame: () => ({
        player1: "Player 1",
        player2: "Player 2",
        currentTurn: 1,
        winner: "Player 1",
        setCurrentTurn: jest.fn(),
        setWinner: jest.fn(),
        setPlayer1: jest.fn(),
        setPlayer2: jest.fn(),
    }),
    GameProvider: ({ children }) => children,
}));
jest.mock('../functionalities/database', () => ({
    postThrow: jest.fn(),
    updateMatch: jest.fn()

}));
jest.mock('../context/databaseContext.jsx', () => ({
    useDatabase: () => ({
        users: [{ id: 1, name: "Player 1" }, { id: 2, name: "Player 2" }],
        matches: [],
        throws: [],
        setThrows: jest.fn(),
        setMatches: jest.fn(),
    }),
    DatabaseProvider: ({ children }) => children,
}))

describe("AroundWorldPage", () => {
    const navigateMock = jest.fn();

    beforeEach(() => {
        // Reset mocks before each test
        useNavigate.mockReturnValue(navigateMock);
        postThrow.mockReturnValue([{matchId: 1, throw1: 60, throw2: 60, throw3: 60, spelerId: 1}])
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const gameContextMock = {
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
                            <AroundWorldPage />
                        </MantineProvider>
                    </AnalyticProvider>
                </GameProvider>
                </DatabaseProvider>
            </MemoryRouter>
        );
    };

    it('should show the page correctly', () => {
        page()

        expect(screen.getByRole("button", { name: /Volgende Speler/i })).toBeInTheDocument()
    });
    it('should cancel the game when pushing the cancel button', () => {
        page()

        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /Annuleer het Spel/i }));
        })

        expect(navigateMock).toHaveBeenCalledTimes(1);
        expect(navigateMock).toHaveBeenCalledWith("/start");
    });
    it('should change to the next player when pushing the button', () => {
        page()

        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /Volgende Speler/i }))
        })

        const style = screen.getByTestId("p2")

        expect(style).toHaveStyle("boxShadow:")
    });
    it('should change the number for current player', () => {

        page()

        const nextNumber = screen.getByRole("button", { name: /volgende Nummer/i });
        act(() => {
            fireEvent.click(nextNumber)
        })

        const number = screen.getByTestId("p1")

        expect(number).toHaveTextContent("2")

    });
    it('should show the popup when someone wins', async () => {
        page()

        // Simulate Player 1 reaching 50
        const nextNumberBtn = screen.getByRole("button", { name: /Volgende Nummer/i });
        const nextPlayerBtn = screen.getByRole("button", { name: /Volgende Speler/i });

        for (let i = 1; i <= 20; i++) {
            fireEvent.click(nextNumberBtn); // Dart 1
            fireEvent.click(nextNumberBtn); // Dart 2
            fireEvent.click(nextNumberBtn); // Dart 3
            fireEvent.click(nextPlayerBtn); // Next Player (P2)
            fireEvent.click(nextPlayerBtn); // Back to Player 1 (simplified test)
        }

        // 20 -> 25
        fireEvent.click(nextNumberBtn);
        fireEvent.click(nextNumberBtn);
        fireEvent.click(nextNumberBtn);
        fireEvent.click(nextPlayerBtn);
        fireEvent.click(nextPlayerBtn);

        // 25 -> 50
        fireEvent.click(nextNumberBtn);
        fireEvent.click(nextNumberBtn);
        fireEvent.click(nextNumberBtn);

        const popup = await screen.findByTestId("popup");

        expect(popup).toBeInTheDocument();
    });
})