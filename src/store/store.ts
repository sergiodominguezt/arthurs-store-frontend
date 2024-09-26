import { configureStore } from "@reduxjs/toolkit";
import { productReducer, paymentReducer } from "./reducer";
import thunk from "redux-thunk";

const rootReducer = {
  products: productReducer,
  payments: paymentReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
