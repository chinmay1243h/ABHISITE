const express = require('express');
const mongoose = require('mongoose');
const Course = require('../models/course.model');
const File = require('../models/telegramFile.model');
const User = require('../models/user.model');
const { verifySign } = require('../utils/token');
const { asyncHandler } = require('../middleware/asyncHandler');
const { prepareResponse, prepareBody } = require('../utils/response');

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
router.post('/', prepareBody, verifySign, async (req, res, next) => {
  console.log("=== COURSE CREATION REQUEST RECEIVED ===");
  console.log("Received course data:", req.body);
  console.log("User from token:", req.decoded);
  
  try {
    // Get user data to fetch firstName and lastName
    const user = await User.findById(req.decoded.id);
    if (!user) {
      return res.status(404).json(prepareResponse(false, 'User not found'));
    }

    // Validate required fields
    const requiredFields = ['title', 'description', 'courseType', 'category', 'price', 'discount', 'licenseType'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json(prepareResponse(false, `Missing required fields: ${missingFields.join(', ')}`));
    }

    const courseData = {
      ...req.body,
      instructor: req.decoded.id,
      userId: req.decoded.id,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage,
      releaseDate: req.body.releaseDate ? new Date(req.body.releaseDate) : new Date(),
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

    // Ensure page is at least 1 to prevent negative skip values
    const validPage = Math.max(1, parseInt(page) || 1);
    const validLimit = Math.max(1, parseInt(limit) || 10);

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
      .limit(validLimit)
      .skip((validPage - 1) * validLimit)
      .exec();

    const total = await Course.countDocuments(filter);

    res.json({
      success: true,
      data: {
        courses,
        pagination: {
          current: validPage,
          pages: Math.ceil(total / validLimit),
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
    
    // Validate that id is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

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
    
    // Validate that id is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

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
    
    // Validate that id is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

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

    console.log("=== INSTRUCTOR COURSES REQUEST ===");
    console.log("User ID:", req.decoded.id);
    console.log("Status filter:", status);
    console.log("Page:", page, "Limit:", limit);

    // Build filter
    const filter = { instructor: req.decoded.id };
    
    if (status === 'published') {
      filter.isPublished = true;
      filter.adminApproved = true;
    } else if (status === 'draft') {
      // Handle both new and legacy draft courses
      filter.$or = [
        { isDraft: true, adminApproved: false },
        { isDraft: true, adminApproved: { $exists: false } },
        { isDraft: { $exists: false }, adminApproved: { $exists: false }, isPublished: false }
      ];
    } else if (status === 'pending') {
      filter.submittedForApproval = true;
      filter.adminApproved = false;
    }
    // For 'all' status, don't add additional filters to show all courses

    console.log("Final filter:", JSON.stringify(filter, null, 2));

    const courses = await Course.find(filter)
      .populate('files', 'filename size mimeType')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip(Math.max(0, (page - 1) * limit))
      .exec();

    console.log("Courses found:", courses.length);
    courses.forEach(course => {
      console.log(`- ${course.title} (ID: ${course._id})`);
    });

    const total = await Course.countDocuments(filter);
    console.log("Total courses count:", total);

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
    console.error("Get instructor courses error:", err);
    next(err);
  }
});

/**
 * Submit course for admin approval
 * POST /api/courses/:id/submit-for-approval
 */
router.post('/:id/submit-for-approval', verifySign, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate that id is provided
    if (!id) {
      return res.status(400).json(prepareResponse(false, 'Course ID is required'));
    }
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(prepareResponse(false, 'Invalid course ID format'));
    }

    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json(prepareResponse(false, 'Course not found'));
    }

    // Check ownership
    if (course.instructor.toString() !== req.decoded.id.toString()) {
      return res.status(403).json(prepareResponse(false, 'Access denied'));
    }

    // Check if course has files
    const fileCount = await File.countDocuments({ course: id });
    if (fileCount === 0) {
      return res.status(400).json(prepareResponse(false, 'Course must have at least one file to submit for approval'));
    }

    // Check if already submitted
    if (course.submittedForApproval) {
      return res.status(400).json(prepareResponse(false, 'Course already submitted for approval'));
    }

    course.submittedForApproval = true;
    course.isDraft = false;
    await course.save();

    res.json(prepareResponse(true, 'Course submitted for admin approval', course));
  } catch (err) {
    next(err);
  }
});

/**
 * Get all courses for admin (Admin only)
 * GET /api/courses/admin/all
 */
router.get('/admin/all', verifySign, async (req, res, next) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.decoded.id);
    if (!user || user.role !== 'Admin') {
      return res.status(403).json(prepareResponse(false, 'Admin access required'));
    }

    const {
      page = 1,
      limit = 10,
      status = 'all', // all, published, draft, pending
      instructor
    } = req.query;

    const validPage = Math.max(1, parseInt(page) || 1);
    const validLimit = Math.max(1, parseInt(limit) || 10);

    // Build filter
    const filter = {};
    
    if (instructor) {
      filter.instructor = instructor;
    }
    
    if (status === 'published') {
      filter.isPublished = true;
      filter.adminApproved = true;
    } else if (status === 'draft') {
      filter.$or = [
        { isDraft: true, adminApproved: false },
        { isDraft: true, adminApproved: { $exists: false } },
        { isDraft: { $exists: false }, adminApproved: { $exists: false }, isPublished: false }
      ];
    } else if (status === 'pending') {
      filter.submittedForApproval = true;
      filter.adminApproved = false;
    }
    // For 'all' status, don't add additional filters

    console.log("=== ADMIN ALL COURSES REQUEST ===");
    console.log("Admin User ID:", req.decoded.id);
    console.log("Status filter:", status);
    console.log("Instructor filter:", instructor);
    console.log("Final filter:", JSON.stringify(filter, null, 2));

    const courses = await Course.find(filter)
      .populate('instructor', 'username email firstName lastName')
      .sort({ createdAt: -1 })
      .limit(validLimit)
      .skip((validPage - 1) * validLimit)
      .exec();

    console.log("Courses found:", courses.length);

    const total = await Course.countDocuments(filter);

    res.json({
      success: true,
      data: {
        courses,
        pagination: {
          current: validPage,
          pages: Math.ceil(total / validLimit),
          total
        }
      }
    });
  } catch (err) {
    console.error("Get admin all courses error:", err);
    next(err);
  }
});

/**
 * Get courses pending admin approval (Admin only)
 * GET /api/courses/admin/pending
 */
router.get('/admin/pending', verifySign, async (req, res, next) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.decoded.id);
    if (!user || user.role !== 'Admin') {
      return res.status(403).json(prepareResponse(false, 'Admin access required'));
    }

    const {
      page = 1,
      limit = 10
    } = req.query;

    const validPage = Math.max(1, parseInt(page) || 1);
    const validLimit = Math.max(1, parseInt(limit) || 10);

    const filter = { 
      submittedForApproval: true, 
      adminApproved: false,
      isDraft: false 
    };

    const courses = await Course.find(filter)
      .populate('instructor', 'username email firstName lastName')
      .sort({ submittedForApproval: -1 })
      .limit(validLimit)
      .skip((validPage - 1) * validLimit)
      .exec();

    const total = await Course.countDocuments(filter);

    res.json({
      success: true,
      data: {
        courses,
        pagination: {
          current: validPage,
          pages: Math.ceil(total / validLimit),
          total
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Approve course (Admin only)
 * POST /api/courses/admin/:id/approve
 */
router.post('/admin/:id/approve', verifySign, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate that id is provided
    if (!id) {
      return res.status(400).json(prepareResponse(false, 'Course ID is required'));
    }
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(prepareResponse(false, 'Invalid course ID format'));
    }

    // Check if user is admin
    const user = await User.findById(req.decoded.id);
    if (!user || user.role !== 'Admin') {
      return res.status(403).json(prepareResponse(false, 'Admin access required'));
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json(prepareResponse(false, 'Course not found'));
    }

    if (!course.submittedForApproval) {
      return res.status(400).json(prepareResponse(false, 'Course not submitted for approval'));
    }

    if (course.adminApproved) {
      return res.status(400).json(prepareResponse(false, 'Course already approved'));
    }

    course.adminApproved = true;
    course.isPublished = true;
    course.approvedAt = new Date();
    course.approvedBy = req.decoded.id;
    course.rejectionReason = null;
    await course.save();

    await course.populate('instructor', 'username email firstName lastName');

    res.json(prepareResponse(true, 'Course approved and published', course));
  } catch (err) {
    next(err);
  }
});

/**
 * Reject course (Admin only)
 * POST /api/courses/admin/:id/reject
 */
router.post('/admin/:id/reject', verifySign, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    
    // Validate that id is provided
    if (!id) {
      return res.status(400).json(prepareResponse(false, 'Course ID is required'));
    }
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(prepareResponse(false, 'Invalid course ID format'));
    }

    if (!rejectionReason || rejectionReason.trim().length === 0) {
      return res.status(400).json(prepareResponse(false, 'Rejection reason is required'));
    }

    // Check if user is admin
    const user = await User.findById(req.decoded.id);
    if (!user || user.role !== 'Admin') {
      return res.status(403).json(prepareResponse(false, 'Admin access required'));
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json(prepareResponse(false, 'Course not found'));
    }

    if (!course.submittedForApproval) {
      return res.status(400).json(prepareResponse(false, 'Course not submitted for approval'));
    }

    if (course.adminApproved) {
      return res.status(400).json(prepareResponse(false, 'Cannot reject an approved course'));
    }

    course.adminApproved = false;
    course.submittedForApproval = false;
    course.isDraft = true;
    course.rejectionReason = rejectionReason.trim();
    await course.save();

    res.json(prepareResponse(true, 'Course rejected and returned to draft', course));
  } catch (err) {
    next(err);
  }
});

/**
 * Publish course (Updated - requires admin approval)
 * POST /api/courses/:id/publish
 */
router.post('/:id/publish', verifySign, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    console.log('=== PUBLISH COURSE REQUEST ===');
    console.log('Course ID:', id);
    console.log('User ID:', req.decoded.id);
    
    // Validate that id is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid ObjectId format:', id);
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

    const course = await Course.findById(id);
    console.log('Course found:', course ? 'Yes' : 'No');
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.decoded.id.toString()) {
      console.log('Access denied - instructor:', course.instructor, 'user:', req.decoded.id);
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if course has files (check both TelegramFile and course files array)
    const telegramFileCount = await File.countDocuments({ course: id });
    const courseFilesCount = course?.files?.length || 0;
    const totalFileCount = telegramFileCount + courseFilesCount;
    
    console.log('Telegram file count:', telegramFileCount);
    console.log('Course files count:', courseFilesCount);
    console.log('Total file count:', totalFileCount);
    
    if (totalFileCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'Course must have at least one file to be published. Please add files to your course first.'
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
