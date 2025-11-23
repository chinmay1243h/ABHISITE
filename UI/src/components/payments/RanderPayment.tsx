import React, { useState } from "react";
import { createPayment, verifyPayment } from "../../services/services";
import { R_KEY_ID } from "../../services/Secret";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import color from "../utils/Colors";

interface RenderRazorpayProps {
  orderDetails: any;
  amount: any;
  courseId: any;
  userId: any;
}

const RenderRazorpay: React.FC<RenderRazorpayProps> = ({
  orderDetails,
  amount,
  courseId,
  userId,
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const loadScript = (src: string): Promise<boolean> =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const displayRazorpay = async () => {
    const isScriptLoaded = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!isScriptLoaded) {
      alert(
        "Failed to load Razorpay SDK. Please check your internet connection."
      );
      return;
    }

    if (!(window as any).Razorpay) {
      alert("Razorpay SDK is not available. Try reloading the page.");
      return;
    }

    const options = {
      key: R_KEY_ID || "",
      amount: orderDetails.amount,
      currency: orderDetails.currency,
      order_id: orderDetails.id,
      handler: async (response: any) => {
        try {
          await verifyPayment({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });
          alert("Payment Successful");
          const payLoad = {
            transactionId: response.razorpay_payment_id,
            status: "success",
            amount: amount,
            courseId: courseId,
            userId: userId,
          };
          console.log(payLoad);
          createPayment(payLoad).then((res: any) => {
            console.log(res);
            navigate("/my-courses");
            localStorage.removeItem("cart");
          });
        } catch (error) {
          alert("Payment verification failed. Please try again.");
        }
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      {/* <Button variant="contained" color="primary" onClick={handleOpen}>
                Complete Payment
            </Button> */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiPaper-root": {
            padding: "8px",
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle>Complete Your Payment</DialogTitle>
        <DialogContent>
          <p>Ensure your payment details are correct before proceeding.</p>
        </DialogContent>
        <DialogActions style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            style={{
              textTransform: "none",
              color: "black",
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            onClick={displayRazorpay}
            variant="contained"
            style={{
              background: color.textColor1,
              fontSize: "18px",
              textTransform: "none",
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
            Proceed to Pay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RenderRazorpay;
