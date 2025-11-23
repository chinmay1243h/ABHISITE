const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    pageCount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "pdfs",
  }
);

const Pdf = mongoose.model("Pdf", pdfSchema);

module.exports = Pdf;