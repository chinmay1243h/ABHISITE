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
    telegram: {
      userId: { type: Number, default: null },
      chatId: { type: Number, default: null },
      username: { type: String, default: null },
      linkedAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// Indexes
// Email index is automatically created by unique: true in schema definition
userSchema.index({ firstName: 1 });
userSchema.index({ status: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;