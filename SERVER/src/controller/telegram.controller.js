const telegramService = require("../service/telegram.service");
const { prepareResponse } = require("../utils/response");
const httpRes = require("../utils/http");
const multer = require("multer");
const logger = require("../utils/logger");

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * Upload file to Telegram
 */
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(httpRes.BAD_REQUEST)
        .json(
          prepareResponse("BAD_REQUEST", "No file provided", null, null)
        );
    }

    const fileId = await telegramService.uploadToTelegram(
      req.file.buffer,
      req.file.originalname
    );

    res
      .status(httpRes.OK)
      .json(
        prepareResponse("OK", "File uploaded to Telegram successfully", { fileId }, null)
      );
  } catch (error) {
    logger.error("Telegram upload error:", error);
    res
      .status(httpRes.SERVER_ERROR)
      .json(
        prepareResponse("SERVER_ERROR", "Failed to upload file to Telegram", null, error.message)
      );
  }
};

/**
 * Get Telegram file URL
 */
exports.getFileUrl = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return res
        .status(httpRes.BAD_REQUEST)
        .json(
          prepareResponse("BAD_REQUEST", "File ID is required", null, null)
        );
    }

    const fileUrl = await telegramService.getTelegramFileUrl(fileId);

    res
      .status(httpRes.OK)
      .json(
        prepareResponse("OK", "File URL retrieved successfully", { fileUrl }, null)
      );
  } catch (error) {
    logger.error("Get Telegram file URL error:", error);
    res
      .status(httpRes.SERVER_ERROR)
      .json(
        prepareResponse("SERVER_ERROR", "Failed to get file URL", null, error.message)
      );
  }
};

/**
 * Send message to Telegram
 */
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res
        .status(httpRes.BAD_REQUEST)
        .json(
          prepareResponse("BAD_REQUEST", "Message is required", null, null)
        );
    }

    const result = await telegramService.sendMessage(message);

    res
      .status(httpRes.OK)
      .json(
        prepareResponse("OK", "Message sent to Telegram successfully", result, null)
      );
  } catch (error) {
    logger.error("Send Telegram message error:", error);
    res
      .status(httpRes.SERVER_ERROR)
      .json(
        prepareResponse("SERVER_ERROR", "Failed to send message", null, error.message)
      );
  }
};

// Export multer upload middleware for use in routes
exports.upload = upload.single("file");



