"use client";

import DataTable, { ColumnConfig } from "@/components/DataTable";
import ErrorState from "@/components/ErrorState";
import CreateFoodProductModal from "@/components/foodProduct/CreateFoodProductModal";
import IngredientBreakdown from "@/components/foodProduct/IngredientBreakdown";
import LoadingSpinner from "@/components/LoadingSpinner";
import { CreateFoodProductDto, FoodProduct } from "@/types/food-product";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const columns: ColumnConfig<FoodProduct>[] = [
  { key: "id", label: "ID", cellClassName: "text-sm text-gray-500 w-12" },
  {
    key: "name",
    label: "Product",
    cellClassName: "text-sm font-medium text-gray-900",
  },
  {
    key: "carbonFootprintInKgCO2e",
    label: "CO2e (kg)",
    cellClassName: "text-sm",
  },
];

export default function FoodProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<FoodProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FoodProduct | null>(
    null,
  );

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/food-products`);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data: FoodProduct[] = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (formData: CreateFoodProductDto) => {
    try {
      setCreating(true);
      const response = await fetch(`${API_URL}/food-products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! ${response.status}`);
      }

      await fetchProducts();
      setShowForm(false);
    } catch (error) {
      console.error("Error creating food product:", error);

      alert("Failed to create food product.");
    } finally {
      setCreating(false);
    }
  };

  const renderCell = (item: FoodProduct, column: ColumnConfig<FoodProduct>) => {
    if (column.key === "carbonFootprintInKgCO2e") {
      return item.carbonFootprintInKgCO2e === null ? (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
          Missing data
        </span>
      ) : (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {item.carbonFootprintInKgCO2e.toFixed(4)}
        </span>
      );
    }
    return String(item[column.key] ?? "");
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Food Products
            </h1>
            <p className="text-gray-600">
              Calculate and compare carbon footprints of food products.
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm"
          >
            + New Product
          </button>
        </div>

        <CreateFoodProductModal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateProduct}
          isCreating={creating}
        />

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <DataTable<FoodProduct>
            data={products}
            columns={columns}
            sortField={null}
            sortDirection="asc"
            onSort={() => {}}
            renderCell={renderCell}
            onRowClick={setSelectedProduct}
          />
        </div>

        {/* Breakdown panel */}
        {selectedProduct && (
          <div className="mt-6 bg-white shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-900">
                {selectedProduct.name}
              </h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                Close
              </button>
            </div>
            <IngredientBreakdown ingredients={selectedProduct.ingredients} />
          </div>
        )}
      </div>
    </div>
  );
}
