const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const httpResponseCodes = require("./http");
const { prepareResponse } = require("../utils/response");
const {
  ACCESS_TOKEN_MISSING,
  INVALID_ACCESS_TOKEN,
  SERVER_ERROR_MESSAGE,
} = require("./messages");

let generateSign = (email_id, name, user_status, id, role) => {
  var token = jwt.sign(
    { email_id, name, id, user_status, role },
    JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
  return token;
};

let verifySign = (req, res, next) => {
  if (!JWT_SECRET_KEY) {
    return res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", "JWT secret key not configured", null, "Missing JWT_SECRET_KEY in environment variables"));
  }
  
  const bearerToken = req.get("Authorization") || req.headers["x-access-token"];
  if (!bearerToken) {
    return res
      .status(httpResponseCodes.UNAUTHORIZED)
      .json(prepareResponse("UNAUTHORIZED", ACCESS_TOKEN_MISSING, null, null));
  }
  
  // Remove "Bearer " prefix if present
  const token = bearerToken.startsWith("Bearer ") ? bearerToken.slice(7) : bearerToken;
  
  try {
    jwt.verify(token, JWT_SECRET_KEY, function (error, decoded) {
      if (error) {
        console.error('JWT Verification Error:', error.message);
        console.error('Token received:', token.substring(0, 20) + '...');
        return res
          .status(httpResponseCodes.UNAUTHORIZED)
          .json(
            prepareResponse("FORBIDDEN", INVALID_ACCESS_TOKEN, null, error.message)
          );
      }
      req.decoded = decoded;
      next();
    });
  } catch (error) {
    return res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};
module.exports = {
  generateSign,
  verifySign,
};
