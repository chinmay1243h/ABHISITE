const { prepareResponse } = require('../utils/response');

/**
 * Role-based access control middleware
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {Function} - Express middleware function
 */
const roleBasedAccess = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.decoded.role;
      
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json(
          prepareResponse(false, 'Access denied: insufficient permissions')
        );
      }
      
      next();
    } catch (error) {
      return res.status(500).json(
        prepareResponse(false, 'Error checking permissions')
      );
    }
  };
};

/**
 * Check if user owns the resource or is admin
 * @param {string} resourceUserIdField - Field name containing user ID in the resource
 * @returns {Function} - Express middleware function
 */
const resourceOwnerOrAdmin = (resourceUserIdField) => {
  return async (req, res, next) => {
    try {
      const userId = req.decoded.id;
      const userRole = req.decoded.role;
      
      // Admins have access to everything
      if (userRole === 'Admin') {
        return next();
      }
      
      // For dynamic resources, we need to fetch them first
      // This middleware should be used after resource is fetched and attached to req
      const resourceUserId = req.resource?.[resourceUserIdField];
      
      if (!resourceUserId || resourceUserId.toString() !== userId.toString()) {
        return res.status(403).json(
          prepareResponse(false, 'Access denied: not the resource owner')
        );
      }
      
      next();
    } catch (error) {
      return res.status(500).json(
        prepareResponse(false, 'Error checking resource ownership')
      );
    }
  };
};

/**
 * Check if user can access course (instructor or enrolled student)
 * @returns {Function} - Express middleware function
 */
const canAccessCourse = () => {
  return async (req, res, next) => {
    try {
      const userId = req.decoded.id;
      const userRole = req.decoded.role;
      const courseId = req.params.courseId || req.body.courseId;
      
      if (!courseId) {
        return res.status(400).json(
          prepareResponse(false, 'Course ID is required')
        );
      }
      
      const Course = require('../models/course.model');
      const course = await Course.findById(courseId);
      
      if (!course) {
        return res.status(404).json(
          prepareResponse(false, 'Course not found')
        );
      }
      
      // Admins have access to everything
      if (userRole === 'Admin') {
        req.course = course;
        return next();
      }
      
      // Instructors can access their own courses
      if (course.instructor.toString() === userId.toString()) {
        req.course = course;
        return next();
      }
      
      // TODO: Add enrollment check for students when enrollment system is implemented
      // For now, only instructors and admins can access courses
      
      return res.status(403).json(
        prepareResponse(false, 'Access denied: not enrolled in this course')
      );
      
    } catch (error) {
      return res.status(500).json(
        prepareResponse(false, 'Error checking course access')
      );
    }
  };
};

module.exports = {
  roleBasedAccess,
  resourceOwnerOrAdmin,
  canAccessCourse
};
