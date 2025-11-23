const OTP = require("../models/otp.model");
const mongoose = require("mongoose");

const storeOtp = async (email, otp, data = null, expirationMinutes = 5) => {
  try {
    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email, verified: false });

    // Create new OTP
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes);

    const otpDoc = await OTP.create({
      email,
      otp: String(otp),
      data: data ? JSON.parse(JSON.stringify(data)) : null,
      expiresAt,
      verified: false,
    });

    return otpDoc;
  } catch (error) {
    throw new Error(`Error storing OTP: ${error.message}`);
  }
};

const verifyOtp = async (email, otp) => {
  try {
    const otpDoc = await OTP.findOne({
      email,
      otp: String(otp),
      verified: false,
      expiresAt: { $gt: new Date() }, // Check if not expired
    });

    if (!otpDoc) {
      return null;
    }

    // Mark as verified
    otpDoc.verified = true;
    await otpDoc.save();

    return otpDoc.data;
  } catch (error) {
    throw new Error(`Error verifying OTP: ${error.message}`);
  }
};

const deleteOtp = async (email) => {
  try {
    await OTP.deleteMany({ email });
  } catch (error) {
    throw new Error(`Error deleting OTP: ${error.message}`);
  }
};

const cleanupExpiredOtps = async () => {
  try {
    const result = await OTP.deleteMany({
      expiresAt: { $lt: new Date() },
    });
    return result.deletedCount;
  } catch (error) {
    throw new Error(`Error cleaning up expired OTPs: ${error.message}`);
  }
};

module.exports = {
  storeOtp,
  verifyOtp,
  deleteOtp,
  cleanupExpiredOtps,
};



