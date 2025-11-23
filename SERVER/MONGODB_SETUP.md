# MongoDB Atlas Quick Setup Guide

## Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with your email (Free tier available)

## Step 2: Create a Cluster
1. After login, click **"Build a Database"**
2. Choose **"M0 FREE"** (Free tier - 512MB storage)
3. Select a cloud provider (AWS recommended)
4. Choose a region closest to you
5. Click **"Create"** (takes 3-5 minutes)

## Step 3: Create Database User
1. Go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter username (e.g., `livabhi_user`)
5. Click **"Autogenerate Secure Password"** or create your own
6. **SAVE THE PASSWORD** - you'll need it!
7. Set privileges to **"Atlas admin"**
8. Click **"Add User"**

## Step 4: Whitelist IP Address
1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. For local development, click **"Add Current IP Address"**
   - OR click **"Allow Access from Anywhere"** (0.0.0.0/0) - less secure but easier
4. Click **"Confirm"**

## Step 5: Get Connection String
1. Go to **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** and version **"5.5 or later"**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update .env File
Replace the `MONGODB_URI` in your `.env` file:

**Before:**
```
MONGODB_URI=mongodb://localhost:27017/livabhi
```

**After (replace with your actual values):**
```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/livabhi?retryWrites=true&w=majority
```

**Important:**
- Replace `your-username` with your database username
- Replace `your-password` with your database password (URL encode special characters: `@` becomes `%40`, `#` becomes `%23`, etc.)
- Replace `cluster0.xxxxx` with your actual cluster name
- Add `/livabhi` before the `?` to specify the database name

## Step 7: Test Connection
After updating `.env`, restart your server:
```bash
npm start
```

You should see: `MongoDB Connected Successfully`

## Troubleshooting

### Connection Timeout
- Check if your IP is whitelisted in Network Access
- Try "Allow Access from Anywhere" (0.0.0.0/0) for testing

### Authentication Failed
- Verify username and password are correct
- Make sure password is URL-encoded if it has special characters
- Check if the database user has proper permissions

### Connection String Format
Make sure your connection string includes:
- `mongodb+srv://` (for Atlas)
- Username and password
- Cluster address
- Database name (`/livabhi`)
- Connection options (`?retryWrites=true&w=majority`)

## Example .env Entry
```
MONGODB_URI=mongodb+srv://livabhi_user:MyP@ssw0rd123@cluster0.abc123.mongodb.net/livabhi?retryWrites=true&w=majority
```



