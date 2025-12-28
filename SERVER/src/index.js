const express = require("express");
const app = express();
const logger = require("./utils/logger");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const connectDB = require("./config/db.config");
const { generalLimiter, securityHeaders, corsOptions } = require("./middleware/security");

//middleware
app.use(cors(corsOptions));
app.use(securityHeaders);
app.use(generalLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory (for local file storage)
const uploadsPath = path.join(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsPath));

//database - Connect to MongoDB for GridFS storage
connectDB()
  .then((connection) => {
    if (connection) {
      logger.info("✅ MongoDB Connected Successfully");
      logger.info("📦 MongoDB GridFS will be used for file storage");
      // Storage will switch to GridFS automatically via the 'connected' event listener in multer.js
    } else {
      logger.warn("⚠️ MongoDB connection failed, but server will continue running");
      logger.info("📁 Files will be stored locally in 'uploads' folder");
    }
  })
  .catch((err) => {
    logger.error("❌ Error Connecting to MongoDB", err);
    logger.warn("⚠️ Server will continue to run, but database features will not work");
    logger.info("📁 Files will be stored locally in 'uploads' folder until MongoDB connects");
  });

//routes
app.use("/api", require("./routes/index"));

app.get("/get", async (req, res) => {
  try {
    // Simulate a database or API call
    res.send({ message: "API is working!" });
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).send({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`server is running on port ${PORT}`);
});
