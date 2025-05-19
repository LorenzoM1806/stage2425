import React, { act } from "react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { GameProvider } from "../context/gameContext.jsx";
import { AnalyticProvider } from "../context/analyticContext.jsx";
import { MantineProvider } from "@mantine/core";
import InputThrowX01 from "./inputThrowX01.jsx";
import { DatabaseProvider } from "../context/databaseContext.jsx";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

describe("InputThrowX01", () => {
    const navigateMock = jest.fn();

    beforeEach(() => {
        // Reset mocks before each test
        useNavigate.mockReturnValue(navigateMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const page = () => {
        return render(
            <MemoryRouter>
                <DatabaseProvider>
                <GameProvider>
                    <AnalyticProvider>
                        <MantineProvider>
                            <InputThrowX01 />
                        </MantineProvider>
                    </AnalyticProvider>
                </GameProvider>
                </DatabaseProvider>
            </MemoryRouter>
        );
    };

    it('should show correctly', () => {
        page()

        expect(screen.getByRole("button", { name: /20/i })).toBeInTheDocument()
    });
    it('should cancel the game', () => {
        page()

        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /Annuleer het Spel/i }));
        })

        expect(navigateMock).toHaveBeenCalledTimes(1);
        expect(navigateMock).toHaveBeenCalledWith("/start");
    });
    it('should show error when throwing more then 3 darts', () => {
        page()

        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /20/i }))
        })
        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /20/i }))
        })
        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /20/i }))
        })
        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /20/i }))
        })

        const error = screen.getByText("Je kan niet meer dan 3 darts gooien!!!!");
        expect(error).toBeInTheDocument();

    });
    it('should fill the label when number is pushed', () => {
        page()

        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /20/i }))
        })

        const label = screen.getByTestId("label1")

        expect(label).toHaveTextContent("20");
    });
    it('should change the choice when changing to double', () => {
        page()

        act(() => {
            fireEvent.click(screen.getByRole("button", { name: /Double/i }))
        })

        const style = screen.getByTestId("Double")

        expect(style).toHaveStyle("background: #4caf50")
    });
})