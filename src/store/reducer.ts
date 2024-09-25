import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProductsFromAPI } from "../services/ProductService";
import { processPayment } from "../services/TransactionService";
import { PaymentRequest } from "../services/TransactionService";

interface State {
  value: number;
  products: Product[];
  loading: boolean;
  error: string | null;
}

interface Product {
  productId: number;
  name: string;
  description: string;
  stock: number;
  price: number;
  urlImage: string;
}

const initialState: State = {
  products: [],
  loading: false,
  error: null,
  value: 0,
};

export const fetchProducts = createAsyncThunk("/products", async () => {
  return await fetchProductsFromAPI();
});

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.products = action.payload;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      });
  },
});

interface PaymentState {
  loading: boolean;
  success: boolean;
  error: string | null;
  transactionStatus: "idle" | "pending" | "approved" | "denied";
}

const initialPaymentState: PaymentState = {
  loading: false,
  success: false,
  error: null,
  transactionStatus: "idle",
};

export const processTransaction = createAsyncThunk(
  "/transaction",
  async (paymentRequest: PaymentRequest) => {
    const response = await processPayment(paymentRequest);
    return response;
  }
);

export const paymentSlice = createSlice({
  name: "payments",
  initialState: initialPaymentState,
  reducers: {
    updateTransactionStatus: (
      state,
      action: PayloadAction<"idle" | "approved" | "denied">
    ) => {
      state.transactionStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(processTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.transactionStatus = "pending";
      })
      .addCase(processTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.transactionStatus = action.payload.transactionStatus; // Asume que el backend devuelve el estado
      })
      .addCase(processTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to process transaction";
        state.transactionStatus = "denied"; // O el estado que consideres apropiado
      });
  },
});

export const { updateTransactionStatus } = paymentSlice.actions;
export const productReducer = productSlice.reducer;
export const paymentReducer = paymentSlice.reducer;
