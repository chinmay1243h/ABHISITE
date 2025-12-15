require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const { startPolling } = require("../utils/telegramPoller");

console.log("Launching Telegram bot poller...");
startPolling();
