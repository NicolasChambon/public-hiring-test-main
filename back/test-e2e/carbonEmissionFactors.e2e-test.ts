import { Express } from "express";
import request from "supertest";
import { dataSource } from "../config/dataSource";
import { initializeApp } from "../src/app";
import { CarbonEmissionFactor } from "../src/carbonEmissionFactor/carbonEmissionFactor.entity";
import { getTestEmissionFactor } from "../src/seed-dev-data";

beforeAll(async () => {
  await dataSource.initialize();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("CarbonEmissionFactorsController", () => {
  let app: Express;
  let defaultCarbonEmissionFactors: CarbonEmissionFactor[];

  beforeEach(async () => {
    // Initialize the Express app with TSOA routes
    app = await initializeApp();

    // Clear existing data and add test data
    await dataSource.getRepository(CarbonEmissionFactor).clear();

    await dataSource
      .getRepository(CarbonEmissionFactor)
      .save([getTestEmissionFactor("ham"), getTestEmissionFactor("beef")]);

    defaultCarbonEmissionFactors = await dataSource
      .getRepository(CarbonEmissionFactor)
      .find();
  });

  describe("GET /carbon-emission-factors", () => {
    it("should retrieve all carbon emission factors", async () => {
      return request(app)
        .get("/carbon-emission-factors")
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual(defaultCarbonEmissionFactors);
        });
    });
  });

  describe("POST /carbon-emission-factors", () => {
    it("should create new carbon emission factors", async () => {
      const carbonEmissionFactorArgs = {
        name: "Test Carbon Emission Factor",
        unit: "kg",
        emissionCO2eInKgPerUnit: 12,
        source: "Test Source",
      };
      return request(app)
        .post("/carbon-emission-factors")
        .send([carbonEmissionFactorArgs])
        .expect(200) // Express/TSOA typically returns 200 for POST, not 201
        .expect(({ body }) => {
          expect(body.length).toEqual(1);
          expect(body[0]).toMatchObject(carbonEmissionFactorArgs);
        });
    });

    it("should return 422 for a missing required field", async () => {
      const invalidCarbonEmissionFactorArgs = {
        name: "Invalid Carbon Emission Factor",
        unit: "kg",
        emissionCO2eInKgPerUnit: 12,
        // source is missing
      };
      return request(app)
        .post("/carbon-emission-factors")
        .send([invalidCarbonEmissionFactorArgs])
        .expect(422)
        .expect(({ body }) => {
          expect(body.message).toContain("Validation failed");
        });
    });

    it("should return 422 for an invalid field type", async () => {
      const invalidCarbonEmissionFactorArgs = {
        name: "Invalid Carbon Emission Factor",
        unit: "kg",
        emissionCO2eInKgPerUnit: "not a number", // Invalid type
        source: "Test Source",
      };
      return request(app)
        .post("/carbon-emission-factors")
        .send([invalidCarbonEmissionFactorArgs])
        .expect(422)
        .expect(({ body }) => {
          expect(body.message).toContain("Validation failed");
        });
    });
  });
});
