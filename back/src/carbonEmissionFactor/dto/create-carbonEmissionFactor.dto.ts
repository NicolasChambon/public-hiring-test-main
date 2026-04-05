import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateCarbonEmissionFactorDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  unit!: string;

  @IsNumber()
  @Min(0)
  emissionCO2eInKgPerUnit!: number;

  @IsString()
  @IsNotEmpty()
  source!: string;
}
