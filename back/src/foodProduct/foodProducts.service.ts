import { dataSource } from "../../config/dataSource";
import { CreateFoodProductDto } from "./dto/create-foodProduct.dto";
import { FoodProduct } from "./foodProduct.entity";
import { computeCarbonFootprint } from "./foodProduct.utils";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import {
  ConflictError,
  isUniqueConstraintViolation,
  NotFoundError,
} from "../lib/errors";
import { Ingredient } from "./foodProduct.types";

export class FoodProductsService {
  async findAll(): Promise<FoodProduct[]> {
    return dataSource.getRepository(FoodProduct).find({
      order: {
        id: "ASC",
      },
    });
  }

  async findById(id: number): Promise<FoodProduct> {
    const foodProduct = await dataSource
      .getRepository(FoodProduct)
      .findOneBy({ id });

    if (!foodProduct) {
      throw new NotFoundError(`Food product with id ${id} not found.`);
    }

    return foodProduct;
  }

  async create(foodProductData: CreateFoodProductDto): Promise<FoodProduct> {
    const { totalCarbonFootprint, ingredientsWithCarbonFootprint } =
      await this.fetchAndComputeCarbonFootprint(foodProductData.ingredients);

    const foodProduct = new FoodProduct({
      name: foodProductData.name,
      ingredients: ingredientsWithCarbonFootprint,
      carbonFootprintInKgCO2e: totalCarbonFootprint,
    });

    try {
      return await dataSource.getRepository(FoodProduct).save(foodProduct);
    } catch (error) {
      throw isUniqueConstraintViolation(error)
        ? new ConflictError(
            `A food product with the name "${foodProductData.name}" already exists.`,
          )
        : error;
    }
  }

  async recomputeCarbonFootprint(id: number): Promise<FoodProduct> {
    const foodProduct = await this.findById(id);

    const { totalCarbonFootprint, ingredientsWithCarbonFootprint } =
      await this.fetchAndComputeCarbonFootprint(foodProduct.ingredients);

    foodProduct.ingredients = ingredientsWithCarbonFootprint;
    foodProduct.carbonFootprintInKgCO2e = totalCarbonFootprint;

    return await dataSource.getRepository(FoodProduct).save(foodProduct);
  }

  private async fetchAndComputeCarbonFootprint(ingredients: Ingredient[]) {
    const emissionFactors = await dataSource
      .getRepository(CarbonEmissionFactor)
      .find({
        where: ingredients.map((ingredient) => ({
          name: ingredient.name,
          unit: ingredient.unit,
        })),
      });

    return computeCarbonFootprint(ingredients, emissionFactors);
  }
}
