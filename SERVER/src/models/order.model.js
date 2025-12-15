const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
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
    status: {
      type: String,
      enum: ["CREATED", "PENDING_PAYMENT", "PAID", "FAILED", "CANCELLED"],
      default: "CREATED",
    },
    source: {
      type: String,
      enum: ["web", "telegram"],
      required: true,
      default: "web",
    },
    telegram: {
      userId: { type: Number, default: null },
      chatId: { type: Number, default: null },
      invoiceMessageId: { type: Number, default: null },
      paymentId: { type: String, default: null },
    },
  },
  {
    timestamps: true,
    collection: "orders",
  }
);

// Indexes
// orderNumber index is automatically created by unique: true in schema definition
orderSchema.index({ userId: 1 });
orderSchema.index({ productId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ source: 1 });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
