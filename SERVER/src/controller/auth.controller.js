const User = require("../service/user.service");
const { prepareResponse } = require("../utils/response");
const { getRawData } = require("../utils/function");
const httpRes = require("../utils/http");
const otpService = require("../service/otp.service");
const queryService = require("../service/query.service");
const path = require("path");
const {
  SERVER_ERROR_MESSAGE,
  VERIFY_EMAIL_BEFORE_LOGIN,
  INVALID_OTP,
  PROFILE_CREATION,
  CURRENT_PASSWORD_INCORRECT,
  LOGIN,
  ACCOUNT_NOT_FOUND,
  USER_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  UPLOADED,
  RESET_PASS_SUCCESS,
  RESET_PASS_LINK_SENT,
  DELETE,
} = require("../utils/messages");
const { hashPassword, comparePassword } = require("../utils/Password");
const logger = require("../utils/logger");
const sendEmail = require("../utils/mail");
const { generateSign } = require("../utils/token");

//for cretation of verification code
exports.Signup = async (req, res) => {
  try {
    const body = req.body;

    // Hash the password
    body.password = await hashPassword(body.password);

    // Generate OTP
    const otp = generateOTP();

    // Store user data in database (OTP will be stored separately)
    try {
      await otpService.storeOtp(body.email, otp, body, 5); // 5 minutes expiration
    } catch (otpError) {
      logger.error("Error storing OTP:", otpError);
      throw new Error(`Database error: ${otpError.message}. Please ensure MongoDB is connected.`);
    }

    // Send OTP to the user's email via SMTP
    try {
      await sendEmail(
        body.email,
        "Email Verification - OTP",
        otp
      );
    } catch (emailError) {
      logger.error("Error sending email:", emailError);
      // Don't fail registration if email fails - just log it
      logger.warn("Registration continued despite email failure");
    }

    // Respond to the user
    const response = prepareResponse(
      "OK",
      VERIFY_EMAIL_BEFORE_LOGIN,
      { email: body.email },
      null
    );
    return res.status(httpRes.OK).json(response);
  } catch (error) {
    logger.error("Signup error:", error);
    const errorMessage = error.message || SERVER_ERROR_MESSAGE;
    return res
      .status(httpRes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", errorMessage, null, error.message || error));
  }
};

// Function to generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

//verify and insert into the database

exports.verifyAndCreation = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Verify OTP and retrieve data from database
    const userData = await otpService.verifyOtp(email, otp);
    logger.info("User data from OTP:", userData);

    if (!userData) {
      logger.error("Invalid or expired OTP");
      return res
        .status(httpRes.BAD_REQUEST)
        .json(prepareResponse("BAD_REQUEST", INVALID_OTP, null, null));
    }

    // OTP is valid, userData is already clean (without OTP)

    // Save the user to the database
    const result = await User.addData(userData);
    
    // Clean up OTP after successful verification
    await otpService.deleteOtp(email);

    const response = prepareResponse(
      "CREATED",
      PROFILE_CREATION,
      getRawData(result),
      // null,
      null
    );

    // Remove data from Redis after successful verification
    // await storeOtpInRedis(email, null); // Optionally use a deleteRedisKey function

    return res.status(httpRes.CREATED).json(response);
  } catch (error) {
    logger.error(error);
    return res
      .status(httpRes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

//Login controller

exports.Signin = async (req, res) => {
  try {
    let result = await User.getOneUserByCond({ email: req.body.email });
    result = getRawData(result);
    if (result) {
      const hash = await comparePassword(req.body.password, result.password);
      if (!hash) {
        logger.error("CurrentPassword is incorrect ");
        res
          .status(httpRes.FORBIDDEN)
          .json(
            prepareResponse("FORBIDDEN", CURRENT_PASSWORD_INCORRECT, null, null)
          );
      } else {
        // Ensure id field exists (MongoDB uses _id, but we need id for token)
        const userId = result.id || (result._id ? result._id.toString() : null);
        
        if (!userId) {
          logger.error("User ID is missing - cannot generate token");
          return res
            .status(httpRes.SERVER_ERROR)
            .json(prepareResponse("SERVER_ERROR", "User ID is missing", null, null));
        }
        
        const userName = result.firstName && result.lastName 
          ? `${result.firstName} ${result.lastName}` 
          : result.firstName || result.lastName || result.email;
        
        logger.info(`Generating token for user: ${result.email}, ID: ${userId}`);
        
        let token = await generateSign(
          result.email,
          userName,
          result.status,
          userId,
          result.role
        );
        
        // Ensure response has id field (not just _id)
        result.accessToken = token;
        if (!result.id && result._id) {
          result.id = result._id.toString();
        } else if (!result.id) {
          result.id = userId;
        }
        
        const { password, ...responseData } = result;
        logger.info(`Login successful for user: ${result.email}, ID: ${responseData.id}`);
        res
          .status(httpRes.OK)
          .json(prepareResponse("OK", LOGIN, responseData, null));
      }
    } else {
      logger.error("Account not found");
      res
        .status(httpRes.NOT_FOUND)
        .json(prepareResponse("NOT_FOUND", ACCOUNT_NOT_FOUND, null, null));
    }
  } catch (error) {
    logger.error(error);
    return res
      .status(httpRes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};
//get the user data;
exports.getProfile = async (req, res) => {
  try {
    let user = await User.getOneUserByCond({ id: req.decoded.id });

    if (user) {
      res
        .status(httpRes.OK)
        .json(prepareResponse("OK", USER_PROFILE, user, null));
    } else {
      res
        .status(httpRes.NOT_FOUND)
        .json(prepareResponse("NOT_FOUND", ACCOUNT_NOT_FOUND, null, null));
    }
  } catch (error) {
    logger.error(error);
    return res
      .status(httpRes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

// update the user data
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.query?.id || req.decoded.id;

    let user = await User.getOneUserByCond({ id: userId });
    if (!user) {
      return res
        .status(httpRes.NOT_FOUND)
        .json(prepareResponse("NOT_FOUND", ACCOUNT_NOT_FOUND, null, null));
    }

    // Handle password update logic
    if (req.body.password) {
      if (!req.body.currentPassword) {
        return res
          .status(httpRes.BAD_REQUEST)
          .json(
            prepareResponse(
              "BAD_REQUEST",
              "Current password is required",
              null,
              null
            )
          );
      }

      const hash = await comparePassword(req.body.currentPassword, user.password);
      if (!hash) {
        return res
          .status(httpRes.FORBIDDEN)
          .json(
            prepareResponse("FORBIDDEN", CURRENT_PASSWORD_INCORRECT, null, null)
          );
      }

      // Hash the new password
      req.body.password = await hashPassword(req.body.password);
    }

    // Update user details
    await User.updateUser(req.body, { id: userId });

    // Fetch the updated user
    const updatedUser = await User.getOneUserByCond({ id: userId });

    // Return success response
    return res
      .status(httpRes.OK)
      .json(prepareResponse("OK", UPDATE_PROFILE_SUCCESS, updatedUser, null));
  } catch (error) {
    console.error("Error in updateProfile:", error);

    // Handle server errors
    return res
      .status(httpRes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};
//delete the user data
exports.deleteProfile = async (req, res) => {
  try {
    let userid = req.decoded.id;
    let user = await User.getOneUserByCond({ id: userid });
    if (user) {
      await User.deleteUser({ id: userid });
      res
        .status(httpRes.OK)
        .json(prepareResponse("OK", DELETE, null, null));
    } else {
      res
        .status(httpRes.FORBIDDEN)
        .json(prepareResponse("FORBIDDEN", ACCOUNT_NOT_FOUND, null, null));
    }
  } catch (error) {
    logger.error(error);
    return res
      .status(httpRes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

//adminSignin
exports.adminSignin = async (req, res) => {
  try {
    let result = await queryService.getOneDataByCond("adminLogin", {
      email: req.body.email,
      password: req.body.password,
    });
    result = getRawData(result);
    if (result) {
      let token = await generateSign(
        result.email,
        result.userName,
        result.id,
        result.role,
        result.status
      );
      result.accessToken = token;
      res.status(httpRes.OK).json(prepareResponse("OK", LOGIN, result, null));
    } else {
      res
        .status(httpRes.NOT_FOUND)
        .json(prepareResponse("NOT_FOUND", ACCOUNT_NOT_FOUND, null, null));
    }
  } catch (error) {
    logger.error(error);
    return res
      .status(httpRes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

//documents uploder
exports.fileUploader = (req, res) => {
  try {
    logger.info("File upload request received");
    logger.info("Files:", req.files ? (Array.isArray(req.files) ? req.files.length : 1) : 0);
    logger.info("File:", req.file ? "Single file present" : "No single file");
    
    // Check if files exist
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      if (!req.file) {
        logger.error("No files uploaded - req.files and req.file both empty");
        return res
          .status(httpRes.BAD_REQUEST)
          .json(prepareResponse("BAD_REQUEST", "No files uploaded", null, null));
      }
    }

    // Handle array of files (multer.array)
    if (Array.isArray(req.files)) {
      let files = req.files;
      let data = {};
      const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`;
      
      logger.info(`Processing ${files.length} file(s)`);
      files.forEach((file, index) => {
        logger.info(`File ${index} properties:`, {
          id: file.id,
          filename: file.filename,
          originalname: file.originalname,
          location: file.location,
          path: file.path,
          url: file.url,
          key: file.key,
          bucket: file.bucket
        });
        
        // Check if file is from GridFS (has id property)
        if (file.id) {
          // GridFS file URL
          data[`doc${index}`] = `${baseUrl}/api/uploads/${file.filename}`;
          logger.info(`File ${index} uploaded to GridFS: ${file.filename} (ID: ${file.id})`);
        }
        // Check if file has location (S3)
        else if (file.location) {
          // S3 file URL
          data[`doc${index}`] = file.location;
          logger.info(`File ${index} uploaded to S3: ${file.location}`);
        } 
        // Check if file has path (local storage)
        else if (file.path) {
          // Local file path - convert to URL accessible from frontend
          const fileName = path.basename(file.path);
          data[`doc${index}`] = `${baseUrl}/uploads/${fileName}`;
          logger.info(`File ${index} stored locally: ${data[`doc${index}`]}`);
        } 
        // Check if file has url
        else if (file.url) {
          data[`doc${index}`] = file.url;
          logger.info(`File ${index} has URL: ${file.url}`);
        } 
        // Check if file has key (alternative S3 property)
        else if (file.key) {
          data[`doc${index}`] = `https://${file.bucket}.s3.amazonaws.com/${file.key}`;
          logger.info(`File ${index} has S3 key: ${file.key}`);
        }
        // Check if file has originalname and construct URL from it
        else if (file.originalname || file.filename) {
          const fileName = file.filename || file.originalname;
          data[`doc${index}`] = `${baseUrl}/uploads/${fileName}`;
          logger.info(`File ${index} using originalname/filename: ${data[`doc${index}`]}`);
        }
        else {
          logger.error(`File ${index} missing location/path/url/id/key:`, JSON.stringify(file, null, 2));
          // Still return a URL based on filename if available
          if (file.originalname || file.filename) {
            const fileName = file.filename || file.originalname;
            data[`doc${index}`] = `${baseUrl}/uploads/${fileName}`;
            logger.warn(`File ${index} - Using fallback URL: ${data[`doc${index}`]}`);
          } else {
            data[`doc${index}`] = null;
          }
        }
      });
      
      logger.info("Upload response data:", JSON.stringify(data, null, 2));
      return res.status(httpRes.OK).json(prepareResponse("OK", UPLOADED, data, null));
    } 
    // Handle single file (multer.single) - should not happen with upload.array but handle it
    else if (req.file) {
      const file = req.file;
      let data = {};
      const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`;
      
      logger.info("Single file properties:", {
        id: file.id,
        filename: file.filename,
        originalname: file.originalname,
        location: file.location,
        path: file.path,
        url: file.url,
        key: file.key,
        bucket: file.bucket
      });
      
      // Check if file is from GridFS (has id property)
      if (file.id) {
        // GridFS file URL
        data[`doc0`] = `${baseUrl}/api/uploads/${file.filename}`;
        logger.info(`File uploaded to GridFS: ${file.filename} (ID: ${file.id})`);
      }
      // Check if file has location (S3)
      else if (file.location) {
        // S3 file URL
        data[`doc0`] = file.location;
        logger.info(`File uploaded to S3: ${file.location}`);
      } 
      // Check if file has path (local storage)
      else if (file.path) {
        // Local file path - convert to URL accessible from frontend
        const fileName = path.basename(file.path);
        data[`doc0`] = `${baseUrl}/uploads/${fileName}`;
        logger.info(`File stored locally: ${data[`doc0`]}`);
      } 
      // Check if file has url
      else if (file.url) {
        data[`doc0`] = file.url;
        logger.info(`File has URL: ${file.url}`);
      }
      // Check if file has key (alternative S3 property)
      else if (file.key) {
        data[`doc0`] = `https://${file.bucket}.s3.amazonaws.com/${file.key}`;
        logger.info(`File has S3 key: ${file.key}`);
      }
      // Check if file has originalname and construct URL from it
      else if (file.originalname || file.filename) {
        const fileName = file.filename || file.originalname;
        data[`doc0`] = `${baseUrl}/uploads/${fileName}`;
        logger.info(`File using originalname/filename: ${data[`doc0`]}`);
      }
      else {
        logger.error("File missing location/path/url/id/key:", JSON.stringify(file, null, 2));
        // Still return a URL based on filename if available
        if (file.originalname || file.filename) {
          const fileName = file.filename || file.originalname;
          data[`doc0`] = `${baseUrl}/uploads/${fileName}`;
          logger.warn(`Using fallback URL: ${data[`doc0`]}`);
        } else {
          return res
            .status(httpRes.SERVER_ERROR)
            .json(prepareResponse("SERVER_ERROR", "File upload failed: missing file location", null, null));
        }
      }
      
      logger.info("Upload response data:", JSON.stringify(data, null, 2));
      return res.status(httpRes.OK).json(prepareResponse("OK", UPLOADED, data, null));
    } 
    // No files
    else {
      logger.error("No files in request - req.files:", req.files, "req.file:", req.file);
      return res
        .status(httpRes.BAD_REQUEST)
        .json(prepareResponse("BAD_REQUEST", "No files uploaded", null, null));
    }
  } catch (error) {
    logger.error("File upload controller error:", error);
    logger.error("Error stack:", error.stack);
    logger.error("Error details:", {
      message: error.message,
      name: error.name,
      code: error.code,
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
    });
    return res
      .status(httpRes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", "File upload failed: " + (error.message || SERVER_ERROR_MESSAGE), null, error.message || error.toString()));
  }
};

exports.getOneProfile = async (req, res) => {
  try {
    let user = await User.getOneUserByCond({ id: req.params.id });
    if (user) {
      res
        .status(httpRes.OK)
        .json(prepareResponse("OK", USER_PROFILE, user, null));
    } else {
      res
        .status(httpRes.NOT_FOUND)
        .json(prepareResponse("NOT_FOUND", ACCOUNT_NOT_FOUND, null, null));
    }
  } catch (error) {
    res
      .status(httpRes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};
// Forgot Password - Send OTP via SMTP
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(httpRes.BAD_REQUEST)
        .json(
          prepareResponse("BAD_REQUEST", "Email is required", null, null)
        );
    }

    // Check if user exists
    let user = await User.getOneUserByCond({ email });
    user = getRawData(user);

    if (!user) {
      // Don't reveal if email exists or not (security best practice)
      return res
        .status(httpRes.OK)
        .json(
          prepareResponse(
            "OK",
            "If the email exists, an OTP has been sent",
            null,
            null
          )
        );
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in database (5 minutes expiration)
    await otpService.storeOtp(email, otp, { email, purpose: "password-reset" }, 5);

    // Send OTP via SMTP email
    await sendEmail(
      email,
      "Password Reset - OTP",
      otp
    );

    logger.info(`Password reset OTP sent to ${email}`);

    return res
      .status(httpRes.OK)
      .json(
        prepareResponse(
          "OK",
          "If the email exists, an OTP has been sent to your email",
          { email },
          null
        )
      );
  } catch (error) {
    logger.error("Forgot password error:", error);
    return res
      .status(httpRes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

// Reset Password - Verify OTP and update password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res
        .status(httpRes.BAD_REQUEST)
        .json(
          prepareResponse("BAD_REQUEST", "Email, OTP, and password are required", null, null)
        );
    }

    // Verify OTP
    const otpData = await otpService.verifyOtp(email, otp);

    if (!otpData || otpData.purpose !== "password-reset") {
      return res
        .status(httpRes.BAD_REQUEST)
        .json(prepareResponse("BAD_REQUEST", INVALID_OTP, null, null));
    }

    // Get user
    let user = await User.getOneUserByCond({ email });
    user = getRawData(user);

    if (!user) {
      return res
        .status(httpRes.NOT_FOUND)
        .json(prepareResponse("NOT_FOUND", ACCOUNT_NOT_FOUND, null, null));
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update password
    await User.updateUser({ password: hashedPassword }, { id: user.id });

    // Delete OTP after successful password reset
    await otpService.deleteOtp(email);

    logger.info(`Password reset successful for ${email}`);

    res
      .status(httpRes.OK)
      .json(prepareResponse("OK", RESET_PASS_SUCCESS, { email }, null));
  } catch (error) {
    logger.error("Reset password error:", error);
    res
      .status(httpRes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};
