const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const File = require('../models/telegramFile.model');
const Course = require('../models/course.model');
const TelegramService = require('../config/telegram');
const { verifySign } = require('../utils/token');
const { asyncHandler } = require('../middleware/asyncHandler');
const { prepareResponse } = require('../utils/response');
const { roleBasedAccess, canAccessCourse } = require('../middleware/roleBasedAccess');

const router = express.Router();
const telegramService = new TelegramService();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv',
      'application/pdf', 'application/zip', 'application/x-zip-compressed',
      'image/jpeg', 'image/png', 'image/gif',
      'audio/mp3', 'audio/wav', 'audio/m4a'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

/**
 * Upload file to Telegram and store metadata
 * POST /api/telegram-files/upload
 * Only Artist and Business roles can upload files
 */
router.post('/upload', verifySign, roleBasedAccess(['Artist', 'Business', 'Admin']), upload.single('file'), canAccessCourse(), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json(prepareResponse(false, 'No file uploaded'));
  }

  const { description } = req.body;
  
  // Course is already validated by canAccessCourse middleware
  const course = req.course;

  // Read file buffer
  const fileBuffer = fs.readFileSync(req.file.path);
  
  // Upload to Telegram
  const telegramResult = await telegramService.uploadFile(
    fileBuffer,
    req.file.originalname,
    req.file.mimetype,
    description || `File for course: ${course.title}`
  );

  if (!telegramResult.success) {
    throw new Error('Failed to upload to Telegram');
  }

  // Create file record in database
  const fileRecord = new File({
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    telegramFileId: telegramResult.fileId,
    telegramMessageId: telegramResult.messageId,
    uploadedBy: req.decoded.id,
    course: course._id,
    order: course.files.length
  });

  await fileRecord.save();

  // Update course files array
  course.files.push(fileRecord._id);
  await course.save();

  // Clean up temporary file
  fs.unlinkSync(req.file.path);

  res.status(201).json(prepareResponse(true, 'File uploaded successfully to Telegram', {
    fileId: fileRecord._id,
    filename: fileRecord.originalName,
    size: fileRecord.size,
    mimeType: fileRecord.mimetype,
    uploadedAt: fileRecord.createdAt,
    telegramFileId: fileRecord.telegramFileId
  }));
}));

/**
 * Stream file from Telegram to user
 * GET /api/telegram-files/:fileId/stream
 */
router.get('/:fileId/stream', verifySign, asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  
  // Get file record
  const fileRecord = await File.findById(fileId).populate('course');
  
  if (!fileRecord) {
    return res.status(404).json(prepareResponse(false, 'File not found'));
  }

  // Check if user has access to the course
  const course = fileRecord.course;
  const isInstructor = course.instructor.toString() === req.decoded.id.toString();
  
  if (!isInstructor) {
    return res.status(403).json(prepareResponse(false, 'Access denied'));
  }

  // Get file stream from Telegram
  const fileStream = await telegramService.getFileStream(fileRecord.telegramFileId);
  
  // Set appropriate headers
  res.setHeader('Content-Type', fileRecord.mimeType);
  res.setHeader('Content-Length', fileRecord.size);
  res.setHeader('Content-Disposition', `inline; filename="${fileRecord.originalName}"`);
  res.setHeader('Cache-Control', 'public, max-age=3600');
  
  // Stream file to client
  fileStream.pipe(res);
  
  // Update access statistics
  fileRecord.updateAccess();
}));

/**
 * Download file from Telegram
 * GET /api/telegram-files/:fileId/download
 */
router.get('/:fileId/download', verifySign, asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  
  // Get file record
  const fileRecord = await File.findById(fileId).populate('course');
  
  if (!fileRecord) {
    return res.status(404).json(prepareResponse(false, 'File not found'));
  }

  // Check access permissions
  const course = fileRecord.course;
  const isInstructor = course.instructor.toString() === req.decoded.id.toString();
  
  if (!isInstructor) {
    return res.status(403).json(prepareResponse(false, 'Access denied'));
  }

  // Get file link from Telegram
  const fileLink = await telegramService.getFileLink(fileRecord.telegramFileId);
  
  if (!fileLink.success) {
    throw new Error('Failed to get file link');
  }

  // Stream file directly from Telegram to avoid exposing URL
  const axios = require('axios');
  const response = await axios({
    method: 'get',
    url: fileLink.downloadUrl,
    responseType: 'stream'
  });
  
  res.setHeader('Content-Type', fileRecord.mimeType);
  res.setHeader('Content-Length', fileRecord.size);
  res.setHeader('Content-Disposition', `attachment; filename="${fileRecord.originalName}"`);
  res.setHeader('Cache-Control', 'public, max-age=3600');
  
  response.data.pipe(res);
  
  // Update access statistics
  fileRecord.updateAccess();
}));

/**
 * Get file information
 * GET /api/telegram-files/:fileId/info
 */
router.get('/:fileId/info', verifySign, asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  
  const fileRecord = await File.findById(fileId)
    .populate('uploadedBy', 'username email')
    .populate('course', 'title description');
  
  if (!fileRecord) {
    return res.status(404).json(prepareResponse(false, 'File not found'));
  }

  // Check access permissions
  const course = fileRecord.course;
  const isInstructor = course.instructor.toString() === req.decoded.id.toString();
  
  if (!isInstructor) {
    return res.status(403).json(prepareResponse(false, 'Access denied'));
  }

  res.json(prepareResponse(true, 'File information retrieved', {
      id: fileRecord._id,
      filename: fileRecord.originalName,
      size: fileRecord.size,
      mimeType: fileRecord.mimeType,
      uploadedBy: fileRecord.uploadedBy,
      course: fileRecord.course,
      uploadedAt: fileRecord.createdAt,
      downloadCount: fileRecord.downloadCount,
      lastAccessed: fileRecord.lastAccessed,
      telegramFileId: fileRecord.telegramFileId,
      order: fileRecord.order
    }
  ));
}));

/**
 * Delete file from Telegram and database
 * DELETE /api/telegram-files/:fileId
 */
router.delete('/:fileId', verifySign, asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  
  // Get file record
  const fileRecord = await File.findById(fileId).populate('course');
  
  if (!fileRecord) {
    return res.status(404).json(prepareResponse(false, 'File not found'));
  }

  // Check if user owns the course
  const course = fileRecord.course;
  if (course.instructor.toString() !== req.decoded.id.toString()) {
    return res.status(403).json(prepareResponse(false, 'Access denied'));
  }

  // Delete message from Telegram
  await telegramService.deleteMessage(fileRecord.telegramMessageId);
  
  // Remove file from course files array
  course.files.pull(fileRecord._id);
  await course.save();
  
  // Delete file record from database
  await File.findByIdAndDelete(fileId);

  res.json(prepareResponse(true, 'File deleted successfully from Telegram and database'));
}));

module.exports = router;
