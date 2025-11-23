const router = require("express").Router();
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const logger = require("../utils/logger");
const httpRes = require("../utils/http");
const { prepareResponse } = require("../utils/response");

// Serve files from GridFS
// This route handles /api/uploads/:filename (mounted at / in index.js which is mounted at /api)
router.get("/uploads/:filename", async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(httpRes.SERVER_ERROR).json(
        prepareResponse("SERVER_ERROR", "MongoDB connection not available", null, null)
      );
    }

    // Create GridFS bucket
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });

    // Find file by filename
    const files = await bucket.find({ filename: req.params.filename }).toArray();
    
    if (!files || files.length === 0) {
      return res.status(httpRes.NOT_FOUND).json(
        prepareResponse("NOT_FOUND", "File not found", null, null)
      );
    }

    const file = files[0];
    
    // Set appropriate headers
    res.set("Content-Type", file.contentType || "application/octet-stream");
    res.set("Content-Length", file.length);
    res.set("Content-Disposition", `inline; filename="${file.metadata?.originalName || file.filename}"`);

    // Stream file from GridFS
    const downloadStream = bucket.openDownloadStreamByName(req.params.filename);
    
    downloadStream.on("error", (error) => {
      logger.error("Error streaming file from GridFS:", error);
      if (!res.headersSent) {
        res.status(httpRes.SERVER_ERROR).json(
          prepareResponse("SERVER_ERROR", "Error streaming file", null, error.message)
        );
      }
    });

    downloadStream.pipe(res);
  } catch (error) {
    logger.error("Error serving file from GridFS:", error);
    res.status(httpRes.SERVER_ERROR).json(
      prepareResponse("SERVER_ERROR", "Error serving file", null, error.message)
    );
  }
});

// Get file info by filename
router.get("/file-info/:filename", async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(httpRes.SERVER_ERROR).json(
        prepareResponse("SERVER_ERROR", "MongoDB connection not available", null, null)
      );
    }

    // Create GridFS bucket
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });

    // Find file by filename
    const files = await bucket.find({ filename: req.params.filename }).toArray();
    
    if (!files || files.length === 0) {
      return res.status(httpRes.NOT_FOUND).json(
        prepareResponse("NOT_FOUND", "File not found", null, null)
      );
    }

    const file = files[0];
    const fileInfo = {
      id: file._id.toString(),
      filename: file.filename,
      contentType: file.contentType,
      length: file.length,
      uploadDate: file.uploadDate,
      metadata: file.metadata,
    };

    res.status(httpRes.OK).json(prepareResponse("OK", "File info retrieved", fileInfo, null));
  } catch (error) {
    logger.error("Error getting file info from GridFS:", error);
    res.status(httpRes.SERVER_ERROR).json(
      prepareResponse("SERVER_ERROR", "Error getting file info", null, error.message)
    );
  }
});

module.exports = router;

