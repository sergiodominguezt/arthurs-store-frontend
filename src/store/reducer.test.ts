import {
  productReducer,
  fetchProducts,
  initialState,
  paymentReducer,
  updateTransactionStatus,
  processTransaction,
  initialPaymentState,
} from "./reducer"; // Adjust the import path as necessary

// Adjust your tests for the product reducer
describe("Product Reducer", () => {
  it("should return the initial state", () => {
    expect(productReducer(undefined, { type: "" })).toEqual(initialState); // Use an empty string or any defined string
  });

  it("should handle fetchProducts.pending", () => {
    const action = { type: fetchProducts.pending.type }; // Ensure this is defined
    const expectedState = {
      ...initialState,
      loading: true,
      error: null,
    };
    expect(productReducer(initialState, action)).toEqual(expectedState);
  });

  it("should handle fetchProducts.fulfilled", () => {
    const action = {
      type: fetchProducts.fulfilled.type,
      payload: [
        {
          productId: 1,
          name: "Test Product",
          description: "",
          stock: 10,
          price: 100,
          urlImage: "",
        },
      ],
    };
    const expectedState = {
      ...initialState,
      loading: false,
      products: action.payload,
    };
    expect(productReducer(initialState, action)).toEqual(expectedState);
  });

  it("should handle fetchProducts.rejected", () => {
    const action = {
      type: fetchProducts.rejected.type,
      error: { message: "Failed to fetch products" },
    };
    const expectedState = {
      ...initialState,
      loading: false,
      error: "Failed to fetch products",
    };
    expect(productReducer(initialState, action)).toEqual(expectedState);
  });
});

describe("Payment Reducer", () => {
  it("should return the initial state", () => {
    expect(paymentReducer(undefined, { type: "" })).toEqual(
      initialPaymentState
    ); // Use an empty string for the action type
  });

  it("should handle updateTransactionStatus", () => {
    const action = updateTransactionStatus("approved");
    const expectedState = {
      ...initialPaymentState,
      transactionStatus: "approved",
    };
    expect(paymentReducer(initialPaymentState, action)).toEqual(expectedState);
  });

  it("should handle processTransaction.pending", () => {
    const action = { type: processTransaction.pending.type };
    const expectedState = {
      ...initialPaymentState,
      loading: true,
      error: null,
      transactionStatus: "pending",
    };
    expect(paymentReducer(initialPaymentState, action)).toEqual(expectedState);
  });

  it("should handle processTransaction.fulfilled", () => {
    const action = {
      type: processTransaction.fulfilled.type,
      payload: { transactionStatus: "approved" }, // Adjust based on what your backend returns
    };
    const expectedState = {
      ...initialPaymentState,
      loading: false,
      success: true,
      transactionStatus: "approved",
    };
    expect(paymentReducer(initialPaymentState, action)).toEqual(expectedState);
  });

  it("should handle processTransaction.rejected", () => {
    const action = {
      type: processTransaction.rejected.type,
      error: { message: "Transaction failed" },
    };
    const expectedState = {
      ...initialPaymentState,
      loading: false,
      error: "Transaction failed",
      transactionStatus: "denied",
    };
    expect(paymentReducer(initialPaymentState, action)).toEqual(expectedState);
  });
});
