import { Body, Controller, Get, Patch, Path, Post, Route } from "tsoa";
import { FoodProductsService } from "./foodProducts.service";
import { FoodProduct } from "./foodProduct.entity";
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
    return await this.foodProductsService.findById(id);
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

  @Patch("{id}/recompute-carbon-footprint")
  public async recomputeCarbonFootprint(
    @Path() id: number,
  ): Promise<FoodProduct> {
    const updatedFoodProduct =
      await this.foodProductsService.recomputeCarbonFootprint(id);

    console.log(
      `[food-products] [PATCH] FoodProduct: recomputed carbon footprint for food product with id ${id}`,
    );

    return updatedFoodProduct;
  }
}
