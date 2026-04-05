import { QueryFailedError } from "typeorm";
import { dataSource } from "../../config/dataSource";
import { CarbonEmissionFactor } from "./carbonEmissionFactor.entity";
import { CreateCarbonEmissionFactorDto } from "./dto/create-carbonEmissionFactor.dto";
import { ConflictError, PG_UNIQUE_CONSTRAINT_VIOLATION } from "../lib/errors";

export class CarbonEmissionFactorsService {
  async findAll(): Promise<CarbonEmissionFactor[]> {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    const repository = dataSource.getRepository(CarbonEmissionFactor);
    return repository.find();
  }

  async save(
    carbonEmissionFactor: CreateCarbonEmissionFactorDto[],
  ): Promise<CarbonEmissionFactor[]> {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    try {
      const repository = dataSource.getRepository(CarbonEmissionFactor);
      return await repository.save(carbonEmissionFactor);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === PG_UNIQUE_CONSTRAINT_VIOLATION
      ) {
        throw new ConflictError(
          "A carbon emission factor with the same name and unit already exists.",
        );
      }
      throw error;
    }
  }

  async upsert(
    factors: CreateCarbonEmissionFactorDto[],
  ): Promise<CarbonEmissionFactor[]> {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
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
