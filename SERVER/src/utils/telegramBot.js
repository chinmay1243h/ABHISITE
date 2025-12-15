const axios = require("axios");
require("dotenv").config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_SUPPORT_GROUP_ID = process.env.TELEGRAM_SUPPORT_GROUP_ID || null;

if (!TELEGRAM_BOT_TOKEN) {
  console.error("TELEGRAM_BOT_TOKEN is not set in environment variables");
  process.exit(1);
}

const botApi = axios.create({
  baseURL: `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`,
});

/**
 * Send a message to a Telegram chat
 */
async function sendMessage(chatId, text, options = {}) {
  try {
    const payload = { chat_id: chatId, text, ...options };
    const res = await botApi.post("/sendMessage", payload);
    return res.data;
  } catch (err) {
    console.error("sendMessage error:", err.response?.data || err.message);
    throw err;
  }
}

/**
 * Send a photo (with optional caption) to a Telegram chat
 */
async function sendPhoto(chatId, photo, caption = null, options = {}) {
  try {
    const payload = { chat_id: chatId, photo };
    if (caption) payload.caption = caption;
    Object.assign(payload, options);
    const res = await botApi.post("/sendPhoto", payload);
    return res.data;
  } catch (err) {
    console.error("sendPhoto error:", err.response?.data || err.message);
    throw err;
  }
}

/**
 * Send a document to a Telegram chat
 */
async function sendDocument(chatId, document, caption = null, options = {}) {
  try {
    const payload = { chat_id: chatId, document };
    if (caption) payload.caption = caption;
    Object.assign(payload, options);
    const res = await botApi.post("/sendDocument", payload);
    return res.data;
  } catch (err) {
    console.error("sendDocument error:", err.response?.data || err.message);
    throw err;
  }
}

/**
 * Send an invoice (Telegram payment)
 */
async function sendInvoice(chatId, invoice) {
  try {
    const payload = { chat_id: chatId, ...invoice };
    const res = await botApi.post("/sendInvoice", payload);
    return res.data;
  } catch (err) {
    console.error("sendInvoice error:", err.response?.data || err.message);
    throw err;
  }
}

/**
 * Download a file from Telegram by file_id
 */
async function downloadFile(fileId) {
  try {
    const getFileRes = await botApi.get("/getFile", { params: { file_id: fileId } });
    const filePath = getFileRes.data.result.file_path;
    const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
    const fileRes = await axios.get(fileUrl, { responseType: "arraybuffer" });
    return fileRes.data;
  } catch (err) {
    console.error("downloadFile error:", err.response?.data || err.message);
    throw err;
  }
}

/**
 * Get file URL from file_id (for serving via your backend)
 */
function getFileUrl(fileId) {
  return `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${fileId}`;
}

/**
 * Get bot info
 */
async function getMe() {
  try {
    const res = await botApi.get("/getMe");
    return res.data;
  } catch (err) {
    console.error("getMe error:", err.response?.data || err.message);
    throw err;
  }
}

/**
 * Set webhook (if you later switch to webhook mode)
 */
async function setWebhook(url) {
  try {
    const res = await botApi.post("/setWebhook", { url });
    return res.data;
  } catch (err) {
    console.error("setWebhook error:", err.response?.data || err.message);
    throw err;
  }
}

/**
 * Helper: build inline keyboard
 */
function buildInlineKeyboard(buttons) {
  return {
    inline_keyboard: buttons.map(row => 
      row.map(btn => ({ text: btn.text, callback_data: btn.callback_data, url: btn.url }))
    ),
  };
}

/**
 * Helper: build reply keyboard
 */
function buildReplyKeyboard(buttons, options = {}) {
  return {
    keyboard: buttons,
    resize_keyboard: true,
    one_time_keyboard: options.one_time_keyboard || false,
    selective: options.selective || false,
  };
}

module.exports = {
  sendMessage,
  sendPhoto,
  sendDocument,
  sendInvoice,
  downloadFile,
  getFileUrl,
  getMe,
  setWebhook,
  buildInlineKeyboard,
  buildReplyKeyboard,
  TELEGRAM_SUPPORT_GROUP_ID,
};
