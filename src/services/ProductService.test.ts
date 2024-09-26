// src/services/__tests__/productService.test.ts

import { fetchProductsFromAPI, Product } from "./ProductService";

global.fetch = jest.fn();

describe("fetchProductsFromAPI", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch products successfully", async () => {
    const mockProducts: Product[] = [
      {
        productId: 1,
        name: "Product A",
        description: "Description A",
        stock: 10,
        price: 100,
        urlImage: "http://example.com/product-a.jpg",
      },
      {
        productId: 2,
        name: "Product B",
        description: "Description B",
        stock: 5,
        price: 200,
        urlImage: "http://example.com/product-b.jpg",
      },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    const products = await fetchProductsFromAPI();
    expect(products).toEqual(mockProducts);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/products");
  });

  it("should throw an error if the fetch fails", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(fetchProductsFromAPI()).rejects.toThrow(
      "Failed to fetch products"
    );
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/products");
  });
});
