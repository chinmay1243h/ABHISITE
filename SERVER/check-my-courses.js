const mongoose = require('mongoose');
const Course = require('./src/models/course.model');
const Payment = require('./src/models/payment.model');

// Connect to your database
mongoose.connect('mongodb://localhost:27017/test')
  .then(async () => {
    console.log('=== COURSE ANALYSIS ===');
    
    // Get all courses
    const allCourses = await Course.find({});
    console.log(`\nTotal courses in database: ${allCourses.length}`);
    
    if (allCourses.length === 0) {
      console.log('❌ No courses found in database!');
      console.log('\n📝 SOLUTION: You need to create courses first.');
      console.log('1. Go to /upload-course or /telegram-course-upload');
      console.log('2. Fill in course details and upload files');
      console.log('3. Submit for approval');
      process.exit(0);
    }
    
    console.log('\n=== COURSE DETAILS ===');
    allCourses.forEach((course, index) => {
      console.log(`\n${index + 1}. ${course.title}`);
      console.log(`   ID: ${course._id}`);
      console.log(`   Instructor: ${course.instructor}`);
      console.log(`   Status: ${course.isDraft ? 'DRAFT' : course.isPublished ? 'PUBLISHED' : 'UNPUBLISHED'}`);
      console.log(`   Admin Approved: ${course.adminApproved}`);
      console.log(`   Submitted for Approval: ${course.submittedForApproval}`);
      console.log(`   Price: $${course.price}`);
      console.log(`   Category: ${course.category}`);
    });
    
    // Get all payments
    const allPayments = await Payment.find({});
    console.log(`\n=== PAYMENT ANALYSIS ===`);
    console.log(`Total payments in database: ${allPayments.length}`);
    
    if (allPayments.length > 0) {
      console.log('\nPayment details:');
      allPayments.forEach(payment => {
        console.log(`- Course: ${payment.courseId}, User: ${payment.userId}, Status: ${payment.status}`);
      });
    }
    
    // Check what would show in MyCourses
    console.log('\n=== MY COURSES PAGE ANALYSIS ===');
    const userId = 'YOUR_USER_ID'; // You need to replace this with your actual user ID
    
    const filteredCourses = allCourses.filter(course => {
      const matchingPayment = allPayments.find(payment =>
        payment.courseId === course.id &&
        payment.userId === userId &&
        payment.status === "success"
      );
      return matchingPayment;
    });
    
    console.log(`Courses that would appear in MyCourses: ${filteredCourses.length}`);
    
    if (filteredCourses.length === 0) {
      console.log('\n❌ ISSUE IDENTIFIED:');
      console.log('Your MyCourses page only shows courses with successful payments.');
      console.log('But as the course creator, you should see your courses even without payment!');
      
      console.log('\n🔧 SOLUTION:');
      console.log('The MyCourses component needs to be fixed to show:');
      console.log('1. Courses you created (instructor courses)');
      console.log('2. Courses you purchased (payment courses)');
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('\n❌ Make sure MongoDB is running on localhost:27017');
    process.exit(1);
  });
