import '@testing-library/jest-dom';
import React, { act } from "react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { GameProvider } from "../context/gameContext.jsx";
import { AnalyticProvider } from "../context/analyticContext.jsx";
import { MantineProvider } from "@mantine/core";
import CutThroatPage from "./cutThroatPage.jsx";
import { DatabaseProvider } from '../context/databaseContext.jsx';

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
    }), GameProvider: ({ children }) => children,
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
}));

describe("CutThroatPage", () => {
    const navigateMock = jest.fn();

    beforeEach(() => {
        // Reset mocks before each test
        useNavigate.mockReturnValue(navigateMock);
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
                            <CutThroatPage />
                        </MantineProvider>
                    </AnalyticProvider>
                </GameProvider>
                </DatabaseProvider>
            </MemoryRouter>
        );
    };

    it('should show the page correctly', () => {
        page()

        expect(screen.getByRole("button", { name: /Triple/i })).toBeInTheDocument()
    });
    it('should cancel the game when pushing the cancel button', () => {
        page()

        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /Annuleer het Spel/i }));
        })

        expect(navigateMock).toHaveBeenCalledTimes(1);
        expect(navigateMock).toHaveBeenCalledWith("/start");
    });
    it('should change to the next player when pushing the next turn button', () => {
        page()

        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /Volgende Speler/i }))
        })

        const style = screen.getByTestId("p2")

        expect(style).toHaveStyle("boxShadow:")
    });
    it('should update the card when hitting a value', () => {
        page()

        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /Hit 20/i }))
        })

        const num = screen.getByTestId("p1")

        expect(num).toHaveTextContent("20: 1")
    });
    it('should switch the multiplier when pushing for example Double', () => {
        page()

        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /Double/i }))
        })

        const multi = screen.getByTestId("Double")

        expect(multi).toHaveStyle("background: #4caf50")
    });
    it('should show the popup when someone wins', async () => {
        page();

        const sequence = [
            /Triple/i,
            /Hit 20/i,
            /Triple/i,
            /Hit 19/i,
            /Triple/i,
            /Hit 18/i,
            /Volgende Speler/i,
            /Volgende Speler/i,
            /Triple/i,
            /Hit 17/i,
            /Triple/i,
            /Hit 16/i,
            /Triple/i,
            /Hit 15/i,
           /Volgende Speler/i,
           /Volgende Speler/i,
            /Double/i,
            /Hit Bull/i,
            /Single/i,
            /Hit Bull/i,
            /Volgende Speler/i,
        ];

        for (const action of sequence) {
            act(() => {
                fireEvent.click(screen.getByRole("button", { name: action }));
            });
        }

        const popup = await screen.findByTestId("popup");

        expect(popup).toBeInTheDocument();
    });

})