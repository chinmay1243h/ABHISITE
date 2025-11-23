const express = require("express");
const {
  createOrder,
  verifyPayment,
  getPayments,
} = require("../controller/razorpay.xontroller"); // Note: File is named with typo, keeping import as-is
const { prepareBody } = require("../utils/response");

const router = express.Router();

router.route("/orders").post(prepareBody, createOrder);
router.route("/verify").post(prepareBody, verifyPayment);
router.get("/payments", getPayments);

module.exports = router;
