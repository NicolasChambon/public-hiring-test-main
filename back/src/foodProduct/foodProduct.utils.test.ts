import { getTestEmissionFactor } from "../seed-dev-data";
import { computeCarbonFootprint } from "./foodProduct.utils";

const ham = getTestEmissionFactor("ham"); // 0.1 kgCO2e/kg
const cheese = getTestEmissionFactor("cheese"); // 0.2 kgCO2e/kg

describe("computeCarbonFootprint", () => {
  it("should compute total footprint and ingredient footprints correctly when all factors are available", () => {
    const result = computeCarbonFootprint(
      [
        { name: "ham", unit: "kg", quantity: 2 },
        { name: "cheese", unit: "kg", quantity: 1 },
      ],
      [ham, cheese],
    );
    expect(result.totalCarbonFootprint).toBe(0.4); // (2 * 0.1) + (1 * 0.2) = 0.4
    expect(result.ingredientsWithCarbonFootprint).toEqual([
      { name: "ham", unit: "kg", quantity: 2, carbonFootprint: 0.2 },
      { name: "cheese", unit: "kg", quantity: 1, carbonFootprint: 0.2 },
    ]);
  });

  it("should return null as total footprint but still compute ingredient footprints when some factors are missing", () => {
    const result = computeCarbonFootprint(
      [
        { name: "ham", unit: "g", quantity: 2 }, // ham has no matching factor for unit "g"
        { name: "cheese", unit: "kg", quantity: 1 },
      ],
      [ham, cheese],
    );
    expect(result.totalCarbonFootprint).toBeNull();
    expect(result.ingredientsWithCarbonFootprint).toEqual([
      { name: "ham", unit: "g", quantity: 2, carbonFootprint: null },
      { name: "cheese", unit: "kg", quantity: 1, carbonFootprint: 0.2 },
    ]);
  });
});
