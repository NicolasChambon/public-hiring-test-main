import { FoodProduct } from "./foodProduct.entity";

let pizzaProduct: FoodProduct;

beforeAll(async () => {
  pizzaProduct = new FoodProduct({
    name: "hamCheesePizza",
    ingredients: [
      {
        name: "ham",
        quantity: 0.1,
        unit: "kg",
      },
      {
        name: "cheese",
        quantity: 0.2,
        unit: "kg",
      },
      {
        name: "flour",
        quantity: 0.3,
        unit: "kg",
      },
    ],
    carbonFootprintInKgCO2e: 0.8,
  });
});

describe("FoodProductEntity constructor", () => {
  it("should create food product", () => {
    expect(pizzaProduct.name).toBe("hamCheesePizza");
    expect(pizzaProduct.ingredients).toEqual([
      {
        name: "ham",
        quantity: 0.1,
        unit: "kg",
      },
      {
        name: "cheese",
        quantity: 0.2,
        unit: "kg",
      },
      {
        name: "flour",
        quantity: 0.3,
        unit: "kg",
      },
    ]);
    expect(pizzaProduct.carbonFootprintInKgCO2e).toBe(0.8);
  });

  it("should accept null carbonFootprintInKgCO2e", () => {
    const productWithNullEmission = new FoodProduct({
      name: "unknownProduct",
      ingredients: [
        {
          name: "unknownIngredient",
          quantity: 0.6,
          unit: "kg",
        },
      ],
      carbonFootprintInKgCO2e: null,
    });

    expect(productWithNullEmission.carbonFootprintInKgCO2e).toBeNull();
    expect(productWithNullEmission.name).toBe("unknownProduct");
  });
});
