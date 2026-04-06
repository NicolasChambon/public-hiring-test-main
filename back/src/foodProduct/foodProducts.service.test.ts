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
    it("should persist a food product with its total computed carbon footprint and ingredient footprint", async () => {
      const foodProduct = await foodProductsService.create({
        name: "hamCheesePizza",
        ingredients: [
          { name: "ham", unit: "kg", quantity: 2 },
          { name: "cheese", unit: "kg", quantity: 1 },
        ],
      });

      expect(foodProduct.id).toBeDefined();
      expect(foodProduct.carbonFootprintInKgCO2e).toBe(0.4); // (2 * 0.1) + (1 * 0.2) = 0.4
      expect(foodProduct.ingredients).toEqual([
        { name: "ham", unit: "kg", quantity: 2, carbonFootprint: 0.2 },
        { name: "cheese", unit: "kg", quantity: 1, carbonFootprint: 0.2 },
      ]);
    });

    it("should persist null total footprint when an ingredient has no matching factor and null ingredient footprint for that ingredient", async () => {
      const foodProduct = await foodProductsService.create({
        name: "unknownUnitPizza",
        ingredients: [
          { name: "ham", unit: "g", quantity: 2000 }, // ham has no matching factor for unit "g"
          { name: "cheese", unit: "kg", quantity: 1 },
        ],
      });

      expect(foodProduct.id).toBeDefined();
      expect(foodProduct.carbonFootprintInKgCO2e).toBeNull();
      expect(foodProduct.ingredients[0].carbonFootprint).toBeNull();
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

  describe("findAll", () => {
    it("should should return an empty array when no food products exist", async () => {
      const foodProducts = await foodProductsService.findAll();
      expect(foodProducts).toEqual([]);
    });

    it("should return all persisted food products", async () => {
      await foodProductsService.create({
        name: "foodProduct1",
        ingredients: [{ name: "ham", unit: "kg", quantity: 0.2 }],
      });

      await foodProductsService.create({
        name: "foodProduct2",
        ingredients: [{ name: "cheese", unit: "kg", quantity: 0.1 }],
      });

      const foodProducts = await foodProductsService.findAll();
      expect(foodProducts).toHaveLength(2);
      expect(foodProducts[0].name).toBe("foodProduct1");
      expect(foodProducts[1].name).toBe("foodProduct2");
    });
  });

  describe("findById", () => {
    it("should return the food product when it exists", async () => {
      const createdFoodProduct = await foodProductsService.create({
        name: "foodProduct1",
        ingredients: [{ name: "ham", unit: "kg", quantity: 0.2 }],
      });

      const retrievedFoodProduct = await foodProductsService.findById(
        createdFoodProduct.id,
      );

      expect(retrievedFoodProduct).not.toBeNull();
      expect(retrievedFoodProduct!.name).toBe("foodProduct1");
    });
  });
});

afterAll(async () => {
  await dataSource.destroy();
});
