const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    channel: {
      type: String,
      enum: ["web", "telegram"],
      required: true,
      default: "web",
    },
    provider: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      required: true,
      default: "PENDING",
    },
    telegram: {
      paymentId: { type: String, default: null },
      providerChargeId: { type: String, default: null },
      rawPayload: { type: mongoose.Schema.Types.Mixed, default: null },
    },
  },
  {
    timestamps: true,
    collection: "transactions",
  }
);

transactionSchema.index({ orderId: 1 });
transactionSchema.index({ userId: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ channel: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
