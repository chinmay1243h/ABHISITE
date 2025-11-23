const router = require("express").Router();

// Root API endpoint
router.get("/", (req, res) => {
  res.json({ message: "API is running", status: "success" });
});

// File serving routes (must come before catch-all routes)
router.use("/", require("./file.route")); // File serving routes (uploads)

// Specific routes must come before catch-all routes
router.use("/auth", require("./auth.route"));
router.use("/razorpay", require("./razorpay.route"));
router.use("/job", require("./job.posting"));
router.use("/chatbot", require("./chatbot.route"));

// Catch-all route should be last - only match paths not already handled
const queryRoute = require("./query.route");
router.use("/:tableName", queryRoute);

module.exports = router;
