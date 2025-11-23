const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const logger = require("./logger");
require("dotenv").config();

/**
 * Create SMTP transporter based on environment configuration
 * Supports Gmail, custom SMTP, and other providers
 */
const createTransporter = () => {
  // If using Gmail service (quick setup)
  if (process.env.EMAIL_SERVICE === "Gmail" || (!process.env.EMAIL_HOST && process.env.EMAIL_USER)) {
    return nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS || process.env.EMAIL_APP_PASSWORD, // Support app password
      },
    });
  }

  // Custom SMTP configuration
  if (process.env.EMAIL_HOST) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true" || process.env.EMAIL_PORT === "465", // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS || process.env.EMAIL_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: process.env.EMAIL_REJECT_UNAUTHORIZED !== "false", // Allow self-signed certificates if needed
      },
    });
  }

  // Default to Gmail if nothing configured
  logger.warn("No email configuration found, using Gmail as default");
  return nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send email with OTP using SMTP
 * @param {string} email - Recipient email address
 * @param {string} title - Email subject
 * @param {string|number} otp - OTP code to send
 * @returns {Promise<void>}
 */
const sendEmail = async (email, title, otp) => {
  try {
    if (!process.env.EMAIL_USER || (!process.env.EMAIL_PASS && !process.env.EMAIL_APP_PASSWORD)) {
      throw new Error("Email configuration is missing. Please set EMAIL_USER and EMAIL_PASS in environment variables.");
    }

    const transporter = createTransporter();

    // Verify SMTP connection
    await transporter.verify();

    // Render email template
    const templatePath = path.join(__dirname, "../views/emailTamplet.ejs");
    let message;
    try {
      message = await ejs.renderFile(templatePath, {
        title,
        message: `Your OTP is: ${otp}`,
        otp: otp,
        appName: process.env.APP_NAME || "Liv Abhi",
      });
    } catch (templateError) {
      // If template not found, use plain HTML
      logger.warn("Email template not found, using plain HTML");
      message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>${title}</h2>
          <p>Your OTP code is:</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP will expire in 5 minutes.</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
        </div>
      `;
    }

    // Send email via SMTP
    const info = await transporter.sendMail({
      from: `"${process.env.APP_NAME || "Liv Abhi"}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: title,
      html: message,
    });

    logger.info(`OTP email sent successfully to ${email}. MessageId: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Error sending OTP email to ${email}:`, error);
    throw error;
  }
};

/**
 * Send OTP email (specialized function for OTP)
 * @param {string} email - Recipient email address
 * @param {string|number} otp - OTP code
 * @param {string} purpose - Purpose of OTP (e.g., "Registration", "Password Reset")
 * @returns {Promise<void>}
 */
const sendOTPEmail = async (email, otp, purpose = "Verification") => {
  const subject = `${process.env.APP_NAME || "Liv Abhi"} - ${purpose} OTP`;
  return await sendEmail(email, subject, otp);
};

module.exports = sendEmail;
module.exports.sendOTPEmail = sendOTPEmail;
