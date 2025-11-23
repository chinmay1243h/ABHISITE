const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "videos",
  }
);

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;