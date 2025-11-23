const mongoose = require("mongoose");

const portfolioContactSchema = new mongoose.Schema(
  {
    portfolioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "portfolio_contacts",
  }
);

const PortfolioContact = mongoose.model("PortfolioContact", portfolioContactSchema);

module.exports = PortfolioContact;