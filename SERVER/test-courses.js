const mongoose = require('mongoose');
const Course = require('./src/models/course.model');

// Connect to the same database as your server
mongoose.connect('mongodb://localhost:27017/abhisite')
  .then(async () => {
    console.log('=== CHECKING COURSES DATABASE ===');
    
    // Check total courses
    const totalCourses = await Course.countDocuments();
    console.log('Total courses in database:', totalCourses);
    
    // Check courses by instructor ID (from your logs)
    const instructorId = '69233371827511e628b2cdc5';
    const instructorCourses = await Course.find({ instructor: instructorId });
    console.log(`Courses for instructor ${instructorId}:`, instructorCourses.length);
    
    instructorCourses.forEach(course => {
      console.log(`- Title: ${course.title}`);
      console.log(`  ID: ${course._id}`);
      console.log(`  isDraft: ${course.isDraft}`);
      console.log(`  isPublished: ${course.isPublished}`);
      console.log(`  submittedForApproval: ${course.submittedForApproval}`);
      console.log(`  adminApproved: ${course.adminApproved}`);
      console.log('---');
    });
    
    // Check if any courses exist at all
    const allCourses = await Course.find({});
    console.log('All courses in database:');
    allCourses.forEach(course => {
      console.log(`- ${course.title} (Instructor: ${course.instructor})`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
