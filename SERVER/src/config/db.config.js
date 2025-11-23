require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || `mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '27017'}/${process.env.DB_NAME || 'livabhi'}`;
    
    if (!process.env.MONGODB_URI) {
      logger.warn("MONGODB_URI not found in environment variables");
    }
    
    // Set connection options for better compatibility
    const options = {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      connectTimeoutMS: 10000, // Connection timeout
    };
    
    logger.info("Attempting to connect to MongoDB...");
    await mongoose.connect(mongoURI, options);
    
    logger.info("MongoDB Connected Successfully");
    logger.info(`Connected to database: ${mongoose.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });
    
    return mongoose.connection;
  } catch (error) {
    logger.error("Error Connecting to MongoDB:", error.message);
    logger.error("Full error:", error);
    
    // Provide helpful error messages
    if (error.message.includes('authentication failed')) {
      logger.error("Authentication failed. Please check your username and password in MONGODB_URI");
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      logger.error("Cannot resolve hostname. Please check your MongoDB Atlas cluster URL");
    } else if (error.message.includes('timeout')) {
      logger.error("Connection timeout. Please check your network connection and IP whitelist in MongoDB Atlas");
    }
    
    logger.warn("Server will continue to run, but database features will not work.");
    logger.warn("Please ensure MongoDB is running or configure MONGODB_URI in .env file");
    // Don't exit - allow server to start without DB for testing
    return null;
  }
};

module.exports = connectDB;