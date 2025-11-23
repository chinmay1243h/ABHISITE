const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    courseType: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
      default: null,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: String,
      required: true,
    },
    licenseType: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    expirationDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "courses",
  }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;