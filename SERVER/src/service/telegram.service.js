const axios = require("axios");
require("dotenv").config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN) {
  console.warn("Warning: TELEGRAM_BOT_TOKEN is not set in environment variables");
}

if (!TELEGRAM_CHAT_ID) {
  console.warn("Warning: TELEGRAM_CHAT_ID is not set in environment variables");
}

/**
 * Upload file to Telegram
 * @param {Buffer|File} file - File buffer or file object
 * @param {string} filename - Name of the file
 * @returns {Promise<string>} - File ID from Telegram
 */
const uploadToTelegram = async (file, filename = "file") => {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error("Telegram bot token or chat ID is not configured");
    }

    const FormData = require("form-data");
    const formData = new FormData();

    formData.append("chat_id", TELEGRAM_CHAT_ID);
    formData.append("document", file, {
      filename: filename,
    });

    // Upload the file to Telegram
    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`,
      formData,
      {
        headers: formData.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    if (response.data.ok) {
      const result = response.data.result;

      // Extract the file ID dynamically
      const fileId =
        result.document?.file_id ||
        result.video?.file_id ||
        result.audio?.file_id ||
        result.photo?.[result.photo.length - 1]?.file_id;

      if (!fileId) {
        throw new Error("File ID is missing in the response.");
      }

      return fileId; // Return only the file ID
    } else {
      throw new Error(
        `Failed to upload to Telegram: ${response.data.description || "Unknown error"}`
      );
    }
  } catch (error) {
    console.error("Error uploading to Telegram:", error?.response?.data || error.message);
    throw error;
  }
};

/**
 * Get file URL from Telegram file ID
 * @param {string} fileId - File ID from Telegram
 * @returns {Promise<string>} - Download URL for the file
 */
const getTelegramFileUrl = async (fileId) => {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      throw new Error("Telegram bot token is not configured");
    }

    const response = await axios.get(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`
    );

    if (!response.data.ok) {
      throw new Error("Failed to fetch file URL from Telegram");
    }

    const filePath = response.data.result.file_path;
    return `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
  } catch (error) {
    console.error("Error getting Telegram file URL:", error?.response?.data || error.message);
    throw error;
  }
};

/**
 * Send message to Telegram chat
 * @param {string} message - Message text
 * @returns {Promise<object>} - Telegram API response
 */
const sendMessage = async (message) => {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error("Telegram bot token or chat ID is not configured");
    }

    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error sending message to Telegram:", error?.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  uploadToTelegram,
  getTelegramFileUrl,
  sendMessage,
};



