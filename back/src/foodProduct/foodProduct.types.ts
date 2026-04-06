export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  carbonFootprint?: number | null;
}
