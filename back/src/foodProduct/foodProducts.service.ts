import { dataSource } from "../../config/dataSource";
import { CreateFoodProductDto } from "./dto/create-foodProduct.dto";
import { FoodProduct } from "./foodProduct.entity";
import { computeCarbonFootprint } from "./foodProduct.utils";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { ConflictError, isUniqueConstraintViolation } from "../lib/errors";

export class FoodProductsService {
  async create(foodProductData: CreateFoodProductDto): Promise<FoodProduct> {
    const emissionFactors = await dataSource
      .getRepository(CarbonEmissionFactor)
      .find({
        where: foodProductData.ingredients.map((ingredient) => ({
          name: ingredient.name,
          unit: ingredient.unit,
        })),
      });

    const foodProduct = new FoodProduct({
      name: foodProductData.name,
      ingredients: foodProductData.ingredients,
      carbonFootprintInKgCO2e: computeCarbonFootprint(
        foodProductData.ingredients,
        emissionFactors,
      ),
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
}
