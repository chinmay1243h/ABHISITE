const router = require("express").Router();
const { prepareBody } = require("../utils/response");
const { getChatResponse } = require("../controller/chatbot.controller");

router.post("/ask", prepareBody, getChatResponse);

module.exports = router;
