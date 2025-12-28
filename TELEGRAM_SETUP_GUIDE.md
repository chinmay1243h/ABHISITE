# Telegram Bot Setup Guide

This guide will help you set up Telegram bot for free file storage in your MERN course platform.

## Step 1: Create Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot` command
3. Choose a name for your bot (e.g., "Course Platform Bot")
4. Choose a username (must end with `bot`, e.g., "course_platform_bot")
5. BotFather will give you a **Bot Token** - save this securely

## Step 2: Create Private Channel

1. In Telegram, create a **new channel**
2. Set channel type to **Private**
3. Give it a name (e.g., "Course Files Storage")
4. Add your bot as an **Administrator** with full permissions
5. Get the **Channel ID**:
   - Post any message in the channel
   - Forward it to @userinfobot
   - The bot will show you the Channel ID (starts with `-100`)

## Step 3: Update Environment Variables

Update your `.env` file with the Telegram credentials:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHANNEL_ID=-1001234567890
TELEGRAM_SUPPORT_GROUP_ID=optional_support_group_id
```

## Step 4: Test Bot Integration

1. Start your server: `npm start`
2. Test the bot connection by visiting: `http://localhost:4000/api/telegram/test`
3. Check server logs for connection status

## Step 5: Security Best Practices

### Bot Security
- Never share your bot token publicly
- Use environment variables only
- Enable two-factor authentication on your Telegram account
- Regularly rotate bot tokens if compromised

### Channel Security
- Keep the channel private
- Only add trusted administrators
- Monitor channel activity regularly
- Backup important channel data

### API Security
- Use JWT authentication for all file operations
- Implement rate limiting (already included)
- Validate file types and sizes
- Never expose Telegram URLs to frontend

## Step 6: File Upload Guidelines

### Supported File Types
- **Videos**: MP4, AVI, MOV, WMV, WebM
- **Documents**: PDF, ZIP
- **Images**: JPEG, PNG, GIF, WebP
- **Audio**: MP3, WAV, M4A, OGG

### File Size Limits
- **Maximum**: 2GB per file (Telegram limit)
- **Recommended**: Under 500MB for better performance
- **Rate Limiting**: 10 uploads per hour per IP

### Storage Costs
- **100% FREE** - Telegram provides unlimited storage
- **No bandwidth costs** - Files stream directly from Telegram
- **No maintenance** - Telegram handles all infrastructure

## Step 7: API Usage Examples

### Upload File (Backend)
```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('courseId', courseId);
formData.append('description', 'Course video');

const response = await fetch('/api/telegram-files/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData
});
```

### Stream File (Frontend)
```javascript
// For video streaming
const streamUrl = `/api/telegram-files/${fileId}/stream`;
<video src={streamUrl} controls />

// For file download
const downloadUrl = `/api/telegram-files/${fileId}/download`;
<a href={downloadUrl} download>Download File</a>
```

## Step 8: Troubleshooting

### Common Issues

**Bot Token Error**
```
Error: 401 Unauthorized
```
- Verify bot token is correct
- Check if bot is still active
- Ensure bot hasn't been blocked by Telegram

**Channel Access Error**
```
Error: 403 Forbidden
```
- Verify channel ID is correct
- Ensure bot is admin in channel
- Check if channel is private

**File Upload Error**
```
Error: File too large
```
- Check file size under 2GB
- Verify file type is supported
- Check internet connection

**Rate Limit Error**
```
Error: Too many requests
```
- Wait for rate limit to reset
- Implement client-side throttling
- Use multiple bots if needed

### Debug Commands

```bash
# Test bot connection
curl http://localhost:4000/api/telegram/test

# Check bot info
curl -X GET "https://api.telegram.org/bot<TOKEN>/getMe"

# Check channel info
curl -X GET "https://api.telegram.org/bot<TOKEN>/getChat?chat_id=<CHANNEL_ID>"
```

## Step 9: Production Deployment

### Environment Variables
```env
NODE_ENV=production
TELEGRAM_BOT_TOKEN=production_bot_token
TELEGRAM_CHANNEL_ID=production_channel_id
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Security Headers
- Enable HTTPS only
- Set secure CORS origins
- Use secure cookies
- Implement CSP headers

### Monitoring
- Monitor upload/download rates
- Track error logs
- Set up alerts for bot failures
- Regular backup of course metadata

## Step 10: Advanced Features

### Multiple Bots (Load Balancing)
```javascript
// Create multiple bots for high-volume platforms
const bots = [
  new TelegramService(process.env.TELEGRAM_BOT_TOKEN_1),
  new TelegramService(process.env.TELEGRAM_BOT_TOKEN_2),
];
```

### File Compression
```javascript
// Compress videos before upload
const compressedFile = await compressVideo(file);
await telegramService.uploadFile(compressedFile);
```

### Thumbnail Generation
```javascript
// Generate video thumbnails automatically
const thumbnail = await generateThumbnail(videoFile);
await telegramService.uploadFile(thumbnail);
```

## Support

If you encounter issues:

1. Check Telegram Bot documentation: https://core.telegram.org/bots/api
2. Review server logs for detailed error messages
3. Verify all environment variables are set correctly
4. Test with small files first to ensure basic functionality

## Architecture Overview

```
Frontend (React)
    ↓ (JWT Auth)
Backend (Node.js)
    ↓ (Telegram Bot API)
Telegram Private Channel
    ↓ (File Storage)
Telegram Cloud Servers
```

This architecture ensures:
- **Zero storage costs** - Telegram provides free unlimited storage
- **High scalability** - Telegram handles all file infrastructure
- **Security** - Files never exposed to users directly
- **Performance** - Files stream directly from Telegram CDN
