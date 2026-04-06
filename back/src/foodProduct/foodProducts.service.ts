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
