require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Import models
const User = require("../src/models/user.model");
const Course = require("../src/models/course.model");
const JobPosting = require("../src/models/job.model");
const Portfolio = require("../src/models/portfolio");
const Movie = require("../src/models/movies");
const Newsletter = require("../src/models/newslatter");
const Contact = require("../src/models/contactus");

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Hash password helper
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Seed data
const seedData = async () => {
  try {
    console.log("🌱 Starting to seed database...\n");

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await User.deleteMany({});
    // await Course.deleteMany({});
    // await JobPosting.deleteMany({});
    // await Portfolio.deleteMany({});
    // await Movie.deleteMany({});

    // Create Users
    console.log("👥 Creating users...");
    const hashedPassword = await hashPassword("password123");

    const users = await User.insertMany([
      {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: hashedPassword,
        role: "User",
        status: "Varified",
        isVerified: true,
        profileImage: null,
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        password: hashedPassword,
        role: "Artist",
        status: "Varified",
        isVerified: true,
        profileImage: null,
      },
      {
        firstName: "Admin",
        lastName: "User",
        email: "admin@livabhi.com",
        password: hashedPassword,
        role: "Admin",
        status: "Varified",
        isVerified: true,
        profileImage: null,
      },
      {
        firstName: "Business",
        lastName: "Owner",
        email: "business@livabhi.com",
        password: hashedPassword,
        role: "Business",
        status: "Varified",
        isVerified: true,
        profileImage: null,
      },
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Create Courses
    console.log("\n📚 Creating courses...");
    const courses = await Course.insertMany([
      {
        userId: users[1]._id, // Jane Smith (Artist)
        firstName: users[1].firstName,
        lastName: users[1].lastName,
        profileImage: null,
        title: "Digital Art Masterclass",
        description: "Learn digital art from scratch. Master tools like Photoshop, Illustrator, and Procreate.",
        courseType: "Video Course",
        category: "Digital Art",
        tags: "digital art, photoshop, illustration",
        price: 2999,
        discount: "10",
        licenseType: "Standard",
        thumbnail: "https://via.placeholder.com/400x300",
        releaseDate: new Date("2024-01-15"),
        expirationDate: null,
      },
      {
        userId: users[1]._id,
        firstName: users[1].firstName,
        lastName: users[1].lastName,
        profileImage: null,
        title: "Photography Fundamentals",
        description: "Complete guide to photography. Learn composition, lighting, and editing techniques.",
        courseType: "Video Course",
        category: "Photography",
        tags: "photography, camera, editing",
        price: 1999,
        discount: "15",
        licenseType: "Premium",
        thumbnail: "https://via.placeholder.com/400x300",
        releaseDate: new Date("2024-02-01"),
        expirationDate: null,
      },
      {
        userId: users[1]._id,
        firstName: users[1].firstName,
        lastName: users[1].lastName,
        profileImage: null,
        title: "Music Production Basics",
        description: "Start your journey in music production. Learn DAW, mixing, and mastering.",
        courseType: "Audio Course",
        category: "Music",
        tags: "music, production, audio",
        price: 2499,
        discount: "20",
        licenseType: "Standard",
        thumbnail: "https://via.placeholder.com/400x300",
        releaseDate: new Date("2024-03-10"),
        expirationDate: null,
      },
    ]);

    console.log(`✅ Created ${courses.length} courses`);

    // Create Job Postings
    console.log("\n💼 Creating job postings...");
    const jobs = await JobPosting.insertMany([
      {
        userId: users[3]._id, // Business Owner
        title: "Senior Graphic Designer",
        company: "Creative Studios",
        location: "Mumbai, India",
        overview: "We are looking for an experienced graphic designer to join our creative team.",
        responsibilities: "Create visual concepts, design marketing materials, collaborate with team",
        qualifications: "Bachelor's degree in Design, 5+ years experience, proficiency in Adobe Creative Suite",
        skills: ["Photoshop", "Illustrator", "InDesign", "UI/UX Design"],
        salary: "₹50,000 - ₹80,000",
        contactEmail: "hr@creativestudios.com",
        jobType: "Full-time",
        category: "Design",
      },
      {
        userId: users[3]._id,
        title: "Video Editor",
        company: "Media Productions",
        location: "Delhi, India",
        overview: "Seeking a creative video editor for our production team.",
        responsibilities: "Edit videos, add effects, color grading, sound design",
        qualifications: "Experience with Premiere Pro, After Effects, 3+ years experience",
        skills: ["Premiere Pro", "After Effects", "Color Grading", "Motion Graphics"],
        salary: "₹40,000 - ₹60,000",
        contactEmail: "jobs@mediaproductions.com",
        jobType: "Full-time",
        category: "Video Production",
      },
    ]);

    console.log(`✅ Created ${jobs.length} job postings`);

    // Create Portfolio
    console.log("\n🎨 Creating portfolios...");
    const portfolios = await Portfolio.insertMany([
      {
        userId: users[1]._id, // Jane Smith (Artist)
        firstName: users[1].firstName,
        lastName: users[1].lastName,
        tagline: "Digital Artist & Illustrator",
        about: "Passionate digital artist with 10+ years of experience creating stunning visuals.",
        coverPhoto: "https://via.placeholder.com/1200x400",
        profileImage: "https://via.placeholder.com/200x200",
        experienceOverview: "Specialized in digital illustration and character design",
        artistCategory: "Digital Artist",
        experience: [
          {
            title: "Senior Digital Artist",
            dateRange: { from: 2020, to: 2024 },
            description: "Created digital artwork for various clients",
          },
        ],
        education: [
          {
            degree: "BFA in Digital Arts",
            instituteName: "Art Institute",
            year: 2014,
            location: "Mumbai",
          },
        ],
        socialLinks: {
          instagram: "https://instagram.com/janesmith",
          website: "https://janesmith.com",
        },
      },
    ]);

    console.log(`✅ Created ${portfolios.length} portfolios`);

    // Create Movies
    console.log("\n🎬 Creating movies...");
    const movies = await Movie.insertMany([
      {
        userId: users[3]._id, // Business Owner
        poster: "https://via.placeholder.com/300x450",
        title: "The Art of Creation",
        year: 2024,
        duration: "120 min",
        rating: "8.5",
        age: "PG-13",
        overview: "A compelling story about artists and their creative journey.",
        plot: "Follow the journey of artists as they navigate the world of creativity.",
        starring: "Actor One, Actor Two",
        creators: "Creator Name",
        directors: "Director Name",
        writers: "Writer Name",
        producers: "Producer Name",
        dop: "Cinematographer Name",
        music: "Composer Name",
        genre: "Drama",
        trailer: "https://youtube.com/watch?v=example",
        images: "https://via.placeholder.com/800x600",
      },
    ]);

    console.log(`✅ Created ${movies.length} movies`);

    // Create Newsletter Subscriptions
    console.log("\n📧 Creating newsletter subscriptions...");
    const newsletters = await Newsletter.insertMany([
      { email: "subscriber1@example.com" },
      { email: "subscriber2@example.com" },
      { email: users[0].email },
    ]);

    console.log(`✅ Created ${newsletters.length} newsletter subscriptions`);

    // Create Contact Messages
    console.log("\n📮 Creating contact messages...");
    const contacts = await Contact.insertMany([
      {
        name: "John Contact",
        email: "contact1@example.com",
        message: "I'm interested in your courses. Please contact me.",
      },
      {
        name: "Sarah Contact",
        email: "contact2@example.com",
        message: "Great platform! Would love to collaborate.",
      },
    ]);

    console.log(`✅ Created ${contacts.length} contact messages`);

    console.log("\n✅ Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Courses: ${courses.length}`);
    console.log(`   - Job Postings: ${jobs.length}`);
    console.log(`   - Portfolios: ${portfolios.length}`);
    console.log(`   - Movies: ${movies.length}`);
    console.log(`   - Newsletter Subscriptions: ${newsletters.length}`);
    console.log(`   - Contact Messages: ${contacts.length}`);
    console.log("\n🔑 Test Credentials:");
    console.log("   Email: admin@livabhi.com");
    console.log("   Password: password123");
    console.log("\n   Email: john.doe@example.com");
    console.log("   Password: password123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run seed
(async () => {
  await connectDB();
  await seedData();
})();

