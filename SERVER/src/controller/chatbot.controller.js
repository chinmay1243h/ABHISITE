const axios = require("axios");
const { prepareResponse } = require("../utils/response");
const httpRes = require("../utils/http");
const logger = require("../utils/logger");

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const buildMessages = (history = [], message) => {
  const sanitizedHistory = Array.isArray(history)
    ? history
        .filter((item) => item && item.role && item.content)
        .slice(-10)
    : [];

  return [
    {
      role: "system",
      content:
        "You are the Liv Abhi platform assistant. Help users with courses, movies, jobs, and general support questions about Liv Abhi. Keep answers concise and friendly.",
    },
    ...sanitizedHistory,
    { role: "user", content: message },
  ];
};

exports.getChatResponse = async (req, res) => {
  try {
    const { message, history } = req.body || {};

    if (!message || typeof message !== "string") {
      return res
        .status(httpRes.BAD_REQUEST)
        .json(prepareResponse("BAD_REQUEST", "Message is required", null, null));
    }

    if (!process.env.GROQ_API_KEY) {
      return res
        .status(httpRes.SERVER_ERROR)
        .json(
          prepareResponse(
            "SERVER_ERROR",
            "Chatbot is not configured. Missing Groq API key",
            null,
            "Missing GROQ_API_KEY"
          )
        );
    }

    const payload = {
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      messages: buildMessages(history, message),
      temperature: 0.4,
      max_tokens: 512,
    };

    const response = await axios.post(GROQ_API_URL, payload, {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const reply = response?.data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error("Groq API returned an empty response");
    }

    return res
      .status(httpRes.OK)
      .json(prepareResponse("OK", "Chatbot response generated", { reply }, null));
  } catch (error) {
    logger.error("Groq chatbot error:", error?.response?.data || error.message);
    const status =
      error?.response?.status === 401 ? httpRes.UNAUTHORIZED : httpRes.SERVER_ERROR;
    return res
      .status(status)
      .json(
        prepareResponse(
          "SERVER_ERROR",
          "Failed to generate chatbot response",
          null,
          error?.message || error.toString()
        )
      );
  }
};
