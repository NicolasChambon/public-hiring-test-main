import { GreenlyDataSource, dataSource } from "../../config/dataSource";
import {
  getTestEmissionFactor,
  seedTestCarbonEmissionFactors,
} from "../seed-dev-data";
import { CarbonEmissionFactor } from "./carbonEmissionFactor.entity";
import { CarbonEmissionFactorsService } from "./carbonEmissionFactors.service";

let flourEmissionFactor = getTestEmissionFactor("flour");
let hamEmissionFactor = getTestEmissionFactor("ham");
let olivedOilEmissionFactor = getTestEmissionFactor("oliveOil");
let carbonEmissionFactorService: CarbonEmissionFactorsService;

beforeAll(async () => {
  await dataSource.initialize();
  carbonEmissionFactorService = new CarbonEmissionFactorsService();
});

beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
  await dataSource
    .getRepository(CarbonEmissionFactor)
    .save(olivedOilEmissionFactor);
});

describe("CarbonEmissionFactors.service", () => {
  it("should retrieve emission Factors", async () => {
    const carbonEmissionFactors = await carbonEmissionFactorService.findAll();
    expect(carbonEmissionFactors).toHaveLength(1);
  });

  describe("save", () => {
    it("should save new emissionFactors", async () => {
      await carbonEmissionFactorService.save([
        hamEmissionFactor,
        flourEmissionFactor,
      ]);
      const retrieveChickenEmissionFactor = await dataSource
        .getRepository(CarbonEmissionFactor)
        .findOne({ where: { name: "flour" } });
      expect(retrieveChickenEmissionFactor?.name).toBe("flour");
    });

    it("should throw when saving a factor with a duplicate (name, unit)", async () => {
      const { name, unit, emissionCO2eInKgPerUnit, source } =
        olivedOilEmissionFactor;
      await expect(
        carbonEmissionFactorService.save([
          {
            name,
            unit,
            emissionCO2eInKgPerUnit,
            source,
          },
        ]),
      ).rejects.toThrow(
        "A carbon emission factor with the same name and unit already exists",
      );
    });
  });

  describe("upsert", () => {
    it("should update emissionCO2eInKgPerUnit for an existing factor", async () => {
      await carbonEmissionFactorService.upsert([
        {
          name: hamEmissionFactor.name,
          unit: hamEmissionFactor.unit,
          emissionCO2eInKgPerUnit: 0.2,
          source: "Updated source",
        },
      ]);

      const updatedHamEmissionFactor = await dataSource
        .getRepository(CarbonEmissionFactor)
        .findOne({ where: { name: "ham", unit: "kg" } });

      expect(updatedHamEmissionFactor?.emissionCO2eInKgPerUnit).toBe(0.2);
    });

    it("should insert a new factor if it does not exist", async () => {
      await carbonEmissionFactorService.upsert([
        {
          name: "newFactor",
          unit: "kg",
          emissionCO2eInKgPerUnit: 0.5,
          source: "New source",
        },
      ]);

      const newFactor = await dataSource
        .getRepository(CarbonEmissionFactor)
        .findOne({ where: { name: "newFactor", unit: "kg" } });

      expect(newFactor?.emissionCO2eInKgPerUnit).toBe(0.5);
    });

    it("should handle a mix of existing and new factors", async () => {
      await carbonEmissionFactorService.upsert([
        {
          name: hamEmissionFactor.name,
          unit: hamEmissionFactor.unit,
          emissionCO2eInKgPerUnit: 0.25,
          source: "Updated source",
        },
        {
          name: "anotherNewFactor",
          unit: "kg",
          emissionCO2eInKgPerUnit: 0.3,
          source: "Another new source",
        },
      ]);

      const updatedHamEmissionFactor = await dataSource
        .getRepository(CarbonEmissionFactor)
        .findOne({ where: { name: "ham", unit: "kg" } });

      const anotherNewFactor = await dataSource
        .getRepository(CarbonEmissionFactor)
        .findOne({ where: { name: "anotherNewFactor", unit: "kg" } });

      expect(updatedHamEmissionFactor?.emissionCO2eInKgPerUnit).toBe(0.25);
      expect(anotherNewFactor?.emissionCO2eInKgPerUnit).toBe(0.3);
    });
  });
});

afterAll(async () => {
  await dataSource.destroy();
});
