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
}

const initialPaymentState: PaymentState = {
  loading: false,
  success: false,
  error: null,
};

export const processTransaction = createAsyncThunk(
  "/transaction",
  async (paymentRequest: PaymentRequest) => {
    return await processPayment(paymentRequest);
  }
);

export const paymentSlice = createSlice({
  name: "payments",
  initialState: initialPaymentState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(processTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processTransaction.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(processTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to process transaction";
      });
  },
});

export const productReducer = productSlice.reducer;
export const paymentReducer = paymentSlice.reducer;
