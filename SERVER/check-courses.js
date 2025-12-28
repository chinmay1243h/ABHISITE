const mongoose = require('mongoose');
const Course = require('./src/models/course.model');

mongoose.connect('mongodb://localhost:27017/abhisite')
  .then(async () => {
    console.log('=== ALL COURSES IN DATABASE ===');
    const courses = await Course.find({});
    console.log('Total courses:', courses.length);
    courses.forEach(course => {
      console.log(`ID: ${course._id}`);
      console.log(`Title: ${course.title}`);
      console.log(`Instructor: ${course.instructor}`);
      console.log(`isDraft: ${course.isDraft}`);
      console.log(`isPublished: ${course.isPublished}`);
      console.log(`submittedForApproval: ${course.submittedForApproval}`);
      console.log(`adminApproved: ${course.adminApproved}`);
      console.log(`rejectionReason: ${course.rejectionReason}`);
      console.log('---');
    });
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
