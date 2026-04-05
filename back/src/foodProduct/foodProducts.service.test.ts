import { dataSource, GreenlyDataSource } from "../../config/dataSource";
import { FoodProductsService } from "./foodProducts.service";
import { seedTestCarbonEmissionFactors } from "../seed-dev-data";

let foodProductsService: FoodProductsService;

beforeAll(async () => {
  await dataSource.initialize();
  foodProductsService = new FoodProductsService();
});

beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
  await seedTestCarbonEmissionFactors();
});

describe("FoodProducts.service", () => {
  describe("create", () => {
    it("should persist a food product with its computed carbon footprint", async () => {
      const foodProduct = await foodProductsService.create({
        name: "hamCheesePizza",
        ingredients: [
          { name: "ham", unit: "kg", quantity: 2 },
          { name: "cheese", unit: "kg", quantity: 1 },
        ],
      });

      expect(foodProduct.id).toBeDefined();
      expect(foodProduct.carbonFootprintInKgCO2e).toBe(0.4); // (2 * 0.1) + (1 * 0.2) = 0.4
    });

    it("should persist null foodprint when an ingredient has no matching factor", async () => {
      const foodProduct = await foodProductsService.create({
        name: "unknownUnitPizza",
        ingredients: [
          { name: "ham", unit: "g", quantity: 2000 }, // ham has no matching factor for unit "g"
          { name: "cheese", unit: "kg", quantity: 1 },
        ],
      });

      expect(foodProduct.id).toBeDefined();
      expect(foodProduct.carbonFootprintInKgCO2e).toBeNull();
    });

    it("should throw when trying to create a food product with duplicate name", async () => {
      await foodProductsService.create({
        name: "hamCheesePizza",
        ingredients: [
          { name: "ham", unit: "kg", quantity: 2 },
          { name: "cheese", unit: "kg", quantity: 1 },
        ],
      });

      await expect(
        foodProductsService.create({
          name: "hamCheesePizza",
          ingredients: [
            { name: "ham", unit: "kg", quantity: 2 },
            { name: "cheese", unit: "kg", quantity: 1 },
          ],
        }),
      ).rejects.toThrow(
        'A food product with the name "hamCheesePizza" already exists.',
      );
    });
  });
});

afterAll(async () => {
  await dataSource.destroy();
});
