import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import "./Home.css";
import { fetchProducts } from "../store/reducer";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Remove, Add } from "@mui/icons-material";

interface Props {
  title: string;
}

const getCardType = (number: string) => {
  if (number.startsWith("4")) return "visa";
  if (number.startsWith("5")) return "master";
  if (number.startsWith("34") || number.startsWith("37")) return "amex";
  return "";
};

const Home: React.FC = () => {
  const { error, loading, products } = useSelector(
    (state: RootState) => state.products
  );

  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [userEmail, setUserEmail] = useState<string>("");
  const [installments, setInstallments] = useState<number>(1);
  const [cardHolder, setCardHolder] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [expirationMonth, setExpirationMonth] = useState<string>("");
  const [expirationYear, setExpirationYear] = useState<string>("");
  const [cvc, setCvc] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handlePaymentSubmit = () => {
    if (selectedProduct !== null) {
      const paymentData = {
        payment: {
          cardNumber,
          cvc,
          expirationMonth,
          expirationYear,
          cardHolder,
          userEmail,
          installments,
          productId: selectedProduct,
          productQuantity: quantities[selectedProduct],
        },
        delivery: {
          address,
          city,
          customerName,
        },
      };

      console.log("Payment Data: ", paymentData);
    } else {
      alert("Please select a product to proceed with payment.");
    }
  };

  const isValidCVC = (cvc: string, cardType: string) => {
    const regex = cardType === "amex" ? /^\d{4}$/ : /^\d{3}$/;
    return regex.test(cvc);
  };

  const [cardType, setCardType] = useState<string>("");

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidCardNumber = (number: string) => {
    const regex = /^\d{16}$/; // Adjust as necessary
    return regex.test(number);
  };

  const handleCardNumberChange = (number: string) => {
    setCardNumber(number);
    setCardType(getCardType(number));
    console.log(cardType);
  };

  const handleBuyClick = (productId: number) => {
    const quantity = quantities[productId] || 0;
    if (quantity > 0) {
      setSelectedProduct(productId);
    } else {
      alert("Quantity must be greater than 0 to proceed with payment.");
    }
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity >= 0) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: newQuantity,
      }));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(amount);
  };

  const installmentsOptions = [1, 3, 6, 12];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="home-container">
        <h1 className="home-title">Arthur's Store</h1>
        <div className="product-list">
          {products.map((product) => (
            <div key={product.productId} className="product-card">
              <img
                src={product.urlImage}
                alt={product.name}
                className="product-image"
              />
              <h2 className="product-name">{product.name}</h2>
              <p className="product-description">{product.description}</p>

              <Typography variant="h6" className="product-price">
                {formatCurrency(product.price)}
              </Typography>
              <Box
                marginTop={2}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <TextField
                  type="number"
                  label="Quantity"
                  value={quantities[product.productId] || 0}
                  onChange={(e) =>
                    handleQuantityChange(
                      product.productId,
                      Number(e.target.value)
                    )
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          onClick={() =>
                            handleQuantityChange(
                              product.productId,
                              (quantities[product.productId] || 0) - 1
                            )
                          }
                          disabled={(quantities[product.productId] || 0) <= 0}
                        >
                          <Remove />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            handleQuantityChange(
                              product.productId,
                              (quantities[product.productId] || 0) + 1
                            )
                          }
                        >
                          <Add />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  style={{ width: "150px" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleBuyClick(product.productId)}
                >
                  Buy
                </Button>
              </Box>
            </div>
          ))}
        </div>
      </div>
      <Dialog
        open={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
      >
        <DialogTitle>Enter Card Information</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              label="User Email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
            <TextField
              select
              label="Installments"
              value={installments}
              onChange={(e) => setInstallments(Number(e.target.value))}
              required
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Card Holder"
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              required
            />
            <TextField
              label="Card Number"
              type="number"
              value={cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              required
            />
            {cardType && (
              <img
                src={require(`../assets/logos/${cardType}.png`)}
                alt={`${cardType} logo`}
                style={{ width: "50px", marginTop: "10px" }}
              />
            )}

            <TextField
              select
              label="Expiration Month"
              value={expirationMonth}
              onChange={(e) => setExpirationMonth(e.target.value)}
              required
            >
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={String(i + 1).padStart(2, "0")}>
                  {String(i + 1).padStart(2, "0")}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Expiration Year"
              value={expirationYear}
              onChange={(e) => setExpirationYear(e.target.value)}
              required
            >
              {Array.from({ length: 10 }, (_, i) => (
                <MenuItem key={i + 2024} value={String(i + 24)}>
                  {String(i + 24)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="CVC"
              type="password"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              required
              slotProps={{
                htmlInput: {
                  maxLength: 4,
                },
              }}
            />
            <TextField
              label="Address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <TextField
              label="City"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <TextField
              label="Customer Name"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedProduct(null)} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary" onClick={handlePaymentSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Home;
