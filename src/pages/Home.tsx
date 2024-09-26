import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import "./Home.css";
import {
  fetchProducts,
  processTransaction,
  updateTransactionStatus,
} from "../store/reducer";
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
import { enqueueSnackbar } from "notistack";
import Spinner from "../components/Spinner";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  calculateBaseFee,
  calculateSubtotal,
  calculateTotal,
  DELIVERY_FEE,
} from "../utils/utils";

interface Props {
  title: string;
}

export const getCardType = (number: string) => {
  if (number.startsWith("4")) return "visa";
  if (number.startsWith("5")) return "master";
  if (number.startsWith("34") || number.startsWith("37")) return "amex";
  return "";
};

export const isValidCardNumber = (number: string) => {
  const regex = /^\d{16}$/;
  return regex.test(number);
};

const Home: React.FC = () => {
  const {
    error: productError,
    loading: productLoading,
    products,
  } = useSelector((state: RootState) => state.products);

  const {
    loading: transactionLoading,
    transactionStatus,
    error: transactionError,
  } = useSelector((state: RootState) => state.payments);

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
  const [errors, setErrors] = useState({
    cardNumber: "",
    cvc: "",
    userEmail: "",
  });
  const [touched, setTouched] = useState({
    cardNumber: false,
    cvc: false,
    userEmail: false,
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleReturnToProducts = () => {
    dispatch(updateTransactionStatus("idle"));
    navigate("/");
  };

  const subTotal = calculateSubtotal(selectedProduct, products, quantities);
  const total = calculateTotal(selectedProduct, products, quantities);

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
      dispatch(processTransaction(paymentData))
        .then((response) => {
          enqueueSnackbar("Payment processed successfully!", {
            variant: "success",
          });
        })
        .catch((error) => {
          enqueueSnackbar("Payment failed. Please try again.", {
            variant: "error",
          });
        });
    } else {
      enqueueSnackbar("Please select a product to proceed with payment.", {
        variant: "warning",
      });
    }
  };

  const [cardType, setCardType] = useState<string>("");

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleCardNumberChange = (number: string) => {
    setCardNumber(number);
    setCardType(getCardType(number));
    setTouched((prevTouched) => ({
      ...prevTouched,
      cardNumber: true,
    }));
    if (!isValidCardNumber(number)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cardNumber: "Invalid card number",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cardNumber: "",
      }));
    }
  };

  const handleCVCChange = (value: any) => {
    setCvc(value);
    setTouched((prevTouched) => ({
      ...prevTouched,
      cvc: true,
    }));
    if (value.length < 3 || value.length > 4) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cvc: "CVC must be 3 or 4 digits",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cvc: "",
      }));
    }
  };

  const handleUserEmailChange = (value: any) => {
    setUserEmail(value);
    setTouched((prevTouched) => ({
      ...prevTouched,
      userEmail: true,
    }));
    if (!isValidEmail(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        userEmail: "Invalid email address",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        userEmail: "",
      }));
    }
  };

  const handleBuyClick = (productId: number) => {
    const quantity = quantities[productId] || 0;
    if (quantity > 0) {
      setSelectedProduct(productId);
    } else {
      enqueueSnackbar(
        "Quantity must be greater than 0 to proceed with payment."
      );
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, "0");
    return { value: month, label: month };
  });

  const currentYear = new Date().getFullYear() % 100;
  const years = Array.from({ length: 10 }, (_, i) => {
    const year = (currentYear + i).toString().padStart(2, "0");
    return { value: year, label: year };
  });

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    const product = products.find((p) => p.productId === productId);
    if (product) {
      if (newQuantity >= 0 && newQuantity <= product.stock) {
        setQuantities((prevQuantities) => ({
          ...prevQuantities,
          [productId]: newQuantity,
        }));
      } else if (newQuantity > product.stock) {
        enqueueSnackbar(
          `The maximum quantity available for ${product.name} is ${product.stock}.`,
          { variant: "warning" }
        );
      }
    }
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(amount);
  };

  if (transactionLoading) {
    const message =
      transactionStatus === "pending"
        ? "Payment is in validation process"
        : "Transaction is being processed";
    return <Spinner message={message} />;
  }

  if (transactionStatus === "approved") {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <CheckCircleIcon style={{ fontSize: 80, color: "green" }} />
        <Typography variant="h5">Your payment was approved!</Typography>
        <Button
          onClick={handleReturnToProducts}
          variant="contained"
          style={{ marginTop: 20 }}
        >
          Return to Products
        </Button>
      </Box>
    );
  }

  if (transactionStatus === "denied") {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <CancelIcon style={{ fontSize: 80, color: "red" }} />
        <Typography variant="h5">Your payment was declined.</Typography>
        <Button
          onClick={handleReturnToProducts}
          variant="contained"
          style={{ marginTop: 20 }}
        >
          Return to Products
        </Button>
      </Box>
    );
  }

  if (productLoading) return <Spinner message="Products loading..." />;

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
              <p className="product-stock">Quantities left: {product.stock}</p>
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
                          disabled={
                            (quantities[product.productId] || 0) >=
                            product.stock
                          }
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
                  onClick={() => handleBuyClick(product.productId)}
                  sx={{
                    marginTop: "10px",
                    backgroundColor: "#b0f2ae",
                    color: "black",
                  }}
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
        <DialogTitle>Complete Your Purchase</DialogTitle>
        <DialogContent>
          <form>
            <Typography variant="h6" gutterBottom>
              Enter your card information
            </Typography>
            <TextField
              label="Card Holder"
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Card Number"
              type="number"
              value={cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              fullWidth
              required
              margin="normal"
              error={touched.cardNumber && !!errors.cardNumber}
              helperText={touched.cardNumber && errors.cardNumber}
            />
            {cardType && (
              <img
                src={require(`../assets/logos/${cardType}.png`)}
                alt={`${cardType} logo`}
                style={{ width: "50px", marginTop: "10px" }}
              />
            )}
            <FormControl fullWidth margin="normal">
              <InputLabel shrink id="expiration-month-label">
                Expiration Month
              </InputLabel>
              <Select
                labelId="expiration-month-label"
                value={expirationMonth}
                label="Expiration Month"
                onChange={(e) => setExpirationMonth(e.target.value)}
                required
                displayEmpty
              >
                {months.map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel shrink id="expiration-year-label">
                Expiration Year
              </InputLabel>
              <Select
                labelId="expiration-year-label"
                value={expirationYear}
                label="Expiration Year"
                onChange={(e) => setExpirationYear(e.target.value)}
                required
                displayEmpty
              >
                {years.map((year) => (
                  <MenuItem key={year.value} value={year.value}>
                    {year.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="CVC"
              type="password"
              value={cvc}
              onChange={(e) => handleCVCChange(e.target.value)}
              fullWidth
              required
              margin="normal"
              slotProps={{ htmlInput: { maxLength: 4 } }}
              error={touched.cvc && !!errors.cvc}
              helperText={touched.cvc && errors.cvc}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel shrink id="installments-label">
                Installments
              </InputLabel>
              <Select
                labelId="installments-label"
                value={installments}
                label="Installments"
                onChange={(e) => setInstallments(Number(e.target.value))}
                displayEmpty
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={12}>12</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="h6" gutterBottom marginTop={2}>
              Enter your personal information
            </Typography>
            <TextField
              label="User Email"
              type="email"
              value={userEmail}
              onChange={(e) => handleUserEmailChange(e.target.value)}
              fullWidth
              required
              margin="normal"
              error={touched.userEmail && !!errors.userEmail}
              helperText={touched.userEmail && errors.userEmail}
            />
            <TextField
              label="Customer Name"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              fullWidth
              required
              margin="normal"
            />

            <Typography variant="h6" gutterBottom marginTop={2}>
              Enter your shipping information
            </Typography>
            <TextField
              label="Address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="City"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
          </form>
          <Box mt={2}>
            <Typography variant="h6">Purchase Summary</Typography>
            <Typography>
              <strong>Subtotal: </strong> {formatCurrency(subTotal)}
            </Typography>
            <Typography>
              <strong>Base Fee: </strong>{" "}
              {formatCurrency(calculateBaseFee(subTotal))}
            </Typography>
            <Typography>
              <strong>Delivery Fee: </strong> {formatCurrency(DELIVERY_FEE)}
            </Typography>
            <Typography>
              <strong>Total: </strong> {formatCurrency(total)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedProduct(null)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handlePaymentSubmit}
            color="primary"
            disabled={
              !isValidEmail(userEmail) || !isValidCardNumber(cardNumber)
            }
          >
            Pay Now
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Home;
