const {
  sendMessage,
  sendPhoto,
  sendDocument,
  sendInvoice,
  downloadFile,
  buildInlineKeyboard,
  buildReplyKeyboard,
} = require("../utils/telegramBot");
const session = require("../utils/telegramSession");
const User = require("../models/user.model");
const Course = require("../models/course.model");
const Order = require("../models/order.model");
const Transaction = require("../models/transaction.model");
const queryService = require("../service/query.service");
const logger = require("../utils/logger");

/**
 * Main handler for Telegram updates (long polling)
 */
async function handleUpdate(update) {
  const message = update.message || update.callback_query?.message || update.pre_checkout_query?.message;
  if (!message) return;

  const chatId = message.chat.id;
  const from = message.from;

  // Basic logging
  logger.info("Telegram update", JSON.stringify({ chatId, from, update }, null, 2));

  // Identify user
  let user;
  if (from.username) {
    user = await User.findOne({ "telegram.username": from.username });
  }
  if (!user) {
    user = await User.findOne({ "telegram.userId": from.id });
  }
  if (!user) {
    // Try to match by email if they ever set it in Telegram profile; else fallback to generic
    // For now, we treat unknown users as unregistered
    await sendMessage(chatId, "You’re not registered as an artist. Please sign up on the website first and connect Telegram in your profile.");
    return;
  }

  // Store telegram linkage if missing
  if (!user.telegram || !user.telegram.userId) {
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          telegram: {
            userId: from.id,
            chatId,
            username: from.username,
            linkedAt: new Date(),
          },
        },
      }
    );
    user.telegram = { userId: from.id, chatId, username: from.username, linkedAt: new Date() };
  }

  // Route by command or callback
  if (message.text) {
    await handleTextMessage(chatId, message.text, user);
  } else if (message.photo || message.document || message.video || message.audio) {
    await handleMedia(chatId, message, user);
  } else if (update.callback_query) {
    await handleCallbackQuery(update.callback_query, user);
  } else if (update.pre_checkout_query) {
    await handlePreCheckoutQuery(update.pre_checkout_query, user);
  } else if (update.message?.successful_payment) {
    await handleSuccessfulPayment(update.message.successful_payment, user);
  }
}

/**
 * Handle text commands
 */
async function handleTextMessage(chatId, text, user) {
  const trimmed = text.trim();

  if (trimmed === "/start") {
    await sendMessage(chatId, `Hi ${user.firstName}! Use /upload to submit a new artwork, /myproducts to view your products.`);
    return;
  }

  if (trimmed === "/upload") {
    await startUploadFlow(chatId, user);
    return;
  }

  if (trimmed === "/myproducts") {
    await showMyProducts(chatId, user);
    return;
  }

  // If in upload flow, treat as input
  const sess = session.get(user.telegram.userId);
  if (sess) {
    await handleUploadInput(chatId, trimmed, sess, user);
  } else {
    await sendMessage(chatId, "Unknown command. Use /start to see options.");
  }
}

/**
 * Begin upload flow
 */
async function startUploadFlow(chatId, user) {
  // Clear any existing session
  session.clear(user.telegram.userId);

  // Ask for product type
  const keyboard = buildReplyKeyboard([
    [{ text: "🖼 Image" }, { text: "🎥 Video" }, { text: "📄 Other (PDF/ZIP)" }],
  ]);
  await sendMessage(chatId, "What do you want to upload?\n1️⃣ Image\n2️⃣ Video\n3️⃣ Other (e.g., ZIP, PDF)", { reply_markup: keyboard });

  session.set(user.telegram.userId, {
    state: "AWAITING_MEDIA_TYPE",
    artistId: user._id.toString(),
  });
}

/**
 * Handle media upload (photo/video/document)
 */
async function handleMedia(chatId, message, user) {
  const sess = session.get(user.telegram.userId);
  if (!sess || sess.state !== "AWAITING_MEDIA") {
    await sendMessage(chatId, "Please start an upload with /upload first.");
    return;
  }

  let fileObj, mimeType, originalName;
  if (message.photo) {
    // Telegram provides multiple sizes; we take the largest (last)
    const photo = message.photo[message.photo.length - 1];
    fileObj = { file_id: photo.file_id };
    mimeType = "image/jpeg";
    originalName = `photo_${photo.file_id}.jpg`;
  } else if (message.document) {
    fileObj = { file_id: message.document.file_id };
    mimeType = message.document.mime_type;
    originalName = message.document.file_name;
  } else if (message.video) {
    fileObj = { file_id: message.video.file_id };
    mimeType = "video/mp4";
    originalName = `video_${message.video.file_id}.mp4`;
  } else if (message.audio) {
    fileObj = { file_id: message.audio.file_id };
    mimeType = "audio/mpeg";
    originalName = `audio_${message.audio.file_id}.mp3`;
  } else {
    await sendMessage(chatId, "Unsupported file type. Please send an image, video, or document.");
    return;
  }

  session.update(user.telegram.userId, {
    state: "AWAITING_TITLE",
    media: {
      telegramFileId: fileObj.file_id,
      originalName,
      mimeType,
      size: message.photo ? null : (message.document?.file_size || message.video?.file_size || message.audio?.file_size),
    },
  });

  await sendMessage(chatId, "Great! Now send the title of this artwork.");
}

/**
 * Handle step-by-step input during upload flow
 */
async function handleUploadInput(chatId, input, sess, user) {
  switch (sess.state) {
    case "AWAITING_MEDIA_TYPE": {
      const type = input.toLowerCase();
      if (type.includes("image")) {
        session.update(user.telegram.userId, { state: "AWAITING_MEDIA", productType: "image" });
        await sendMessage(chatId, "Please send the image file now.");
      } else if (type.includes("video")) {
        session.update(user.telegram.userId, { state: "AWAITING_MEDIA", productType: "video" });
        await sendMessage(chatId, "Please send the video file now.");
      } else if (type.includes("other") || type.includes("pdf") || type.includes("zip")) {
        session.update(user.telegram.userId, { state: "AWAITING_MEDIA", productType: "other" });
        await sendMessage(chatId, "Please send the document (PDF/ZIP) now.");
      } else {
        await sendMessage(chatId, "Please choose one of the options: Image, Video, or Other.");
      }
      break;
    }

    case "AWAITING_TITLE": {
      session.update(user.telegram.userId, { state: "AWAITING_DESCRIPTION", title: input });
      await sendMessage(chatId, "Please send a short description (max 300 characters).");
      break;
    }

    case "AWAITING_DESCRIPTION": {
      if (input.length > 300) {
        await sendMessage(chatId, "Description is too long. Please keep it under 300 characters.");
        return;
      }
      session.update(user.telegram.userId, { state: "AWAITING_PRICE", description: input });
      await sendMessage(chatId, "Enter the price (in INR), numbers only. Example: 499");
      break;
    }

    case "AWAITING_PRICE": {
      const price = Number(input);
      if (!Number.isInteger(price) || price < 0) {
        await sendMessage(chatId, "Invalid price. Enter a positive number (e.g., 499).");
        return;
      }
      session.update(user.telegram.userId, { state: "AWAITING_CATEGORY", price, currency: "INR" });
      await sendMessage(chatId, "Enter category (e.g., Abstract, Portrait, Landscape) or choose from buttons.", {
        reply_markup: buildReplyKeyboard([
          [{ text: "Abstract" }, { text: "Portrait" }, { text: "Landscape" }],
        ]),
      });
      break;
    }

    case "AWAITING_CATEGORY": {
      session.update(user.telegram.userId, { state: "AWAITING_STOCK", category: input });
      await sendMessage(chatId, "How many copies are available? (Enter a number, or 0 for unlimited digital copies.)");
      break;
    }

    case "AWAITING_STOCK": {
      const stock = Number(input);
      if (!Number.isInteger(stock) || stock < 0) {
        await sendMessage(chatId, "Invalid stock. Enter 0 (unlimited) or a positive number.");
        return;
      }
      session.update(user.telegram.userId, { state: "AWAITING_CONFIRMATION", stock });
      await sendSummaryAndConfirm(chatId, sess, user);
      break;
    }

    default:
      await sendMessage(chatId, "I don’t understand that right now. Use /upload to start over.");
  }
}

/**
 * Show summary and ask for confirmation
 */
async function sendSummaryAndConfirm(chatId, sess, user) {
  const { title, description, price, category, stock } = sess;
  const media = sess.media;
  let preview = "";
  if (media && media.telegramFileId) {
    if (media.mimeType.startsWith("image/")) {
      await sendPhoto(chatId, media.telegramFileId, "Preview:");
    } else {
      await sendDocument(chatId, media.telegramFileId, "Preview:");
    }
  }
  const summary = `*Title*: ${title}\n*Description*: ${description}\n*Price*: ₹${price}\n*Category*: ${category}\n*Stock*: ${stock === 0 ? "Unlimited (digital)" : stock + " copies"}`;
  const keyboard = buildInlineKeyboard([
    [{ text: "✅ Confirm & Publish", callback_data: "confirm_upload" }],
    [{ text: "❌ Cancel", callback_data: "cancel_upload" }],
  ]);
  await sendMessage(chatId, summary, { parse_mode: "Markdown", reply_markup: keyboard });
}

/**
 * Handle callback queries (inline button presses)
 */
async function handleCallbackQuery(query, user) {
  const chatId = query.message.chat.id;
  const data = query.data;

  // Acknowledge callback
  await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
    callback_query_id: query.id,
  });

  if (data === "confirm_upload") {
    await finalizeUpload(chatId, user);
  } else if (data === "cancel_upload") {
    session.clear(user.telegram.userId);
    await sendMessage(chatId, "Upload cancelled. Use /upload to start again.");
  } else if (data.startsWith("buy_")) {
    const productId = data.replace("buy_", "");
    await handleBuyRequest(chatId, productId, user);
  } else {
    await sendMessage(chatId, "Unknown action.");
  }
}

/**
 * Finalize upload: download file, store in GridFS, create Course record
 */
async function finalizeUpload(chatId, user) {
  const sess = session.get(user.telegram.userId);
  if (!sess) {
    await sendMessage(chatId, "Session expired. Please start over with /upload.");
    return;
  }

  try {
    // Download file from Telegram
    const fileBuffer = await downloadFile(sess.media.telegramFileId);

    // Upload to GridFS via existing service
    const FormData = require("form-data");
    const formData = new FormData();
    formData.append("files", fileBuffer, {
      filename: sess.media.originalName,
      contentType: sess.media.mimeType,
    });

    const docsUpload = require("../service/query.service").addData; // Not ideal; we need a dedicated GridFS endpoint
    // For now, we reuse the existing /auth/upload-doc endpoint via HTTP call
    const axios = require("axios");
    const uploadRes = await axios.post(`${process.env.BASE_URL || "http://localhost:4000"}/api/auth/upload-doc`, formData, {
      headers: formData.getHeaders(),
    });
    const uploadedUrl = uploadRes?.data?.data?.doc0;

    if (!uploadedUrl) {
      throw new Error("Failed to upload file to GridFS");
    }

    // Create Course/product record
    const coursePayload = {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      title: sess.title,
      description: sess.description,
      courseType: sess.productType,
      category: sess.category,
      tags: sess.tags ? sess.tags.join(",") : "",
      price: sess.price,
      discount: "",
      productType: sess.productType,
      licenseType: "Paid",
      thumbnail: uploadedUrl,
      telegramFileId: sess.media.telegramFileId,
      releaseDate: new Date(),
    };

    const created = await queryService.addData("Course", coursePayload);
    const productId = created._id.toString();

    // Send confirmation with link
    const siteUrl = process.env.SITE_URL || "http://localhost:3000";
    await sendMessage(chatId, `✅ Your artwork has been published!\nLive link: ${siteUrl}/product/${productId}`);

    // Clean up session
    session.clear(user.telegram.userId);
  } catch (err) {
    logger.error("finalizeUpload error:", err);
    await sendMessage(chatId, "Something went wrong while publishing. Please try again later.");
  }
}

/**
 * Show artist’s products
 */
async function showMyProducts(chatId, user) {
  try {
    const result = await queryService.getAllDataByCond("Course", { userId: user._id });
    const courses = result || [];
    if (courses.length === 0) {
      await sendMessage(chatId, "You haven’t uploaded any products yet. Use /upload to add one.");
      return;
    }
    const list = courses.map((c, i) => `${i + 1}. ${c.title} - ₹${c.price}`).join("\n");
    await sendMessage(chatId, `Your products:\n${list}`);
  } catch (err) {
    logger.error("showMyProducts error:", err);
    await sendMessage(chatId, "Failed to fetch your products. Please try again later.");
  }
}

/**
 * Placeholder: handle buy request (later)
 */
async function handleBuyRequest(chatId, productId, user) {
  await sendMessage(chatId, "Purchase flow coming soon!");
}

/**
 * Placeholder: handle pre_checkout_query (Telegram payments)
 */
async function handlePreCheckoutQuery(query, user) {
  // Approve the checkout (you can add validation here)
  await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerPreCheckoutQuery`, {
    pre_checkout_query_id: query.id,
    ok: true,
  });
}

/**
 * Placeholder: handle successful payment
 */
async function handleSuccessfulPayment(payment, user) {
  // Update order/transaction status
  logger.info("Successful payment:", payment);
  await sendMessage(user.telegram.chatId, "✅ Payment received! Your order is confirmed.");
}

module.exports = { handleUpdate };
