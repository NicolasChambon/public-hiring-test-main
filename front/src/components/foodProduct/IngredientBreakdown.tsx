import { Ingredient } from "@/types/food-product";
import ProgressBar from "../ui/ProgressBar";

export default function IngredientBreakdown({
  ingredients,
}: {
  ingredients: Ingredient[];
}) {
  const allHaveCarbonFootprint = ingredients.every(
    (ingredient) => ingredient.carbonFootprint !== null,
  );

  const totalCarbonFootprint = allHaveCarbonFootprint
    ? ingredients.reduce(
        (sum, ingredient) => sum + (ingredient.carbonFootprint ?? 0),
        0,
      )
    : 0;

  return (
    <div className="mt-4 bg-gray-50 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">
        Ingredient Breakdown
      </h4>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-xs text-gray-500 uppercase">
            <th className="text-left pb-2">Ingredient</th>
            <th className="text-right pb-2">Qty</th>
            <th className="text-left pb-2 pl-2">Unit</th>
            <th className="text-right pb-2">CO₂e (kg)</th>
            <th className="text-right pb-2">Share</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {ingredients.map((ingredient) => (
            <tr
              key={`${ingredient.name}-${ingredient.unit}`}
              className={ingredient.carbonFootprint === null ? "bg-red-50" : ""}
            >
              <td className="py-1.5 font-medium">{ingredient.name}</td>
              <td className="py-1.5 text-right text-gray-600">
                {ingredient.quantity}
              </td>
              <td className="py-1.5 pl-2 text-gray-500">{ingredient.unit}</td>
              <td className="py-1.5 text-right">
                {ingredient.carbonFootprint == null ? (
                  <span className="text-red-500 text-xs">No factor</span>
                ) : (
                  ingredient.carbonFootprint.toFixed(4)
                )}
              </td>
              <td className="py-1.5 text-right">
                {ingredient.carbonFootprint !== null &&
                totalCarbonFootprint > 0 ? (
                  <ProgressBar
                    amount={ingredient.carbonFootprint}
                    total={totalCarbonFootprint}
                  />
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
