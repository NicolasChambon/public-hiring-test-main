import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Ingredient } from "./foodProduct.types";

@Entity("food_products")
export class FoodProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    type: "jsonb",
    nullable: false,
  })
  ingredients: Ingredient[];

  @Column({
    type: "float",
    nullable: true,
  })
  carbonFootprintInKgCO2e: number | null;

  constructor(props: {
    name: string;
    ingredients: Ingredient[];
    carbonFootprintInKgCO2e: number | null;
  }) {
    super();

    this.name = props?.name;
    this.ingredients = props?.ingredients;
    this.carbonFootprintInKgCO2e = props?.carbonFootprintInKgCO2e;
  }
}
