import React from "react"
import '@testing-library/jest-dom';
import {MemoryRouter, useNavigate} from "react-router-dom";
import {fireEvent, render, screen} from "@testing-library/react";
import {GameProvider} from "../../context/gameContext.jsx";
import {AnalyticProvider} from "../../context/analyticContext.jsx";
import {MantineProvider} from "@mantine/core";
import {TornooiProvider} from "./tornooiContext.jsx";
import InputThrowTornooi from "./inputThrowTornooi.jsx";
import { DatabaseProvider } from "../../context/databaseContext.jsx";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

describe("InputThrowTornooi", () => {
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
                <TornooiProvider>
                    <GameProvider>
                        <AnalyticProvider>
                            <MantineProvider>
                                <InputThrowTornooi />
                            </MantineProvider>
                        </AnalyticProvider>
                    </GameProvider>
                </TornooiProvider>
                </DatabaseProvider>
            </MemoryRouter>
        );
    };

    it('should show the page correctly', () => {
        page()

        expect(screen.getByRole("button", {name: /20/i})).toBeInTheDocument()
    });
    it('should show error when throwing more then 3 darts', () => {
        page()

        fireEvent.click(screen.getByRole("button", {name: /20/i}))
        fireEvent.click(screen.getByRole("button", {name: /20/i}))
        fireEvent.click(screen.getByRole("button", {name: /20/i}))
        fireEvent.click(screen.getByRole("button", {name: /20/i}))

        const error = screen.getByText("Je kan niet meer dan 3 darts gooien!!!!");
        expect(error).toBeInTheDocument();
    });
    it('should fill the label when a number is pushed', () => {
        page()

        fireEvent.click(screen.getByRole("button", {name: /20/i}))

        const label = screen.getByTestId("label1")

        expect(label).toHaveTextContent("20");
    });
    it('should change the choice when changing to double', () => {
        page()

        fireEvent.click(screen.getByRole("button", {name: /Double/i}))

        const style = screen.getByTestId("Double")

        expect(style).toHaveStyle("background: #4caf50")
    });
})