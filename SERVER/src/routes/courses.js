const express = require('express');
const Course = require('../models/course.model');
const File = require('../models/telegramFile.model');
const { verifySign } = require('../utils/token');
const { asyncHandler } = require('../middleware/asyncHandler');
const { prepareResponse } = require('../utils/response');

console.log("=== COURSES ROUTE LOADED ===");

const router = express.Router();

// Test route to verify endpoint is working
router.post('/test', (req, res) => {
  console.log("=== TEST ROUTE HIT ===");
  res.json({ message: "Test route working", body: req.body });
});

/**
 * Create new course
 * POST /api/courses
 */
router.post('/', verifySign, async (req, res, next) => {
  console.log("=== COURSE CREATION REQUEST RECEIVED ===");
  console.log("Received course data:", req.body);
  console.log("User from token:", req.decoded);
  
  try {
    const courseData = {
      ...req.body,
      instructor: req.decoded.id,
      userId: req.decoded.id
    };
    
    console.log("Final course data:", courseData);

    const course = new Course(courseData);
    await course.save();

    await course.populate('instructor', 'username email profile');

    res.status(201).json(prepareResponse(true, 'Course created successfully', course));
  } catch (err) {
    console.error("Course creation error:", err);
    next(err);
  }
});

/**
 * Get all courses (public)
 * GET /api/courses
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      level,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = { isPublished: true, isDraft: false };
    
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const courses = await Course.find(filter)
      .populate('instructor', 'username profile.firstName profile.lastName profile.avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Course.countDocuments(filter);

    res.json({
      success: true,
      data: {
        courses,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses'
    });
  }
});

/**
 * Get course by ID
 * GET /api/courses/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate('instructor', 'username email profile')
      .populate('files');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if course is published or user is owner
    if (!course.isPublished && (!req.decoded || course.instructor._id.toString() !== req.decoded.id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Course not available'
      });
    }

    res.json({
      success: true,
      data: course
    });

  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course'
    });
  }
});

/**
 * Update course
 * PUT /api/courses/:id
 */
router.put('/:id', verifySign, async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.decoded.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('instructor', 'username email profile');

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Delete course
 * DELETE /api/courses/:id
 */
router.delete('/:id', verifySign, async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.decoded.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get all files in course
    const files = await File.find({ course: id });
    
    // Delete files from Telegram (this would be handled by file service)
    // For now, just remove from database
    
    // Delete files from database
    await File.deleteMany({ course: id });
    
    // Delete course
    await Course.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get instructor's courses
 * GET /api/courses/instructor/me
 */
router.get('/instructor/me', verifySign, async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = 'all' // all, published, draft
    } = req.query;

    // Build filter
    const filter = { instructor: req.decoded.id };
    
    if (status === 'published') {
      filter.isPublished = true;
      filter.isDraft = false;
    } else if (status === 'draft') {
      filter.isDraft = true;
    }

    const courses = await Course.find(filter)
      .populate('files', 'filename size mimeType')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Course.countDocuments(filter);

    res.json({
      success: true,
      data: {
        courses,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Publish course
 * POST /api/courses/:id/publish
 */
router.post('/:id/publish', verifySign, async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.decoded.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if course has files
    const fileCount = await File.countDocuments({ course: id });
    if (fileCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'Course must have at least one file to be published'
      });
    }

    course.isPublished = true;
    course.isDraft = false;
    course.publishedAt = new Date();
    
    await course.save();

    res.json({
      success: true,
      message: 'Course published successfully',
      data: course
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get course categories
 * GET /api/courses/categories
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await Course.distinct('category', { isPublished: true });
    
    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

module.exports = router;
