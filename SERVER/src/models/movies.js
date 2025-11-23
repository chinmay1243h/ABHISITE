const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    poster: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      default: null,
    },
    duration: {
      type: String,
      default: null,
    },
    rating: {
      type: String,
      default: null,
    },
    age: {
      type: String,
      default: null,
    },
    overview: {
      type: String,
      default: null,
    },
    plot: {
      type: String,
      default: null,
    },
    starring: {
      type: String,
      default: null,
    },
    creators: {
      type: String,
      default: null,
    },
    directors: {
      type: String,
      default: null,
    },
    writers: {
      type: String,
      default: null,
    },
    producers: {
      type: String,
      default: null,
    },
    dop: {
      type: String,
      default: null,
    },
    music: {
      type: String,
      default: null,
    },
    genre: {
      type: String,
      default: null,
    },
    trailer: {
      type: String,
      default: null,
    },
    images: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "movies",
  }
);

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;