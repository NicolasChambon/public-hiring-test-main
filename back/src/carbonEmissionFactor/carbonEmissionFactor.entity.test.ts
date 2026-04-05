import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import { CarbonEmissionFactor } from "./carbonEmissionFactor.entity";

let chickenEmissionFactor: CarbonEmissionFactor;
beforeAll(async () => {
  await dataSource.initialize();
  chickenEmissionFactor = new CarbonEmissionFactor({
    emissionCO2eInKgPerUnit: 2.4,
    unit: "kg",
    name: "chicken",
    source: "Agrybalise",
  });
});
beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
});
describe("CarbonEmissionFactor", () => {
  describe("constructor", () => {
    it("should create an emission factor", () => {
      expect(chickenEmissionFactor.emissionCO2eInKgPerUnit).toBe(2.4);
      expect(chickenEmissionFactor.name).toBe("chicken");
      expect(chickenEmissionFactor.unit).toBe("kg");
      expect(chickenEmissionFactor.source).toBe("Agrybalise");
    });
  });
});

afterAll(async () => {
  await dataSource.destroy();
});
