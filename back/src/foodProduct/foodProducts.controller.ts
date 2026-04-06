import { Body, Controller, Get, Path, Post, Route } from "tsoa";
import { FoodProductsService } from "./foodProducts.service";
import { FoodProduct } from "./foodProduct.entity";
import { NotFoundError } from "../lib/errors";
import { CreateFoodProductDto } from "./dto/create-foodProduct.dto";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";

@Route("food-products")
export class FoodProductsController extends Controller {
  private readonly foodProductsService: FoodProductsService;

  constructor() {
    super();
    this.foodProductsService = new FoodProductsService();
  }

  @Get()
  public async getFoodProducts(): Promise<FoodProduct[]> {
    console.log(`[food-products] [GET] FoodProduct: getting all FoodProducts`);
    return await this.foodProductsService.findAll();
  }

  @Get("{id}")
  public async getFoodProductById(@Path() id: number): Promise<FoodProduct> {
    const foodProduct = await this.foodProductsService.findById(id);

    if (!foodProduct) {
      throw new NotFoundError(`Food product with id ${id} not found.`);
    }

    return foodProduct;
  }

  @Post()
  public async createFoodProduct(
    @Body() foodProductData: CreateFoodProductDto,
  ): Promise<FoodProduct> {
    const validatedProductData = plainToInstance(
      CreateFoodProductDto,
      foodProductData,
    );

    await validateOrReject(validatedProductData);

    const createdFoodProduct =
      await this.foodProductsService.create(validatedProductData);

    console.log(
      `[food-products] [POST] FoodProduct: created food product with id ${createdFoodProduct.id}`,
    );

    this.setStatus(201);
    return createdFoodProduct;
  }
}
