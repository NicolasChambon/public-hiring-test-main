import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";

class IngredientDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(0)
  quantity!: number;

  @IsString()
  @IsNotEmpty()
  unit!: string;
}

export class CreateFoodProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients!: IngredientDto[];
}
