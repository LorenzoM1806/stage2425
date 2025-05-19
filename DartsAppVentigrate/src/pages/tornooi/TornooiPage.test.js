import {MemoryRouter, useNavigate} from "react-router-dom";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {TornooiProvider} from "./tornooiContext.jsx";
import {GameProvider} from "../../context/gameContext.jsx";
import {AnalyticProvider} from "../../context/analyticContext.jsx";
import {MantineProvider} from "@mantine/core";
import React from "react";
import '@testing-library/jest-dom';
import TornooiPage from "./tornooiPage.jsx";
import { DatabaseProvider } from "../../context/databaseContext.jsx";
import * as checkoutModule from "../../functionalities/database.js";
import * as Tonrooictx from "../tornooi/tornooiContext.jsx"


jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

jest.mock('../../functionalities/database', () => ({
    fetchGamemode: jest.fn(),
    fetchUser: jest.fn(),
    postTournament: jest.fn(),
    postTournamentParticipant: jest.fn()
}));

jest.mock('../../context/databaseContext.jsx', () => ({
    useDatabase: () => ({
        users: [{ id: 1, name: "Player 1" }, { id: 2, name: "Player 2" }],
        setUsers: jest.fn(),
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
        setDatabaseTournament: jest.fn()
    }),
    DatabaseProvider: ({ children }) => children,
}))

jest.mock("../tornooi/tornooiContext.jsx", () => {
    const actual = jest.requireActual("../tornooi/tornooiContext.jsx");
    return {
        ...actual,
        useTornooi: jest.fn(),
    }
});

describe("TornooiPage", () => {
    const navigatMock = jest.fn();

    beforeEach(() => {
        useNavigate.mockReturnValue(navigatMock);
        Tonrooictx.useTornooi.mockReturnValue(tornooiContextMock)
        checkoutModule.fetchUser.mockResolvedValue([{name: 'Guest', email: 'Guest@Guest.be', favoriteGameId: 1}])
        checkoutModule.fetchGamemode.mockResolvedValue([{name: '501'}, {name: '301'}, {name: 'Around the world'}, {name: 'Cut throat'}])
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    const tornooiContextMock = {
        players: ["Jan"],
        setPlayers: jest.fn(),
        setBracket: jest.fn(),
        tornooiModus: 301,
        setRound: jest.fn()
    };

    const page = () => {
        return render(
            <MemoryRouter>
                <DatabaseProvider>
                <TornooiProvider value={tornooiContextMock}>
                    <GameProvider>
                        <AnalyticProvider>
                            <MantineProvider>
                                <TornooiPage />
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

        expect(screen.getByRole("button", {name: /Speler Toevoegen/i}))
    });
    it('should open popup to add a new player', async () => {
        page()

        const addPlayerButton = screen.getByRole("button", {name: /Speler Toevoegen/i})

        fireEvent.click(addPlayerButton)

        const popup = await screen.findByTestId("popup")

        expect(popup).toBeInTheDocument()
    });
    it('should give an error if the list is not the right amount of players', () => {
        page()

        const startButton = screen.getByRole("button", { name: /Start Spel/i });
        fireEvent.click(startButton);

        const listError = screen.getByText("Met deze hoeveelheid spelers kan er geen tornooi worden opgestart. Er moet minstens één van de volgende hoeveelheid spelers aanwezig zijn: 2, 4, 8, 16, of 32.");
        expect(listError).toBeInTheDocument();

    });
    it('should delete a player out of the list when the delete button is pushed', () => {
        page()

        fireEvent.click(screen.getByTestId("trash"));

        expect(tornooiContextMock.setPlayers).toHaveBeenCalledTimes(1);

        const updater = tornooiContextMock.setPlayers.mock.calls[0][0];
        expect(typeof updater).toBe('function');

        const newPlayers = updater(["Jan"]);
        expect(newPlayers).toEqual([]);
    });
    it('should select the correct gamemode when selecting a gamemode', () => {
        page()

        const gameMode = screen.getByPlaceholderText(/Kies het gewenste spel/i);

        fireEvent.change(gameMode, {target: {value: '301'}});

        expect(gameMode.value).toBe('301')
    });
    it('should show an error if no game mode is selected', () => {
        page()

        const startButton = screen.getByRole("button", { name: /Start Spel/i });
        fireEvent.click(startButton);

        const gameModeError = screen.getByText("Selecteer een spelmodus!");
        expect(gameModeError).toBeInTheDocument();
    });
    it('should go to the /tornooiOverview page when the Start Game button is clicked', async () => {
        tornooiContextMock.players = ["Jan", "Jef"]
        localStorage.setItem("tornooiId", "1")

        page()

        const gameModeSelect = screen.getByPlaceholderText(/Kies het gewenste spel/i);
        fireEvent.change(gameModeSelect, { target: { value: "301" } });

        fireEvent.click(screen.getByRole("button", {name: /Start Spel/i}));

        await waitFor(() => {expect(navigatMock).toHaveBeenCalledWith("/tornooiOverview")})
    });
})