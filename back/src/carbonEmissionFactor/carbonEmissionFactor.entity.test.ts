import { CarbonEmissionFactor } from "./carbonEmissionFactor.entity";

let chickenEmissionFactor: CarbonEmissionFactor;

beforeAll(async () => {
  chickenEmissionFactor = new CarbonEmissionFactor({
    emissionCO2eInKgPerUnit: 2.4,
    unit: "kg",
    name: "chicken",
    source: "Agrybalise",
  });
});

describe("CarbonEmissionFactorEntity constructor", () => {
  it("should create an emission factor", () => {
    expect(chickenEmissionFactor.emissionCO2eInKgPerUnit).toBe(2.4);
    expect(chickenEmissionFactor.name).toBe("chicken");
    expect(chickenEmissionFactor.unit).toBe("kg");
    expect(chickenEmissionFactor.source).toBe("Agrybalise");
  });
});
