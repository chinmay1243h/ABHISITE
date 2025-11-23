const mongoose = require("mongoose");

const portfolioAchievementSchema = new mongoose.Schema(
  {
    portfolioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
      index: true,
    },
    achievements: {
      type: [
        {
          title: String,
          description: String,
          date: Date,
        },
      ],
      default: [],
    },
    testimonies: {
      type: [
        {
          name: String,
          role: String,
          company: String,
          message: String,
          rating: Number,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "portfolio_achievements",
  }
);

const PortfolioAchievement = mongoose.model("PortfolioAchievement", portfolioAchievementSchema);

module.exports = PortfolioAchievement;