const httpRes = require("./http");
require("dotenv").config();
const CYS = process.env.CYS;
const cryptoJS = require("crypto-js");

const prepareResponse = (status_code, msg, data, error) => {
  console.log('CYS key from env:', CYS);
  console.log('Data to encrypt:', data);
  
  if (!CYS) {
    console.error("CYS encryption key is missing - returning unencrypted response");
    return {
      status_code: status_code,
      msg: msg,
      data: data,
      error: error,
    };
  }
  
  try {
    const encryptedData = cryptoJS.AES.encrypt(JSON.stringify(data), CYS).toString();
    console.log('Encrypted data length:', encryptedData.length);
    
    return {
      status_code: status_code,
      msg: msg,
      data: encryptedData,
      error: error,
    };
  } catch (encryptError) {
    console.error("Error encrypting response:", encryptError);
    return {
      status_code: status_code,
      msg: msg,
      data: data,
      error: error || encryptError.message,
    };
  }
};

const prepareBody = (req, res, next) => {
  try {
    // Skip decryption for API docs or if cypher is missing
    if (req.get("Referrer") === "http://localhost:4000/api-docs/" || !req.body?.cypher) {
      return next();
    }
    
    if (!CYS) {
      console.error("CYS encryption key is missing in environment variables");
      return res.status(500).json({
        status_code: "SERVER_ERROR",
        msg: "Server configuration error",
        data: null,
        error: "Encryption key not configured"
      });
    }
    
    const decrypted = cryptoJS.AES.decrypt(req.body.cypher, CYS).toString(cryptoJS.enc.Utf8);
    if (!decrypted) {
      return res.status(400).json({
        status_code: "BAD_REQUEST",
        msg: "Invalid encrypted data",
        data: null,
        error: "Failed to decrypt request body"
      });
    }
    
    req.body = JSON.parse(decrypted);
    next();
  } catch (error) {
    console.error("Error in prepareBody:", error);
    return res.status(400).json({
      status_code: "BAD_REQUEST",
      msg: "Invalid request format",
      data: null,
      error: error.message
    });
  }
};

module.exports = {
  prepareResponse,
  prepareBody,
};
