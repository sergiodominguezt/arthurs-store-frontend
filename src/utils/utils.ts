export const BASE_FEE_PERCENTAGE = 0.15;
export const DELIVERY_FEE = 15000;

export const calculateSubtotal = (
  selectedProduct: number | null,
  products: { productId: number; price: number }[],
  quantities: { [key: number]: number }
): number => {
  if (selectedProduct !== null && products.length > 0) {
    const selectedProductInfo = products.find(
      (product) => product.productId === selectedProduct
    );
    const productQuantity = quantities[selectedProduct] || 0;
    if (selectedProductInfo) {
      return selectedProductInfo.price * productQuantity;
    }
  }
  return 0;
};

export const calculateBaseFee = (subtotal: number): number => {
  return subtotal * BASE_FEE_PERCENTAGE;
};

export const calculateTotal = (
  selectedProduct: number | null,
  products: { productId: number; price: number }[],
  quantities: { [key: number]: number }
): number => {
  const subtotal = calculateSubtotal(selectedProduct, products, quantities);
  const baseFee = calculateBaseFee(subtotal);
  return subtotal + baseFee + DELIVERY_FEE;
};
