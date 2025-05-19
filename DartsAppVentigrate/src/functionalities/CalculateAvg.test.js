import {calculateAvg} from "./calculateAvg.js";

describe("CalculateAvg", () => {

    it("returns 0 when score == gamemode", () => {
        expect(calculateAvg(501, 501, 0)).toBe(0)
    })

    it("returns AVG", () => {
        expect(calculateAvg(100, 501, 12)).toBe("100.25")
    })
})