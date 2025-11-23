const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    name: {
      type: String,
      default: null,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 255,
    },
  },
  {
    timestamps: true,
    collection: "comments",
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;