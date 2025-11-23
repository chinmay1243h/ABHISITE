const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      default: null,
    },
    tagline: {
      type: String,
      maxlength: 50,
      default: null,
    },
    about: {
      type: String,
      default: null,
    },
    coverPhoto: {
      type: String,
      default: null,
    },
    profileImage: {
      type: String,
      default: null,
    },
    experienceOverview: {
      type: String,
      default: null,
    },
    artistCategory: {
      type: String,
      default: null,
    },
    experience: {
      type: [
        {
          title: String,
          dateRange: {
            from: Number,
            to: Number,
          },
          description: String,
        },
      ],
      default: [],
    },
    education: {
      type: [
        {
          degree: String,
          instituteName: String,
          year: Number,
          location: String,
        },
      ],
      default: [],
    },
    socialLinks: {
      type: {
        facebook: String,
        instagram: String,
        twitter: String,
        linkedin: String,
        youtube: String,
        website: String,
      },
      default: {},
    },
  },
  {
    timestamps: true,
    collection: "portfolios",
  }
);

portfolioSchema.index({ userId: 1 }, { unique: true });

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

module.exports = Portfolio;