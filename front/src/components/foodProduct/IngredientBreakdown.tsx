import { Ingredient } from "@/types/food-product";

export default function IngredientBreakdown({
  ingredients,
}: {
  ingredients: Ingredient[];
}) {
  const total = ingredients.reduce(
    (sum, i) => sum + (i.carbonFootprint ?? 0),
    0,
  );

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
          {ingredients.map((ing) => (
            <tr
              key={ing.name}
              className={ing.carbonFootprint === null ? "bg-red-50" : ""}
            >
              <td className="py-1.5 font-medium">{ing.name}</td>
              <td className="py-1.5 text-right text-gray-600">
                {ing.quantity}
              </td>
              <td className="py-1.5 pl-2 text-gray-500">{ing.unit}</td>
              <td className="py-1.5 text-right">
                {ing.carbonFootprint === null ? (
                  <span className="text-red-500 text-xs">No factor</span>
                ) : (
                  ing.carbonFootprint.toFixed(4)
                )}
              </td>
              <td className="py-1.5 text-right">
                {ing.carbonFootprint !== null && total > 0 ? (
                  <div className="flex items-center justify-end gap-1">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{
                          width: `${(ing.carbonFootprint / total) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">
                      {((ing.carbonFootprint / total) * 100).toFixed(0)}%
                    </span>
                  </div>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
