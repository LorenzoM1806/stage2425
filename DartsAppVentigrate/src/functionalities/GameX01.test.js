import { calculateNewScore } from "./gameX01.js";

describe("GameX01", () => {
    it('thrown score greater than current score', () => {
        expect(calculateNewScore(100, 101, false)).toBe(100);
    })

    it('current score minus thrown score equals 1', () => {
        expect(calculateNewScore(100, 99, false)).toBe(100);
    })

    it('current score minus thrown score equals 0 with valid double', () => {
        expect(calculateNewScore(100, 100, true)).toBe(0);
    })

    it('current score minus thrown score equals 0 without valid double', () => {
        expect(calculateNewScore(100, 100, false)).toBe(100);
    })

    it('normal score deduction', () => {
        expect(calculateNewScore(100, 50, false)).toBe(50);
    })
})