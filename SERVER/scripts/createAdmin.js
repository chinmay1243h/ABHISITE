require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/user.model");
const { hashPassword } = require("../src/utils/Password");

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || `mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '27017'}/${process.env.DB_NAME || 'livabhi'}`;
    
    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    };
    
    await mongoose.connect(mongoURI, options);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Create admin user
const createAdmin = async () => {
  try {
    // Admin credentials
    const adminEmail = "admin@livabhi.com";
    const adminPassword = "Admin@123"; // Default password
    const adminFirstName = "Admin";
    const adminLastName = "User";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`⚠️  Admin with email ${adminEmail} already exists!`);
      console.log("   Updating password...");
      
      // Update password
      const hashedPassword = await hashPassword(adminPassword);
      existingAdmin.password = hashedPassword;
      existingAdmin.role = "Admin";
      existingAdmin.status = "Varified";
      existingAdmin.isVerified = true;
      await existingAdmin.save();
      
      console.log(`✅ Admin password updated successfully!`);
      console.log(`\n📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await hashPassword(adminPassword);

    // Create admin user
    const admin = new User({
      firstName: adminFirstName,
      lastName: adminLastName,
      email: adminEmail,
      password: hashedPassword,
      role: "Admin",
      status: "Varified",
      isVerified: true,
      profileImage: null,
    });

    await admin.save();
    
    console.log("✅ Admin user created successfully!");
    console.log("\n📧 Email:", adminEmail);
    console.log("🔑 Password:", adminPassword);
    console.log("\n💡 You can now login using these credentials:");
    console.log(`   - Frontend: http://localhost:3000/login`);
    console.log(`   - Admin Dashboard: http://localhost:3000/admin-dashboard`);
    console.log(`   - API: POST http://localhost:4000/api/auth/login`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

// Run script
(async () => {
  await connectDB();
  await createAdmin();
})();

