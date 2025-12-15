const express = require("express");
const router = express.Router();
const { handleUpdate } = require("../controller/telegramBot.controller");
const logger = require("../utils/logger");

/**
 * POST /api/telegram/webhook
 * Long‑polling endpoint: receives updates from Telegram
 */
router.post("/webhook", async (req, res) => {
  try {
    const update = req.body;
    logger.info("Received Telegram update", JSON.stringify(update, null, 2));
    await handleUpdate(update);
    res.sendStatus(200);
  } catch (err) {
    logger.error("Error handling Telegram update:", err);
    res.sendStatus(500);
  }
});

/**
 * GET /api/telegram/botinfo
 * Simple health/info endpoint
 */
router.get("/botinfo", async (req, res) => {
  try {
    const { getMe } = require("../utils/telegramBot");
    const botInfo = await getMe();
    res.json({ ok: true, bot: botInfo.result });
  } catch (err) {
    logger.error("Failed to get bot info:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
