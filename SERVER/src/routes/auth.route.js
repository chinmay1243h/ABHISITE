const router = require("express").Router();
const { prepareBody, prepareResponse } = require("../utils/response");
const { asyncHandler } = require("../middleware/asyncHandler");
const httpRes = require("../utils/http");
const logger = require("../utils/logger");
const {
  Signup,
  Signin,
  verifyAndCreation,
  getProfile,
  updateProfile,
  deleteProfile,
  fileUploader,
  resetPassword,
  forgotPassword,
  getOneProfile,
  adminSignin,
} = require("../controller/auth.controller");
const {
  signupValidation,
  signinValidation,
  update,
  resetPassword: reset,
  forgotPassword: forgot,
} = require("../validators/auth.validator");
const checkMail = require("../middleware/checkMail");
const { verifySign } = require("../utils/token");
const upload = require("../middleware/multer");

//profile REGISTER
router
  .route("/register")
  .post(
    prepareBody,
    signupValidation,
    asyncHandler("user", checkMail),
    asyncHandler("user", Signup)
  );

//VERIFY THAT USER
router
  .route("/verify-user")
  .post(prepareBody, asyncHandler("user", verifyAndCreation));

//USER_LOGIN
router
  .route("/login")
  .post(
    prepareBody,
    signinValidation,
    asyncHandler("user", Signin)
  );

//GET the PROFILE
router
  .route("/profile")
  .get(verifySign, asyncHandler("user", getProfile));

//update the PROFILE
router
  .route("/update-profile")
  .patch(prepareBody, verifySign, asyncHandler("user", updateProfile));

//delete the PROFILE
router
  .route("/delete-profile")
  .delete(verifySign, asyncHandler("user", deleteProfile));

//adminSignin
router.route("/admin-signin").post(
  prepareBody,
  signinValidation,
  asyncHandler("user", adminSignin)
);

//File-Uploader
router.route("/upload-doc").post(
  (req, res, next) => {
    upload.array("files", 5)(req, res, (err) => {
      if (err) {
        // Handle multer errors with detailed logging
        logger.error("❌ Multer upload error:", err);
        logger.error("Error code:", err.code);
        logger.error("Error message:", err.message);
        logger.error("Full error:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
        
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(httpRes.BAD_REQUEST).json(
            prepareResponse("BAD_REQUEST", "File too large (max 10MB)", null, err.message)
          );
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(httpRes.BAD_REQUEST).json(
            prepareResponse("BAD_REQUEST", "Too many files (max 5)", null, err.message)
          );
        }
        
        // Handle MongoDB/GridFS errors - fallback to local storage message
        if (err.message && (err.message.includes('MongoDB') || err.message.includes('GridFS') || err.message.includes('connection'))) {
          logger.error("MongoDB/GridFS error detected - system should use local storage instead");
          // Don't fail - return a helpful error message
          return res.status(httpRes.SERVER_ERROR).json(
            prepareResponse("SERVER_ERROR", "File upload service temporarily unavailable. Please try again.", null, "Storage service error")
          );
        }
        
        // Handle S3/AWS errors
        if (err.message && err.message.includes('AWS')) {
          return res.status(httpRes.SERVER_ERROR).json(
            prepareResponse("SERVER_ERROR", "File upload service error. Please check AWS S3 configuration.", null, err.message)
          );
        }
        
        // Generic error handler
        const errorMessage = err.message || err.toString() || "Unknown upload error";
        logger.error("❌ File upload failed:", errorMessage);
        
        return res.status(httpRes.SERVER_ERROR).json(
          prepareResponse("SERVER_ERROR", "File upload failed: " + errorMessage, null, errorMessage)
        );
      }
      // No error - continue to fileUploader controller
      next();
    });
  },
  fileUploader
);

router.route("/get-one-record/:id").get(asyncHandler("user", getOneProfile));

//RESET-PASSWORD
router.route("/reset-password").post(
  prepareBody,
  reset,
  asyncHandler("user", resetPassword)
);

//Forgot-PASSWORD
router.route("/forgot-password").post(
  prepareBody,
  forgot,
  asyncHandler("user", forgotPassword)
);

module.exports = router;
