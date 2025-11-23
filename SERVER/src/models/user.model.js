const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 100,
    },
    password: {
      type: String,
      required: true,
      maxlength: 100,
    },
    role: {
      type: String,
      enum: ["User", "Artist", "Business", "Admin"],
      default: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Created", "Varified"],
      default: "Created",
      required: true,
    },
    profileImage: {
      type: String,
      default: null,
      maxlength: 300,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ firstName: 1 });
userSchema.index({ status: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;