const mongoose = require('mongoose');

const telegramFileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    trim: true
  },
  originalName: {
    type: String,
    required: true,
    trim: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true,
    min: 0
  },
  telegramFileId: {
    type: String,
    required: true,
    unique: true
  },
  telegramMessageId: {
    type: Number,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  lastAccessed: {
    type: Date
  },
  metadata: {
    duration: Number, // for videos in seconds
    resolution: String, // for videos/images
    pages: Number, // for PDFs
    encoding: String,
    bitrate: Number // for audio/video
  },
  thumbnail: {
    telegramFileId: String,
    mimeType: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
telegramFileSchema.index({ uploadedBy: 1, course: 1 });
telegramFileSchema.index({ telegramFileId: 1 });
telegramFileSchema.index({ mimeType: 1 });

// Update lastAccessed when file is accessed
telegramFileSchema.methods.updateAccess = function() {
  this.lastAccessed = new Date();
  this.downloadCount += 1;
  return this.save();
};

module.exports = mongoose.model('TelegramFile', telegramFileSchema);
