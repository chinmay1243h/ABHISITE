const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
      enum: ['programming', 'design', 'business', 'marketing', 'music', 'art', 'film', 'soft-books', 'video', 'other', 'songs', 'video-non-copyrighted', 'poetry', 'lines-shayari', 'dialogue', 'movies', 'gameplay', 'walkthrough', 'tricks-tips', 'fan-art', 'tribute', 'series', 'documentary', 'journey'],
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    tags: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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
      required: false,
      default: null,
    },
    files: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "TelegramFile",
    }],
    telegramFileId: {
      type: String,
      default: null,
    },
    courseCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    accessCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    expirationDate: {
      type: Date,
      default: null,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isDraft: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
    },
    submittedForApproval: {
      type: Boolean,
      default: false,
    },
    adminApproved: {
      type: Boolean,
      default: false,
    },
    approvedAt: {
      type: Date,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    requirements: [{
      type: String,
      maxlength: 200,
    }],
    whatYouWillLearn: [{
      type: String,
      maxlength: 200,
    }],
  },
  {
    timestamps: true,
    collection: "courses",
  }
);

// Index for search functionality
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
courseSchema.index({ instructor: 1, isPublished: 1 });
courseSchema.index({ category: 1, level: 1 });

// Update publishedAt when course is published
courseSchema.pre('save', function(next) {
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
    this.isDraft = false;
  }
  next();
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;