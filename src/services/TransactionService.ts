export interface PaymentDetails {
  cardNumber: string;
  cvc: string;
  expirationMonth: string;
  expirationYear: string;
  cardHolder: string;
  userEmail: string;
  installments: number;
  productId: number;
  productQuantity: number;
}

export interface DeliveryDetails {
  address: string;
  city: string;
  customerName: string;
}

export interface PaymentRequest {
  payment: PaymentDetails;
  delivery: DeliveryDetails;
}

interface PaymentResponse {
  message: string;
  transactionStatus: "pending" | "approved" | "denied";
}

export const processPayment = async (
  paymentRequest: PaymentRequest
): Promise<PaymentResponse> => {
  const response = await fetch("http://localhost:3000/transaction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentRequest),
  });

  if (!response.ok) {
    throw new Error("Failed to process payment");
  }

  return await response.json();
};
