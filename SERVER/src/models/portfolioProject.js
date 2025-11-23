const mongoose = require("mongoose");

const portfolioProjectSchema = new mongoose.Schema(
  {
    portfolioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: null,
    },
    date: {
      type: String,
      default: null,
    },
    collaborators: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
    awards: {
      type: String,
      default: null,
    },
    imageFile: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "portfolio_projects",
  }
);

const PortfolioProject = mongoose.model("PortfolioProject", portfolioProjectSchema);

module.exports = PortfolioProject;