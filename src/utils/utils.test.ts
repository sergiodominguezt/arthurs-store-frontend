import {
  calculateSubtotal,
  calculateBaseFee,
  calculateTotal,
  BASE_FEE_PERCENTAGE,
  DELIVERY_FEE,
} from "./utils";

describe("utils", () => {
  const products = [
    { productId: 1, price: 100 },
    { productId: 2, price: 200 },
  ];

  it("calculates subtotal correctly", () => {
    const selectedProduct = 1;
    const quantities = { 1: 2 };

    const subtotal = calculateSubtotal(selectedProduct, products, quantities);
    expect(subtotal).toBe(200);
  });

  it("calculates base fee correctly", () => {
    const subtotal = 200;
    const baseFee = calculateBaseFee(subtotal);
    expect(baseFee).toBe(subtotal * BASE_FEE_PERCENTAGE);
  });

  it("calculates total correctly", () => {
    const selectedProduct = 1;
    const quantities = { 1: 2 };

    const total = calculateTotal(selectedProduct, products, quantities);
    const subtotal = calculateSubtotal(selectedProduct, products, quantities);
    const baseFee = calculateBaseFee(subtotal);
    expect(total).toBe(subtotal + baseFee + DELIVERY_FEE);
  });
});
