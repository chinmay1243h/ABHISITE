import { ThemeProvider } from "@emotion/react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import RenderRazorpay from "../../components/payments/RanderPayment";
import { createOrder, createOrderinDB } from "../../services/services";
import theme from "../../theme";
import { getUserId } from "../../services/axiosClient";
import { Delete } from "@mui/icons-material";
import color from "../../components/utils/Colors";

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [cartCount, setCartCount] = useState<number>(0);

  const handlePayment = async () => {
    try {
      const subtotal = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0; // Ensure price is a float
        const quantity = parseInt(item.quantity, 10) || 1; // Default quantity to 1
        return sum + price * quantity;
      }, 0);

      console.log("Subtotal before payment:", subtotal);

      if (subtotal === 0) {
        alert("Cart is empty or subtotal is zero.");
        return;
      }

      const payLoad = {
        amount: subtotal, // Convert to paise
        currency: "INR",
      };

      console.log("Payload sent to createOrder:", payLoad);
      const response = await createOrder(payLoad);

      const payLoad1 = {
        userId: cartItems[0].userId,
        courseId: cartItems[0].id,
      };

      console.log("Payload sent to createOrderinDB:", payLoad1);
      // await createOrderinDB(payLoad1);
      setOrderDetails(response.data.data);
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Payment failed. Please try again.");
    }
  };

  const removeItemFromCart = (id: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    setCartCount(updatedCart.length);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    console.log("Loaded cart from localStorage:", cart);
    if (Array.isArray(cart)) {
      const updatedCart = cart.map((item) => ({
        ...item,
        quantity: item.quantity || 1, // Default quantity to 1 if not present
      }));
      setCartItems(updatedCart);
      setCartCount(updatedCart.length);
    }
  }, []);

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0; // Ensure price is a float
    const quantity = parseInt(item.quantity, 10) || 1; // Default quantity to 1
    return sum + price * quantity; // Multiply price and quantity
  }, 0);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          maxWidth: 600,
          margin: "auto",
          padding: 2,
          background: "white",
          my: 2,
          borderRadius: "16px",
          p: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Your Cart
        </Typography>
        <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
          <List>
            {cartItems.map((item) => (
              <ListItem key={item.id} divider>
                <ListItemText
                  primary={item.title}
                  secondary={`₹${item.price || 0} each`}
                />
                <ListItemSecondaryAction>
                  <Typography component="span" sx={{ margin: "0 10px" }}>
                    Quantity: {item.quantity}
                  </Typography>
                  <Button
                    style={{ color: "red" }}
                    onClick={() => removeItemFromCart(item.id)}
                  >
                    <Delete></Delete>
                    {/* Delete */}
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <Typography variant="h6">
              Subtotal: ₹{subtotal.toFixed(2)}
            </Typography>
          </Box>
        </Paper>

        <Box mt={1} display={"flex"}>
          <Button
            onClick={handlePayment}
            variant="contained"
            color="primary"
            size="small"
            style={{
              background: color.textColor1,
              fontSize: "18px",
              textTransform: "none",
              margin: 0,
              marginRight: "auto",
              border: "solid 1px white",
            }}
            sx={{
              padding: "2px 10px",
              transition: "all 0.4s ease",

              "&:hover": {
                paddingRight: "20px",
              },
            }}
          >
            Proceed to pay
          </Button>
        </Box>

        {orderDetails && (
          <RenderRazorpay
            orderDetails={orderDetails}
            amount={subtotal}
            courseId={cartItems[0].id}
            userId={getUserId()}
          />
        )}
      </Box>
    </ThemeProvider>
  );
};

export default CartPage;
