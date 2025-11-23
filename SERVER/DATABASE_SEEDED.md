# ✅ Database Successfully Seeded!

## Sample Data Created

The database has been populated with sample data for testing and development.

### 📊 Data Summary

- **Users**: 4 users (Admin, Artist, Business, Regular User)
- **Courses**: 3 courses (Digital Art, Photography, Music Production)
- **Job Postings**: 2 job postings
- **Portfolios**: 1 portfolio
- **Movies**: 1 movie
- **Newsletter Subscriptions**: 3 subscriptions
- **Contact Messages**: 2 messages

## 🔑 Test Credentials

### Admin Account
- **Email**: `admin@livabhi.com`
- **Password**: `password123`
- **Role**: Admin

### Regular User Account
- **Email**: `john.doe@example.com`
- **Password**: `password123`
- **Role**: User

### Artist Account
- **Email**: `jane.smith@example.com`
- **Password**: `password123`
- **Role**: Artist

### Business Account
- **Email**: `business@livabhi.com`
- **Password**: `password123`
- **Role**: Business

## 🚀 Running the Seed Script

To populate the database again (will add duplicate data unless you clear collections first):

```bash
npm run seed
```

## 📝 Notes

- All passwords are hashed using bcrypt
- Users are marked as verified
- Sample data includes realistic content for testing
- You can modify `scripts/seedData.js` to add more or different sample data

## 🔄 To Clear and Reseed

If you want to start fresh, uncomment the delete lines in `scripts/seedData.js`:

```javascript
// Clear existing data
await User.deleteMany({});
await Course.deleteMany({});
// ... etc
```

Then run `npm run seed` again.



