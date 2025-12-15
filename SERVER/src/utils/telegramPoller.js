const axios = require("axios");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../../.env") });

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

if (!TELEGRAM_BOT_TOKEN) {
  console.error("TELEGRAM_BOT_TOKEN is not set. Telegram polling will not start.");
  process.exit(1);
}

let offset = null;
let isPolling = true;
const POLL_INTERVAL_MS = 2000; // 2 seconds between requests
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

/**
 * Start long‑polling for Telegram updates
 */
async function startPolling() {
  console.log("🤖 Starting Telegram bot long‑polling...");
  while (isPolling) {
    try {
      const updates = await getUpdates(offset);
      if (updates && updates.length > 0) {
        // Forward each update to our webhook handler
        for (const update of updates) {
          try {
            await axios.post(`${BASE_URL}/api/telegram/webhook`, update, {
              headers: { "Content-Type": "application/json" },
            });
            offset = update.update_id + 1;
          } catch (forwardErr) {
            console.error("Failed to forward update to webhook:", forwardErr.message);
          }
        }
      }
      // Wait before next poll
      await sleep(POLL_INTERVAL_MS);
    } catch (err) {
      console.error("Telegram polling error:", err.message);
      // Exponential back‑off with retries
      let retries = 0;
      while (retries < MAX_RETRIES && isPolling) {
        console.log(`Retrying in ${RETRY_DELAY_MS * (retries + 1)}ms...`);
        await sleep(RETRY_DELAY_MS * (retries + 1));
        try {
          const updates = await getUpdates(offset);
          if (updates) {
            retries = 0;
            break;
          }
        } catch (retryErr) {
          retries++;
          if (retries >= MAX_RETRIES) {
            console.error("Max retries reached. Stopping polling.");
            isPolling = false;
          }
        }
      }
    }
  }
  console.log("Telegram polling stopped.");
}

/**
 * Fetch updates from Telegram getUpdates API
 */
async function getUpdates(offset) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`;
  const params = { timeout: 30 };
  if (offset) params.offset = offset;
  const res = await axios.get(url, { params });
  if (res.data.ok) {
    return res.data.result;
  } else {
    throw new Error(res.data.description || "getUpdates failed");
  }
}

/**
 * Utility: sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Graceful shutdown
 */
function stopPolling() {
  console.log("Stopping Telegram polling...");
  isPolling = false;
}

// Handle SIGINT/SIGTERM for graceful shutdown
process.on("SIGINT", () => {
  stopPolling();
  process.exit(0);
});

process.on("SIGTERM", () => {
  stopPolling();
  process.exit(0);
});

// Start polling if this file is run directly
if (require.main === module) {
  startPolling();
}

module.exports = { startPolling, stopPolling };
