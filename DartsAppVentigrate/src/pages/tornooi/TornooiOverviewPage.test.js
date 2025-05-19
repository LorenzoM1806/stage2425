import {MemoryRouter, useNavigate} from "react-router-dom";
import {fireEvent, render, screen, waitFor, within} from "@testing-library/react";
import {TornooiProvider, useTornooi} from "./tornooiContext.jsx";
import {GameProvider} from "../../context/gameContext.jsx";
import {AnalyticProvider} from "../../context/analyticContext.jsx";
import {MantineProvider} from "@mantine/core";
import '@testing-library/jest-dom';
import React from "react";
import TornooiOverviewPage from "./tornooiOverviewPage.jsx";
import { DatabaseProvider } from "../../context/databaseContext.jsx";
import * as checkoutModule from "../../functionalities/database.js";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

jest.mock('../../functionalities/database', () => ({
    postMatch: jest.fn(),
    postTournamentMatch: jest.fn(),
    updateTournament: jest.fn(),
    fetchTournamentMatch: jest.fn()
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
          gamemodes: [
            {name: '501'}, {name: "301"}, {name: "Cut throat"}, {name: "Around the world"}
        ],
        setDatabaseMatch: jest.fn(),
        databaseTournament: {
            winnerId: null,
            Datum: "2025-01-01"
        },
        tournamentMatches: [],
        setTournamentMatches: jest.fn(),
    }),
    DatabaseProvider: ({ children }) => children,
}))

jest.mock("../tornooi/tornooiContext.jsx", () => ({
    useTornooi: () => ({
        bracket: [{match: 1, player1: 'Player 1', player2: 'Player 2', winner: null}],
        match: 1,
        round: "Finale",
        setRound: jest.fn(),
        setMatch: jest.fn(),
        setBracket: jest.fn(),
        setTournamentWinner: jest.fn(),
        tournamentWinner: "Player 1",
        setPlayer1: jest.fn(),
        setPlayer2: jest.fn(),
        tornooiModus: 301
    }),
    TornooiProvider: ({ children }) => children, // Simply render children
}));

describe("TornooiOverviewPage", () => {
    const navigateMock = jest.fn();

    beforeEach(() => {
        useNavigate.mockReturnValue(navigateMock);
        checkoutModule.fetchTournamentMatch.mockResolvedValue([
            { id: 1, tournament: { id: 1, winner: null, datum: "2025-01-01T00:00:00Z" }, match: {
                id: 1, player1: {id : 1, name: "Player 1"}, player2: {id: 2, name: "Player 2"}, winner: {id: 1, name: "Player 1"}
             }, round: "1" }
          ]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const  tornooiContextMock = {
        bracket: [{match: 1, player1: 'Player 1', player2: 'Player 2', winner: null}],
        match: 1,
        round: "Finale",
        setRound: jest.fn(),
        setMatch: jest.fn(),
        setBracket: jest.fn(),
        tournamentWinner: "Player 1",
        setTournamentWinner: jest.fn(),
        setPlayer1: jest.fn(),
        setPlayer2: jest.fn()
    };

    const page = () => {
        return render(
            <MemoryRouter>
                <DatabaseProvider>
                <TornooiProvider value={tornooiContextMock}>
                    <GameProvider>
                        <AnalyticProvider>
                            <MantineProvider>
                                <TornooiOverviewPage />
                            </MantineProvider>
                        </AnalyticProvider>
                    </GameProvider>
                </TornooiProvider>
                </DatabaseProvider>
            </MemoryRouter>
        );
    }

    it('should show page correct', () => {
        page()

        expect(screen.getByRole("button", {name: /Volgende Ronde/i}))
    });
    it('should show the tournament bracket', () => {
        page()

        const button = screen.getByRole("button", {name:  /Volgende Ronde/i })
        fireEvent.click(button)

        const bracket = screen.getByTestId("bracket")

        expect(bracket).toHaveTextContent("Player 1")
    });
    it('should navigate to the start page when pushing next round', async () => {

        localStorage.setItem("tournamentMatchId", "1");
        localStorage.setItem("tornooiId", "1");

        page()

        const button = screen.getByRole("button", {name:  /Volgende Ronde/i })

        expect(button).toBeInTheDocument()

        fireEvent.click(button)

        await waitFor(() =>  {expect(navigateMock).toHaveBeenCalledWith("/tornooiGamePage")})

    });
    it('should show the winner popup', async () => {

        tornooiContextMock.bracket = [{match: 1, player1: 'Player 1', player2: 'Player 2', winner: 'Player 1'}]
        tornooiContextMock.round = "Finale"
        
        localStorage.setItem("tornooiId", "1");

        page();

        fireEvent.click(screen.getByRole("button", {name: /Volgende Ronde/i}));

        await waitFor( async () => {
            const popup = await screen.findByTestId("popup");
            expect(popup).toBeInTheDocument();
        });
    });

    it('should navigate to the start page when pushing the ok button', async () => {

        tornooiContextMock.bracket = [{match: 1, player1: 'Player 1', player2: 'Player 2', winner: 'Player 1'}]
        tornooiContextMock.round = "Finale"
        localStorage.setItem("tornooiId", "1");

        page()

        const nextRoundButton = await screen.findByRole('button', { name: /Volgende Ronde/i });
        fireEvent.click(nextRoundButton);

        const resetButton = await screen.findByTestId("button");
        expect(resetButton).toBeInTheDocument();

        fireEvent.click(resetButton);

        await waitFor(() => expect(navigateMock).toHaveBeenCalledWith("/tornooiGamePage"));
    });

})
