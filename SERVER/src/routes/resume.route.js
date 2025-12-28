const express = require('express');
const router = express.Router();
const { parseResume, uploadMiddleware } = require('../controller/resume.controller');
const { verifySign } = require('../utils/token');

// Route to parse resume - requires authentication
router.post('/parse', verifySign, uploadMiddleware, parseResume);

module.exports = router;
