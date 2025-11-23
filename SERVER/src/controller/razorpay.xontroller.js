const razorpay = require("../utils/razorpay");
const crypto = require("crypto");
const { prepareResponse } = require("../utils/response");
const Payment = require("../models/payment.model");
const httpRes = require("../utils/http");

exports.createOrder = async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const options = {
      amount: amount * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
    };
    console.log(options);
    const order = await razorpay.orders.create(options);

    res
      .status(httpRes.CREATED)
      .json(prepareResponse("CREATED", "Order created", order, null));
  } catch (error) {
    console.error("Create order error:", error);
    res
      .status(httpRes.SERVER_ERROR)
      .json(
        prepareResponse("SERVER_ERROR", "Failed to create order", null, error.message)
      );
  }
};

exports.verifyPayment = async (req, res) => {
  const { orderId, paymentId, signature } = req.body;

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.R_KEY_SECRET)
    .update(body)
    .digest("hex");

  console.log(expectedSignature);
  if (expectedSignature !== signature) {
    return res
      .status(400)
      .json(
        prepareResponse("INVALID_SIGNATURE", "Signature mismatch", null, null)
      );
  }

  try {
    const paymentDetails = await razorpay.payments.fetch(paymentId);

    // Save payment to database
    const payment = await Payment.create({
      transactionId: paymentId,
      orderId: orderId,
      status: paymentDetails.status === "captured" ? "success" : paymentDetails.status === "failed" ? "failed" : "pending",
      amount: String(paymentDetails.amount / 100), // Convert to string as per schema
      courseId: req.body.courseId || null,
      userId: req.body.userId || req.decoded?.id || null,
    });

    res
      .status(httpRes.OK)
      .json(
        prepareResponse(
          "SUCCESS",
          "Payment verified and saved",
          { paymentDetails, payment },
          null
        )
      );
  } catch (error) {
    console.error("Payment verification error:", error);
    res
      .status(httpRes.SERVER_ERROR)
      .json(
        prepareResponse(
          "SERVER_ERROR",
          "Payment verification failed",
          null,
          error.message
        )
      );
  }
};

exports.getPayments = async (req, res) => {
  try {
    const query = {};
    
    // Filter by userId if provided
    if (req.query.userId) {
      query.userId = req.query.userId;
    }
    
    // Filter by courseId if provided
    if (req.query.courseId) {
      query.courseId = req.query.courseId;
    }
    
    const payments = await Payment.find(query).populate("userId", "firstName lastName email").populate("courseId", "title").lean();
    res
      .status(httpRes.OK)
      .json(prepareResponse("SUCCESS", "Payments fetched", payments, null));
  } catch (error) {
    console.error("Get payments error:", error);
    res
      .status(httpRes.SERVER_ERROR)
      .json(
        prepareResponse("SERVER_ERROR", "Failed to fetch payments", null, error.message)
      );
  }
};
