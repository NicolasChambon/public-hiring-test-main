import { getTestEmissionFactor } from "../seed-dev-data";
import { computeCarbonFootprint } from "./foodProduct.utils";

const ham = getTestEmissionFactor("ham"); // 0.1 kgCO2e/kg
const cheese = getTestEmissionFactor("cheese"); // 0.2 kgCO2e/kg

describe("computeCarbonFootprint", () => {
  it("should compute correctly when all factors are found", () => {
    const result = computeCarbonFootprint(
      [
        { name: "ham", unit: "kg", quantity: 2 },
        { name: "cheese", unit: "kg", quantity: 1 },
      ],
      [ham, cheese],
    );
    expect(result).toBe(0.4); // (2 * 0.1) + (1 * 0.2) = 0.4
  });

  it("should return null if one ingredient has no matching factor", () => {
    expect(
      computeCarbonFootprint(
        [
          { name: "ham", unit: "g", quantity: 2 }, // ham has no matching factor for unit "g"
          { name: "cheese", unit: "kg", quantity: 1 },
        ],
        [ham, cheese],
      ),
    ).toBeNull();
  });
});
