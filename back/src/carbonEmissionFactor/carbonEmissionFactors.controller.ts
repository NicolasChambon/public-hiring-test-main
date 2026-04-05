import { Body, Controller, Get, Patch, Post, Route } from "tsoa";
import { CarbonEmissionFactor } from "./carbonEmissionFactor.entity";
import { CarbonEmissionFactorsService } from "./carbonEmissionFactors.service";
import { CreateCarbonEmissionFactorDto } from "./dto/create-carbonEmissionFactor.dto";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";

@Route("carbon-emission-factors")
export class CarbonEmissionFactorsController extends Controller {
  private readonly carbonEmissionFactorService: CarbonEmissionFactorsService;

  constructor() {
    super();
    this.carbonEmissionFactorService = new CarbonEmissionFactorsService();
  }

  @Get()
  public async getCarbonEmissionFactors(): Promise<CarbonEmissionFactor[]> {
    console.log(
      `[carbon-emission-factors] [GET] CarbonEmissionFactor: getting all CarbonEmissionFactors`,
    );
    return await this.carbonEmissionFactorService.findAll();
  }

  @Post()
  public async createCarbonEmissionFactors(
    @Body() carbonEmissionFactors: CreateCarbonEmissionFactorDto[],
  ): Promise<CarbonEmissionFactor[]> {
    const validatedFactors = plainToInstance(
      CreateCarbonEmissionFactorDto,
      carbonEmissionFactors,
    );

    await Promise.all(
      validatedFactors.map((factor) => validateOrReject(factor)),
    );

    const savedFactors =
      await this.carbonEmissionFactorService.save(validatedFactors);

    console.log(
      `[carbon-emission-factors] [POST] CarbonEmissionFactor: ${carbonEmissionFactors.length} items created`,
    );

    return savedFactors;
  }

  @Patch()
  public async upsertCarbonEmissionFactors(
    @Body() carbonEmissionFactors: CreateCarbonEmissionFactorDto[],
  ): Promise<CarbonEmissionFactor[]> {
    const validatedFactors = plainToInstance(
      CreateCarbonEmissionFactorDto,
      carbonEmissionFactors,
    );

    await Promise.all(
      validatedFactors.map((factor) => validateOrReject(factor)),
    );

    const upsertedFactors =
      await this.carbonEmissionFactorService.upsert(validatedFactors);

    console.log(
      `[carbon-emission-factors] [PATCH] CarbonEmissionFactor: ${carbonEmissionFactors.length} items upserted`,
    );

    return upsertedFactors;
  }
}
