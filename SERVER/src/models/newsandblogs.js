const mongoose = require("mongoose");

const newsAndBlogsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    thumbnail: {
      type: String,
      default: null,
      required: false, // Thumbnail is now optional
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["photo", "video"],
      required: true,
    },
    newsType: {
      type: String,
      enum: [
        "Hero Section",
        "Trending News",
        "comic",
        "series",
        "movie",
        "podcast",
        "game",
        "Culture & Lifestyle",
        "Trending News Video",
      ],
      required: true,
    },
    videoUrl: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "newsandblogs",
  }
);

const NewsAndBlogs = mongoose.model("NewsAndBlogs", newsAndBlogsSchema);

module.exports = NewsAndBlogs;