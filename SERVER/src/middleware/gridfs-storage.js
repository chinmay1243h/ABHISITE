const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const logger = require("../utils/logger");

// GridFS storage engine for multer
class GridFSStorage {
  constructor(options = {}) {
    this.bucketName = options.bucketName || "uploads";
    this.bucket = null;
    this._initBucket();
  }

  // Initialize GridFS bucket
  _initBucket() {
    // Wait for MongoDB connection if not ready
    if (mongoose.connection.readyState === 1) {
      try {
        this.bucket = new GridFSBucket(mongoose.connection.db, {
          bucketName: this.bucketName,
        });
        logger.info(`GridFS bucket '${this.bucketName}' initialized`);
      } catch (error) {
        logger.error("Failed to initialize GridFS bucket:", error);
      }
    } else {
      // Wait for connection
      mongoose.connection.once("connected", () => {
        try {
          this.bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: this.bucketName,
          });
          logger.info(`GridFS bucket '${this.bucketName}' initialized`);
        } catch (error) {
          logger.error("Failed to initialize GridFS bucket:", error);
        }
      });
    }
  }

  // Get bucket instance
  getBucket() {
    if (!this.bucket && mongoose.connection.readyState === 1) {
      try {
        this.bucket = new GridFSBucket(mongoose.connection.db, {
          bucketName: this.bucketName,
        });
      } catch (error) {
        logger.error("Failed to get GridFS bucket:", error);
      }
    }
    return this.bucket;
  }

  // Multer storage engine methods
  _handleFile(req, file, cb) {
    try {
      // Check if MongoDB is connected
      if (mongoose.connection.readyState !== 1) {
        const errorMsg = "MongoDB connection not available. GridFS cannot be used. Connection state: " + mongoose.connection.readyState;
        logger.error(errorMsg);
        return cb(new Error(errorMsg));
      }

      // Check if database is available
      if (!mongoose.connection.db) {
        const errorMsg = "MongoDB database not available. GridFS cannot be used.";
        logger.error(errorMsg);
        return cb(new Error(errorMsg));
      }

      const bucket = this.getBucket();
      
      if (!bucket) {
        const errorMsg = "GridFS bucket not available. Database might not be initialized.";
        logger.error(errorMsg);
        return cb(new Error(errorMsg));
      }

      // Generate unique filename
      const filename = `${Date.now()}_${Math.round(Math.random() * 1e9)}_${file.originalname}`;
      
      // Collect all chunks for the file
      const chunks = [];
      let totalSize = 0;
      let streamEnded = false;
      let hasError = false;

      // Handle file stream
      file.stream.on("data", (chunk) => {
        if (!hasError) {
          chunks.push(chunk);
          totalSize += chunk.length;
        }
      });

      file.stream.on("error", (error) => {
        if (!hasError) {
          hasError = true;
          logger.error("File stream error:", error);
          cb(error);
        }
      });

      file.stream.on("end", () => {
        if (streamEnded || hasError) return;
        streamEnded = true;

        try {
          // Create buffer from chunks
          const buffer = Buffer.concat(chunks);
          
          // Create write stream
          const uploadStream = bucket.openUploadStream(filename, {
            contentType: file.mimetype || "application/octet-stream",
            metadata: {
              originalName: file.originalname,
              uploadedAt: new Date(),
              size: totalSize,
            },
          });

          // Handle errors
          uploadStream.on("error", (error) => {
            if (!hasError) {
              hasError = true;
              logger.error("GridFS upload error:", error);
              cb(error);
            }
          });

          // Handle completion
          uploadStream.on("finish", () => {
            if (hasError) return;
            const fileInfo = {
              id: uploadStream.id.toString(),
              filename: filename,
              bucketName: this.bucketName,
              contentType: file.mimetype || "application/octet-stream",
              size: totalSize,
              originalName: file.originalname,
            };
            logger.info(`File uploaded to GridFS: ${filename} (ID: ${fileInfo.id}, Size: ${totalSize} bytes)`);
            cb(null, fileInfo);
          });

          // Write buffer to GridFS
          uploadStream.write(buffer);
          uploadStream.end();
        } catch (error) {
          if (!hasError) {
            hasError = true;
            logger.error("Error processing file for GridFS:", error);
            cb(error);
          }
        }
      });
    } catch (error) {
      logger.error("GridFS storage _handleFile error:", error);
      cb(error);
    }
  }

  _removeFile(req, file, cb) {
    if (!file || !file.id) {
      return cb(null); // No file to remove
    }

    const bucket = this.getBucket();
    
    if (!bucket) {
      return cb(new Error("GridFS bucket not available"));
    }

    // Delete file from GridFS
    try {
      // Convert string id to ObjectId
      const ObjectId = require("mongodb").ObjectId;
      const fileId = typeof file.id === 'string' ? new ObjectId(file.id) : file.id;
      
      bucket.delete(fileId, (error) => {
        if (error) {
          logger.error("GridFS delete error:", error);
          // Don't fail the request if delete fails
          return cb(null);
        }
        logger.info(`File deleted from GridFS: ${file.id}`);
        cb(null);
      });
    } catch (error) {
      logger.error("Error deleting file from GridFS:", error);
      cb(null); // Don't fail the request
    }
  }
}

module.exports = GridFSStorage;

