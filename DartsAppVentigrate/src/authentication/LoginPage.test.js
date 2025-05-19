import React, { act } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import LoginPage from "./loginPage.jsx";
import { MantineProvider } from "@mantine/core";

// Place mocks at the top so they're used when the component is imported
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

jest.mock("@azure/msal-react", () => ({
    useMsal: () => ({
        instance: {
            loginPopup: jest.fn().mockResolvedValue({}),
            getAllAccounts: jest.fn(() => [{username: "testuser@example.com"}]),
            setActiveAccount: jest.fn()
        },
        accounts: [{ username: "testuser@example.com" }],
    }),
}));

describe("LoginPage", () => {
    const navigateMock = jest.fn();

    beforeEach(() => {
        useNavigate.mockReturnValue(navigateMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render correctly", () => {
        render(
            <MemoryRouter>
                <MantineProvider>
                    <LoginPage />
                </MantineProvider>
            </MemoryRouter>
        );
    });

    it("should open the login window?", async () => {
        render(
            <MemoryRouter>
                <MantineProvider>
                    <LoginPage />
                </MantineProvider>
            </MemoryRouter>
        );

        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /Inloggen met Azure/i }));
        })

        await waitFor(() => {
            expect(navigateMock).toHaveBeenCalledTimes(1);
            expect(navigateMock).toHaveBeenCalledWith("/home");
        });
    });
});
