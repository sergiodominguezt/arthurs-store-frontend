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
  productId: number;
}

export interface PaymentRequest {
  payment: PaymentDetails;
  delivery: DeliveryDetails;
}

export const processPayment = async (
  paymentRequest: PaymentRequest
): Promise<void> => {
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

  // Puedes manejar la respuesta aquí si es necesario
  const data = await response.json();
  console.log("Payment processed successfully:", data);
};
