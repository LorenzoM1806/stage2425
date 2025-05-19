// eslint-disable-next-line no-unused-vars
import React, { act } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import HomePage from "./homePage";
import { MantineProvider } from "@mantine/core";
import { DatabaseProvider } from "../context/databaseContext";
import * as checkoutModule from "../functionalities/database.js";

// Move jest.mock outside of describe
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));
jest.mock('../functionalities/database', () => ({
    fetchGamemode: jest.fn(),
    fetchUser: jest.fn(),
    fetchCheckout: jest.fn(),
    fetchThrow: jest.fn(),
    fetchTournamentMatch: jest.fn(),
    fetchMatch: jest.fn()
}));

jest.mock('../context/databaseContext.jsx', () => ({
    useDatabase: () => ({
        setUsers: jest.fn(),
        setGamemodes: jest.fn(),
        setCheckouts: jest.fn(),
        setThrows: jest.fn(),
        setTournamentMatches: jest.fn(),
        setMatch: jest.fn()
    }),
    DatabaseProvider: ({ children }) => children,
}))

describe("HomePage", () => {
    const navigateMock = jest.fn();

    beforeEach(() => {
        // Reset mocks before each test
        useNavigate.mockReturnValue(navigateMock);
        checkoutModule.fetchUser.mockResolvedValue([{name: 'Guest', email: 'Guest@Guest.be', favoriteGameId: 1}])
        checkoutModule.fetchGamemode.mockResolvedValue([{name: '501'}, {name: '301'}, {name: 'Around the world'}, {name: 'Cut throat'}])
        checkoutModule.fetchCheckout.mockResolvedValue([{ score: 100, checkoutPath: 'T20 T20 D20' }]);
        checkoutModule.fetchThrow.mockResolvedValue([{matchId: 1, throw1: 60, throw2: 60, throw3: 60, spelerId: 1, datum: "2025-04-22"}])
        checkoutModule.fetchTournamentMatch.mockResolvedValue([{tournamentId: 1, matchId: 1, round: 1}])
        checkoutModule.fetchMatch.mockResolvedValue([{player1Id: 1, player2Id: 1, gamemodeId: 1, winnerId: 1, datum: "2025-04-28", finished: true}])
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("showns up correctly", () => {
        render(
            <DatabaseProvider>
            <MantineProvider>
                <MemoryRouter>
                    <HomePage />
                </MemoryRouter>
            </MantineProvider>
            </DatabaseProvider>
        );
    });

    it("navigates to start page when button is clicked", () => {
        render(
            <DatabaseProvider>
            <MantineProvider>
                <MemoryRouter>
                    <HomePage />
                </MemoryRouter>
            </MantineProvider>
            </DatabaseProvider>
        );

        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /Start/i }));
        })

        expect(navigateMock).toHaveBeenCalledTimes(1);
        expect(navigateMock).toHaveBeenCalledWith("/start");
    });

    it("navigates to tornooi page when button is clicked", () => {
        render(
            <DatabaseProvider>
            <MantineProvider>
                <MemoryRouter>
                    <HomePage />
                </MemoryRouter>
            </MantineProvider>
            </DatabaseProvider>
        );

        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /Tornooi/i }));
        })

        expect(navigateMock).toHaveBeenCalledTimes(1);
        expect(navigateMock).toHaveBeenCalledWith("/tornooi");
    })

    it("navigates to profile page when button is clicked", () => {
        render(
            <DatabaseProvider>
            <MantineProvider>
                <MemoryRouter>
                    <HomePage />
                </MemoryRouter>
            </MantineProvider>
            </DatabaseProvider>
        );

        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /Profiel/i }));
        })

        expect(navigateMock).toHaveBeenCalledTimes(1);
        expect(navigateMock).toHaveBeenCalledWith("/profile");
    })
});
