import {calculateDoublePercent} from "./calculateDoublePercent.js";

describe("CalculateDoublePercent", () => {

    it("should return 0 if doubles are 0", () => {
        expect(calculateDoublePercent(0)).toBe(0)
    })

    it("should return double%", () => {
        expect(calculateDoublePercent(4)).toBe("25.00")
    })
})