import { Express } from "express";
import request from "supertest";
import { dataSource } from "../config/dataSource";
import { initializeApp } from "../src/app";
import { CarbonEmissionFactor } from "../src/carbonEmissionFactor/carbonEmissionFactor.entity";
import { seedTestCarbonEmissionFactors } from "../src/seed-dev-data";
import { FoodProduct } from "../src/foodProduct/foodProduct.entity";

beforeAll(async () => {
  await dataSource.initialize();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("FoodProductsController", () => {
  let app: Express;

  beforeEach(async () => {
    // Initialize the Express app with TSOA routes
    app = await initializeApp();

    // Clear existing data and add test data
    await dataSource.getRepository(FoodProduct).clear();
    await dataSource.getRepository(CarbonEmissionFactor).clear();

    await seedTestCarbonEmissionFactors();
  });

  describe("POST /food-products", () => {
    it("should create a food product with its computed carbon footprints", async () => {
      return request(app)
        .post("/food-products")
        .send({
          name: "Test Food Product",
          ingredients: [
            { name: "ham", unit: "kg", quantity: 0.5 },
            { name: "beef", unit: "kg", quantity: 0.2 },
          ],
        })
        .expect(201)
        .expect(({ body }) => {
          expect(body.id).toBeDefined();
          expect(body.name).toBe("Test Food Product");
          expect(body.carbonFootprintInKgCO2e).toBe(0.5 * 0.1 + 0.2 * 14);
          expect(body.ingredients).toEqual([
            {
              name: "ham",
              unit: "kg",
              quantity: 0.5,
              carbonFootprint: 0.5 * 0.1,
            },
            {
              name: "beef",
              unit: "kg",
              quantity: 0.2,
              carbonFootprint: 0.2 * 14,
            },
          ]);
        });
    });

    it("should persist null total footprint when an ingredient has no matching factor", async () => {
      return request(app)
        .post("/food-products")
        .send({
          name: "unknown ingredient product",
          ingredients: [
            { name: "unknownIngredient", unit: "kg", quantity: 1 },
            { name: "ham", unit: "kg", quantity: 0.5 },
          ],
        })
        .expect(201)
        .expect(({ body }) => {
          expect(body.id).toBeDefined();
          expect(body.name).toBe("unknown ingredient product");
          expect(body.carbonFootprintInKgCO2e).toBeNull();
          expect(body.ingredients).toEqual([
            {
              name: "unknownIngredient",
              unit: "kg",
              quantity: 1,
              carbonFootprint: null,
            },
            { name: "ham", unit: "kg", quantity: 0.5, carbonFootprint: 0.05 }, // 0.5 * 0.1
          ]);
        });
    });

    it("should return 422 when a required field is missing", async () => {
      return request(app)
        .post("/food-products")
        .send({ ingredients: [{ name: "ham", unit: "kg", quantity: 0.5 }] })
        .expect(422)
        .expect(({ body }) => {
          expect(body.message).toBe("Validation failed");
          expect(body.details).toEqual({
            "foodProductData.name": { message: "'name' is required" },
          });
        });
    });

    it("should return 422 when ingredients array is empty", async () => {
      return request(app)
        .post("/food-products")
        .send({ name: "Empty Ingredients Product", ingredients: [] })
        .expect(422)
        .expect(({ body }) => {
          expect(body.message).toBe("Validation failed");
          expect(body.details).toEqual([
            {
              field: "ingredients",
              constraints: {
                arrayMinSize: "ingredients must contain at least 1 elements",
              },
            },
          ]);
        });
    });

    it("should return 409 when a food product with the same name already exists", async () => {
      await request(app)
        .post("/food-products")
        .send({
          name: "Duplicate Product",
          ingredients: [{ name: "ham", unit: "kg", quantity: 0.5 }],
        })
        .expect(201);

      return request(app)
        .post("/food-products")
        .send({
          name: "Duplicate Product",
          ingredients: [{ name: "cheese", unit: "kg", quantity: 0.3 }],
        })
        .expect(409)
        .expect(({ body }) => {
          expect(body.message).toBe(
            'A food product with the name "Duplicate Product" already exists.',
          );
        });
    });
  });

  describe("GET /food-products", () => {
    it("should retrieve all food products", async () => {
      await request(app)
        .post("/food-products")
        .send({
          name: "Product 1",
          ingredients: [{ name: "ham", unit: "kg", quantity: 0.5 }],
        });

      await request(app)
        .post("/food-products")
        .send({
          name: "Product 2",
          ingredients: [{ name: "beef", unit: "kg", quantity: 0.2 }],
        });

      return request(app)
        .get("/food-products")
        .expect(200)
        .expect(({ body }) => {
          expect(body.length).toBe(2);
        });
    });
  });

  describe("GET /food-products/{id}", () => {
    it("should retrieve a food product by id", async () => {
      const createResponse = await request(app)
        .post("/food-products")
        .send({
          name: "Product By ID",
          ingredients: [{ name: "ham", unit: "kg", quantity: 0.5 }],
        })
        .expect(201);

      const productId = createResponse.body.id;

      return request(app)
        .get(`/food-products/${productId}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body.id).toBe(productId);
          expect(body.name).toBe("Product By ID");
        });
    });

    it("should return 404 when food product is not found", async () => {
      return request(app)
        .get("/food-products/9999")
        .expect(404)
        .expect(({ body }) => {
          expect(body.message).toBe("Food product with id 9999 not found.");
        });
    });
  });
});
