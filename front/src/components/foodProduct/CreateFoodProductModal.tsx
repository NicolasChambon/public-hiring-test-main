"use client";

import { FormEvent, useState } from "react";
import type { CreateFoodProductDto, IngredientDto } from "@/types/food-product";

const EMPTY_INGREDIENT: IngredientDto = { name: "", quantity: 0, unit: "kg" };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFoodProductDto) => Promise<void>;
  isCreating: boolean;
}

export default function CreateFoodProductModal({
  isOpen,
  onClose,
  onSubmit,
  isCreating,
}: Props) {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState<IngredientDto[]>([
    { ...EMPTY_INGREDIENT },
  ]);

  const resetForm = () => {
    setName("");
    setIngredients([{ ...EMPTY_INGREDIENT }]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const addIngredient = () =>
    setIngredients((prev) => [...prev, { ...EMPTY_INGREDIENT }]);

  const removeIngredient = (indexToRm: number) =>
    setIngredients((prev) =>
      prev.filter((_, filterIndex) => filterIndex !== indexToRm),
    );

  const updateIngredient = (
    indexToUpdt: number,
    field: keyof IngredientDto,
    value: string | number,
  ) =>
    setIngredients((prev) =>
      prev.map((ingredient, mapIndex) =>
        mapIndex === indexToUpdt
          ? { ...ingredient, [field]: value }
          : ingredient,
      ),
    );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await onSubmit({ name, ingredients });
      resetForm();
    } catch {
      // error handled by the caller
      // keep form data intact
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Calculate Carbon Footprint
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2"
              placeholder="e.g., Ham Cheese Pizza"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Ingredients
              </label>
              <button
                type="button"
                onClick={addIngredient}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add ingredient
              </button>
            </div>
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    required
                    placeholder="Name"
                    value={ingredient.name}
                    onChange={(e) =>
                      updateIngredient(index, "name", e.target.value)
                    }
                    className="flex-1 border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Qty"
                    value={ingredient.quantity || ""}
                    onChange={(e) =>
                      updateIngredient(
                        index,
                        "quantity",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    className="w-20 border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                  <input
                    required
                    placeholder="Unit"
                    value={ingredient.unit}
                    onChange={(e) =>
                      updateIngredient(index, "unit", e.target.value)
                    }
                    className="w-16 border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm text-gray-700 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50"
            >
              {isCreating ? "Calculating..." : "Calculate & Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
