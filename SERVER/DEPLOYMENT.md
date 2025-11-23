# Deployment Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB installed (or MongoDB Atlas account)
- Docker and Docker Compose (optional, for containerized deployment)

## Free Deployment Options

### Option 1: Vercel/Netlify + MongoDB Atlas + Railway

#### Backend (Railway/Render):
1. Sign up at [Railway.app](https://railway.app) or [Render.com](https://render.com)
2. Connect your GitHub repository
3. Set environment variables (see .env.example)
4. Deploy

#### Database (MongoDB Atlas):
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
2. Create a cluster
3. Create a database user
4. Whitelist IP addresses (or 0.0.0.0/0 for all)
5. Get connection string and add to environment variables

#### Frontend (Vercel/Netlify):
1. Sign up at [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
2. Connect your repository
3. Set build command: `npm run build`
4. Set output directory: `build`
5. Add environment variables for API endpoint

### Option 2: Docker Compose (Local/VPS)

1. Clone repository
2. Copy `.env.example` to `.env` and configure
3. Run:
   ```bash
   docker-compose up -d
   ```

### Option 3: Traditional Deployment (VPS)

#### Backend Setup:
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone and setup
git clone <repository-url>
cd livabhi-server-main/livabhi-server-main
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Start with PM2
pm2 start src/index.js --name livabhi-backend
pm2 save
pm2 startup
```

#### MongoDB Setup:
```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Frontend Setup (Build and Serve):
```bash
cd livabhi-ui-main/livabhi-ui-main
npm install
npm run build

# Serve with nginx or serve static files
sudo apt-get install nginx
sudo cp -r build/* /var/www/html/
```

## Environment Variables

See `.env.example` for all required environment variables.

## Important Notes

1. **MongoDB Connection**: Use MongoDB Atlas for free cloud database, or install MongoDB locally
2. **Telegram Bot**: Create a bot via [@BotFather](https://t.me/BotFather) on Telegram and get token
3. **Razorpay**: Sign up at [Razorpay](https://razorpay.com) for payment integration
4. **AWS S3**: Sign up at AWS for file storage, or use Cloudinary (already in dependencies)
5. **Email**: Configure email service for OTP sending (Gmail SMTP or SendGrid)

## Free Hosting Services

- **Backend**: Railway.app, Render.com, Fly.io, Heroku (paid now)
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Database**: MongoDB Atlas (free tier)
- **File Storage**: AWS S3 free tier, Cloudinary free tier

## Migration from MySQL to MongoDB

The system has been migrated from MySQL to MongoDB. Old data needs to be migrated manually or via migration scripts.



