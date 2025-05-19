import {checkWin} from "./tornooi.js";

describe("Tornooi", () => {
    it('should return false if round = Finale && sets != 2', () => {
        expect(checkWin(1, "Finale", 2)).toBe(false);
    });
    it('should return true if round = Finale && sets = 2', () => {
        expect(checkWin(4, "Finale", 2)).toBe(true);
    });
    it('should return false if round != Finale && sets != 1', () => {
        expect(checkWin(0, "1", 2)).toBe(false);
    });
    it('should return true if round != Finale && sets = 1', () => {
        expect(checkWin(1, "1", 1)).toBe(true);
    });
})