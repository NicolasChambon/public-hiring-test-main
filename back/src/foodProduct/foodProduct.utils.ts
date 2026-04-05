import { CarbonEmissionFactor } from "src/carbonEmissionFactor/carbonEmissionFactor.entity";
import { Ingredient } from "./foodProduct.types";

export function computeCarbonFootprint(
  ingredients: Ingredient[],
  carbonEmissionFactors: CarbonEmissionFactor[],
): number | null {
  const factorMap = new Map(
    carbonEmissionFactors.map((factor) => [
      `${factor.name}-${factor.unit}`,
      factor,
    ]),
  );

  let totalCarbonFootprint = 0;
  for (const ingredient of ingredients) {
    const factor = factorMap.get(`${ingredient.name}-${ingredient.unit}`);
    if (!factor) return null;
    totalCarbonFootprint +=
      ingredient.quantity * factor.emissionCO2eInKgPerUnit;
  }
  return totalCarbonFootprint;
}
