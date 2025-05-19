import React, { act } from "react";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Routing from './Routing';
import { GameProvider } from "../context/gameContext.jsx";
import { AnalyticProvider } from "../context/analyticContext.jsx";
import { MantineProvider } from "@mantine/core";
import { TornooiProvider } from "../pages/tornooi/tornooiContext.jsx";
import * as checkoutModule from "../functionalities/database.js";
import { DatabaseProvider } from "../context/databaseContext.jsx";

jest.mock("@azure/msal-react", () => ({
    useMsal: () => ({
        instance: {
            getAllAccounts: jest.fn(() => [{username: "testuser@example.com"}]),
        },
        accounts: [{ username: "testuser@example.com" }],
    }),
    useIsAuthenticated: () => true,
}));

jest.mock('../functionalities/database', () => ({
    fetchCheckout: jest.fn(),
    fetchUser: jest.fn(),
    fetchGamemode: jest.fn(),
    fetchThrow: jest.fn(),
    fetchTournamentMatch: jest.fn(),
    fetchMatch: jest.fn()
}));

describe("Routing tests", () => {

    beforeEach(() => {
        act(() => {
            checkoutModule.fetchCheckout.mockResolvedValue([{ score: 100, checkoutPath: 'T20 T20 D20' }]);
            checkoutModule.fetchUser.mockResolvedValue([{name: 'Guest', email: 'Guest@Guest.be', favoriteGameId: 1}])
            checkoutModule.fetchGamemode.mockResolvedValue([{name: '501'}])
            checkoutModule.fetchThrow.mockResolvedValue([{matchId: 1, throw1: 60, throw2: 60, throw3: 60, spelerId: 1, datum: '2025-04-22'}])  
            checkoutModule.fetchTournamentMatch.mockResolvedValue([{tournamentId: 1, matchId: 1, round: 1}])
            checkoutModule.fetchMatch.mockResolvedValue([{player1Id: 1, player2Id: 1, gamemodeId: 1, winnerId: 1, datum: "2025-04-28", finished: true}])
            checkoutModule.fetchTournamentMatch.mockResolvedValue([
                        { id: 1, tournament: { id: 1, winner: null, datum: "2025-01-01T00:00:00Z" }, match: { }, round: "1" }
                      ]);
        })
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it("should render LoginPage at /", () => {
        render(
            <DatabaseProvider>
                <MantineProvider>
                    <MemoryRouter initialEntries={["/"]}>
                        <Routing />
                    </MemoryRouter>
                </MantineProvider>
            </DatabaseProvider>
        );

        // Check for some element inside LoginPage to confirm it rendered
        expect(screen.getByRole("button", { name: /Inloggen met Azure/i })).toBeInTheDocument();
    });

    it("should render HomePage at /home", () => {
        render(
            <DatabaseProvider>
            <MantineProvider>
                <MemoryRouter initialEntries={["/home"]}>
                    <Routing></Routing>
                </MemoryRouter>
            </MantineProvider>
            </DatabaseProvider>
        )

        expect(screen.getByRole("button", { name: /Start/i })).toBeInTheDocument();

    });

    it("should render StartPage at /start", () => {
        render(
            <DatabaseProvider>
            <GameProvider>
                <AnalyticProvider>
                    <MantineProvider>
                        <MemoryRouter initialEntries={["/start"]}>
                        <Routing></Routing>
                        </MemoryRouter>
                    </MantineProvider>
                </AnalyticProvider>
            </GameProvider>
            </DatabaseProvider>
        )

        expect(screen.getByRole("button", { name: /Start/i })).toBeInTheDocument();
    });

    it("should render GamePage at /game", async () => {
        render(
            <DatabaseProvider>
            <GameProvider>
                <AnalyticProvider>
                    <MantineProvider>
                        <MemoryRouter initialEntries={["/game"]}>
                        <Routing></Routing>
                        </MemoryRouter>
                    </MantineProvider>
                </AnalyticProvider>
            </GameProvider>
            </DatabaseProvider>
        )

        await expect(screen.getByRole("button", { name: /OK/i })).toBeInTheDocument()
    });

    it("should render InputThrowX01 page at /input", () => {
        render(
            <DatabaseProvider>
            <GameProvider>
                <AnalyticProvider>
                    <MantineProvider>
                        <MemoryRouter initialEntries={["/input"]}>
                        <Routing></Routing>
                        </MemoryRouter>
                    </MantineProvider>
                </AnalyticProvider>
            </GameProvider>
            </DatabaseProvider>
        )

        expect(screen.getByRole("button", { name: /OK/i })).toBeInTheDocument()
    });

    it("should render ProfilePage at /profile", () => {
        render(
            <DatabaseProvider>
            <GameProvider>
                <AnalyticProvider>
                    <MantineProvider>
                        <MemoryRouter initialEntries={["/profile"]}>
                        <Routing></Routing>
                        </MemoryRouter>
                    </MantineProvider>
                </AnalyticProvider>
            </GameProvider>
            </DatabaseProvider>
        )

        expect(screen.getByText(/Naam:/i)).toBeInTheDocument()
    });

    it("should render LoginPage at /login", () => {
        render(
            <DatabaseProvider>
            <GameProvider>
                <AnalyticProvider>
                    <MantineProvider>
                        <MemoryRouter initialEntries={["/login"]}>
                        <Routing></Routing>
                        </MemoryRouter>
                    </MantineProvider>
                </AnalyticProvider>
            </GameProvider>
            </DatabaseProvider>
        )

        expect(screen.getByRole("button", { name: /Inloggen met Azure/i })).toBeInTheDocument()
    })

    it("should render CutThroatPage at /cutThroat", () => {
        render(
            <DatabaseProvider>
            <GameProvider>
                <AnalyticProvider>
                    <MantineProvider>
                        <MemoryRouter initialEntries={["/cutThroat"]}>
                        <Routing></Routing>
                        </MemoryRouter>
                    </MantineProvider>
                </AnalyticProvider>
            </GameProvider>
            </DatabaseProvider>
        )

        expect(screen.getByRole("button", { name: /Volgende Speler/i })).toBeInTheDocument()
    })
    it("should render AroundWorldPage at /aroundWorld", () => {
        render(
            <DatabaseProvider>
            <GameProvider>
                <AnalyticProvider>
                    <MantineProvider>
                        <MemoryRouter initialEntries={["/aroundWorld"]}>
                        <Routing></Routing>
                        </MemoryRouter>
                    </MantineProvider>
                </AnalyticProvider>
            </GameProvider>
            </DatabaseProvider>
        )

        expect(screen.getByRole("button", { name: /Volgende Nummer/i })).toBeInTheDocument()
    })
    it("should render TornooiPage at /tornooi", () => {
        render(
            <DatabaseProvider>
            <TornooiProvider>
                <GameProvider>
                    <AnalyticProvider>
                        <MantineProvider>
                            <MemoryRouter initialEntries={["/tornooi"]}>
                            <Routing></Routing>
                            </MemoryRouter>
                        </MantineProvider>
                    </AnalyticProvider>
                </GameProvider>
            </TornooiProvider>
            </DatabaseProvider>
        )

        expect(screen.getByRole("button", { name: /Speler Toevoegen/i })).toBeInTheDocument()
    })
    it("should render TornooiOverviewPage at /tornooiOverview", () => {
        render(
            <DatabaseProvider>
            <TornooiProvider>
                <GameProvider>
                    <AnalyticProvider>
                        <MantineProvider>
                            <MemoryRouter initialEntries={["/tornooiOverview"]}>
                            <Routing></Routing>
                            </MemoryRouter>
                        </MantineProvider>
                    </AnalyticProvider>
                </GameProvider>
            </TornooiProvider>
            </DatabaseProvider>
        )

        expect(screen.getByRole("button", { name: /Volgende Ronde/i })).toBeInTheDocument()
    })
    it("should render TornooiGamePage at /tornooiGamePage", async () => {
        render(
            <DatabaseProvider>
            <TornooiProvider>
                <GameProvider>
                    <AnalyticProvider>
                        <MantineProvider>
                            <MemoryRouter initialEntries={["/tornooiGamePage"]}>
                            <Routing></Routing>
                            </MemoryRouter>
                        </MantineProvider>
                    </AnalyticProvider>
                </GameProvider>
            </TornooiProvider>
            </DatabaseProvider>
        )

        await expect(screen.getByRole("button", { name: /Ok/i })).toBeInTheDocument()
    })
});
