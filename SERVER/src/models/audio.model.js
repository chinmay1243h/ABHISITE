const mongoose = require("mongoose");

const audioSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    audioUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "audios",
  }
);

const Audio = mongoose.model("Audio", audioSchema);

module.exports = Audio;