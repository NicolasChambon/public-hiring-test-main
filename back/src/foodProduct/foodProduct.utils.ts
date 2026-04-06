import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { Ingredient } from "./foodProduct.types";

export interface CarbonFootprintResult {
  totalCarbonFootprint: number | null;
  ingredientsWithCarbonFootprint: Ingredient[];
}

export function computeCarbonFootprint(
  ingredients: Ingredient[],
  carbonEmissionFactors: CarbonEmissionFactor[],
): CarbonFootprintResult {
  const factorMap = new Map(
    carbonEmissionFactors.map((factor) => [
      `${factor.name}-${factor.unit}`,
      factor,
    ]),
  );

  let totalCarbonFootprint = 0;
  let hasMissingFactor = false;
  const ingredientsWithCarbonFootprint = ingredients.map((ingredient) => {
    const factor = factorMap.get(`${ingredient.name}-${ingredient.unit}`);

    if (!factor) {
      hasMissingFactor = true;
      return { ...ingredient, carbonFootprint: null };
    }

    const carbonFootprint =
      ingredient.quantity * factor.emissionCO2eInKgPerUnit;
    totalCarbonFootprint += carbonFootprint;

    return {
      ...ingredient,
      carbonFootprint: carbonFootprint,
    };
  });

  return {
    totalCarbonFootprint: hasMissingFactor ? null : totalCarbonFootprint,
    ingredientsWithCarbonFootprint,
  };
}
