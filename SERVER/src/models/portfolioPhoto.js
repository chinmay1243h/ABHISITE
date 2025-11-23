const mongoose = require("mongoose");

const portfolioPhotoSchema = new mongoose.Schema(
  {
    portfolioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
      index: true,
    },
    url: {
      type: String,
      maxlength: 255,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "portfolio_photos",
  }
);

const PortfolioPhoto = mongoose.model("PortfolioPhoto", portfolioPhotoSchema);

module.exports = PortfolioPhoto;