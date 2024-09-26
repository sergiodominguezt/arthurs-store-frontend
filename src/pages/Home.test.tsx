import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Home, { getCardType, isValidCardNumber } from "./Home";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, processTransaction } from "../store/reducer";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";

// Mock useSelector and useDispatch
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock("../store/reducer", () => ({
  fetchProducts: jest.fn(),
  processTransaction: jest.fn(),
  updateTransactionStatus: jest.fn(),
}));

jest.mock("notistack", () => ({
  useSnackbar: () => ({
    enqueueSnackbar: jest.fn(),
    closeSnackbar: jest.fn(),
  }),
}));

describe("Home Component", () => {
  const mockDispatch = jest.fn();
  const mockedGetCardType = getCardType as jest.Mock;
  const mockedIsValidCardNumber = isValidCardNumber as jest.Mock;

  beforeEach(() => {
    jest.mocked(useDispatch).mockReturnValue(mockDispatch);
    jest.mocked(useSelector).mockReturnValue({
      products: [
        {
          productId: 1,
          name: "Product 1",
          description: "Description 1",
          price: 100,
          stock: 10,
          urlImage: "http://example.com/product1.jpg",
        },
        {
          productId: 2,
          name: "Product 2",
          description: "Description 2",
          price: 200,
          stock: 5,
          urlImage: "http://example.com/product2.jpg",
        },
      ],
      loading: false,
      error: null,
      transactionStatus: "idle",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders products correctly", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText("Arthur's Store")).toBeInTheDocument();
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByText("Quantities left: 10")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
  });

  it("calls fetchProducts on component mount", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(mockDispatch).toHaveBeenCalledWith(fetchProducts());
  });

  it("handles quantity change correctly", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const quantityInputs = screen.getAllByLabelText(
      /Quantity/i
    ) as HTMLInputElement[];

    const firstProductQuantityInput = quantityInputs[0];
    fireEvent.change(firstProductQuantityInput, { target: { value: "2" } });

    expect(firstProductQuantityInput.value).toBe("2");
  });

  it("shows spinner when products are loading", () => {
    jest.mocked(useSelector).mockReturnValueOnce({
      products: [],
      loading: true,
      error: null,
      transactionStatus: "idle",
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText("Products loading...")).toBeInTheDocument();
  });

  it('should return "visa" for Visa card numbers', () => {
    expect(getCardType("4111111111111111")).toBe("visa");
  });

  it('should return "master" for MasterCard numbers', () => {
    expect(getCardType("5111111111111111")).toBe("master");
  });

  it('should return "amex" for American Express card numbers', () => {
    expect(getCardType("341111111111111")).toBe("amex");
    expect(getCardType("371111111111111")).toBe("amex");
  });

  it("should return an empty string for unknown card types", () => {
    expect(getCardType("6011111111111111")).toBe("");
    expect(getCardType("1234567890123456")).toBe("");
  });
});
