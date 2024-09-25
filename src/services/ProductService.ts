export interface Product {
  productId: number;
  name: string;
  description: string;
  stock: number;
  price: number;
  urlImage: string;
}

export const fetchProductsFromAPI = async (): Promise<Product[]> => {
  const response = await fetch("http://localhost:3000/products");

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();
  return data as Product[];
};
