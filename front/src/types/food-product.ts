export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  carbonFootprint: number | null;
}

export interface FoodProduct {
  id: number;
  name: string;
  ingredients: Ingredient[];
  carbonFootprintInKgCO2e: number | null;
}

export interface IngredientDto {
  name: string;
  quantity: number;
  unit: string;
}

export interface CreateFoodProductDto {
  name: string;
  ingredients: IngredientDto[];
}
