const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
      required: true,
    },
    responsibilities: {
      type: String,
      required: true,
    },
    qualifications: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
      maxlength: 255,
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time"],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "jobpostings",
  }
);

const JobPosting = mongoose.model("JobPosting", jobSchema);

module.exports = JobPosting;