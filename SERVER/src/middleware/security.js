const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { prepareResponse } = require('../utils/response');

/**
 * General API rate limiter
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: prepareResponse(false, 'Too many requests from this IP, please try again later'),
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * File upload rate limiter (stricter)
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 uploads per hour
  message: prepareResponse(false, 'Upload limit exceeded, please try again later'),
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * File download rate limiter
 */
const downloadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 downloads per windowMs
  message: prepareResponse(false, 'Download limit exceeded, please try again later'),
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Authentication rate limiter (prevent brute force)
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: prepareResponse(false, 'Too many authentication attempts, please try again later'),
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

/**
 * Validate file size and type
 */
const validateFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json(prepareResponse(false, 'No file uploaded'));
  }

  const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
  if (req.file.size > maxSize) {
    return res.status(400).json(prepareResponse(false, 'File size exceeds 2GB limit'));
  }

  const allowedTypes = [
    'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm',
    'application/pdf', 'application/zip', 'application/x-zip-compressed',
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg'
  ];

  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json(prepareResponse(false, 'Invalid file type'));
  }

  next();
};

/**
 * Sanitize filename to prevent directory traversal
 */
const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};

/**
 * Validate MongoDB ObjectId
 */
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Check for suspicious patterns in requests
 */
const securityCheck = (req, res, next) => {
  const suspiciousPatterns = [
    /\.\./,  // Directory traversal
    /<script/i,  // XSS attempts
    /javascript:/i,  // JavaScript protocol
    /data:/i,  // Data protocol
  ];

  const checkString = (str) => {
    return suspiciousPatterns.some(pattern => pattern.test(str));
  };

  // Check query parameters
  for (const key in req.query) {
    if (checkString(req.query[key])) {
      return res.status(400).json(prepareResponse(false, 'Invalid request parameters'));
    }
  }

  // Check body parameters
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string' && checkString(req.body[key])) {
        return res.status(400).json(prepareResponse(false, 'Invalid request body'));
      }
    }
  }

  next();
};

/**
 * CORS configuration for security
 */
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

/**
 * Security headers middleware
 */
const securityHeaders = (req, res, next) => {
  // Prevent XSS attacks
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Force HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  
  next();
};

module.exports = {
  generalLimiter,
  uploadLimiter,
  downloadLimiter,
  authLimiter,
  validateFile,
  sanitizeFilename,
  isValidObjectId,
  securityCheck,
  corsOptions,
  securityHeaders
};
