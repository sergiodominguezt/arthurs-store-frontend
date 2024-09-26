// src/services/__tests__/paymentService.test.ts

import {
  processPayment,
  PaymentRequest,
  PaymentResponse,
} from "./TransactionService";

global.fetch = jest.fn();

describe("processPayment", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockPaymentRequest: PaymentRequest = {
    payment: {
      cardNumber: "4111111111111111",
      cvc: "123",
      expirationMonth: "12",
      expirationYear: "2025",
      cardHolder: "John Doe",
      userEmail: "john.doe@example.com",
      installments: 1,
      productId: 101,
      productQuantity: 2,
    },
    delivery: {
      address: "123 Main St",
      city: "Anytown",
      customerName: "John Doe",
    },
  };

  it("should process payment successfully", async () => {
    const mockResponse: PaymentResponse = {
      message: "Payment processed successfully",
      transactionStatus: "approved",
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const response = await processPayment(mockPaymentRequest);
    expect(response).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mockPaymentRequest),
    });
  });

  it("should throw an error if the payment processing fails", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(processPayment(mockPaymentRequest)).rejects.toThrow(
      "Failed to process payment"
    );
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mockPaymentRequest),
    });
  });
});
