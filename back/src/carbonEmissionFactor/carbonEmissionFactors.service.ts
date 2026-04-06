import { dataSource } from "../../config/dataSource";
import { CarbonEmissionFactor } from "./carbonEmissionFactor.entity";
import { CreateCarbonEmissionFactorDto } from "./dto/create-carbonEmissionFactor.dto";
import { ConflictError, isUniqueConstraintViolation } from "../lib/errors";

export class CarbonEmissionFactorsService {
  async findAll(): Promise<CarbonEmissionFactor[]> {
    const repository = dataSource.getRepository(CarbonEmissionFactor);
    return repository.find({
      order: {
        id: "ASC",
      },
    });
  }

  async save(
    carbonEmissionFactor: CreateCarbonEmissionFactorDto[],
  ): Promise<CarbonEmissionFactor[]> {
    try {
      const repository = dataSource.getRepository(CarbonEmissionFactor);
      return await repository.save(carbonEmissionFactor);
    } catch (error) {
      throw isUniqueConstraintViolation(error)
        ? new ConflictError(
            "A carbon emission factor with the same name and unit already exists.",
          )
        : error;
    }
  }

  async upsert(
    factors: CreateCarbonEmissionFactorDto[],
  ): Promise<CarbonEmissionFactor[]> {
    const repository = dataSource.getRepository(CarbonEmissionFactor);

    await repository.upsert(factors, {
      conflictPaths: ["name", "unit"],
      skipUpdateIfNoValuesChanged: true,
    });

    return repository.find({
      where: factors.map((factor) => ({
        name: factor.name,
        unit: factor.unit,
      })),
    });
  }
}
