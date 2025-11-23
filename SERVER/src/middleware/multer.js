const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const logger = require("../utils/logger");
const mongoose = require("mongoose");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage variable - will be set to GridFS if MongoDB is connected, otherwise local
let storage = null;
let upload = null;

// Function to initialize storage - prioritize MongoDB GridFS
function initializeStorage() {
  // Check if MongoDB is connected AND database is available
  const isMongoReady = mongoose.connection.readyState === 1 && mongoose.connection.db;
  
  if (isMongoReady) {
    try {
      // Try GridFS - user wants MongoDB storage
      const GridFSStorage = require("./gridfs-storage");
      const { GridFSBucket } = require("mongodb");
      
      // Verify we can create a bucket
      const testBucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads",
      });
      
      if (testBucket && mongoose.connection.db) {
        storage = new GridFSStorage({ bucketName: "uploads" });
        logger.info("✅ Using MongoDB GridFS for file storage");
        
        // Recreate multer with GridFS storage
        upload = multer({
          storage: storage,
          limits: {
            fileSize: 10 * 1024 * 1024, // 10MB limit
          },
        });
        return;
      } else {
        logger.warn("⚠️ GridFS bucket creation failed, will use local storage");
      }
    } catch (error) {
      logger.warn("⚠️ GridFS initialization failed:", error.message);
      logger.warn("⚠️ Will use local storage as fallback");
      // Continue to local storage fallback
    }
  } else {
    logger.warn("⚠️ MongoDB not connected (state: " + mongoose.connection.readyState + ")");
    logger.info("ℹ️ Will use local storage - files will be stored in 'uploads' folder");
    logger.info("ℹ️ To use MongoDB GridFS, ensure MongoDB is connected before starting the server");
  }

  // ALWAYS fallback to local disk storage (most reliable)
  // This ensures uploads work even if MongoDB isn't connected
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const fileName = `${file.originalname}_${Date.now()}_${Math.round(
        Math.random() * 1e9
      )}${path.extname(file.originalname)}`;
      cb(null, fileName);
    },
  });
  logger.info("✅ Using local disk storage for files (uploads directory)");
  
  // Create multer with local storage
  upload = multer({
    storage: storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
  });
}

// Initialize storage immediately (will use local storage if MongoDB not ready)
initializeStorage();

// Re-initialize when MongoDB connects (switch to GridFS)
mongoose.connection.on("connected", () => {
  setTimeout(() => {
    // Wait a bit for MongoDB to be fully ready
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      try {
        const GridFSStorage = require("./gridfs-storage");
        // Check if we're not already using GridFS
        if (!storage || !(storage instanceof GridFSStorage)) {
          logger.info("🔄 MongoDB connected - switching to GridFS storage");
          initializeStorage(); // Re-initialize to use GridFS
          
          // Update the module exports to use new upload instance
          if (typeof module.exports.updateUpload === 'function') {
            module.exports.updateUpload();
          }
          
          logger.info("✅ Successfully switched to MongoDB GridFS storage");
        }
      } catch (error) {
        logger.warn("⚠️ Failed to switch to GridFS after connection:", error.message);
        logger.info("ℹ️ Will continue using local storage");
      }
    }
  }, 2000); // Wait 2 seconds for MongoDB to be fully ready
});

// Export the upload middleware
// This will be updated when MongoDB connects
module.exports = upload;

// Function to get current upload instance (used for dynamic updates)
module.exports.updateUpload = function() {
  upload = multer({
    storage: storage,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });
  // Update module.exports methods
  Object.keys(upload).forEach(key => {
    if (typeof upload[key] === 'function') {
      module.exports[key] = upload[key].bind(upload);
    } else {
      module.exports[key] = upload[key];
    }
  });
};
