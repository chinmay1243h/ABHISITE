const TelegramBot = require('node-telegram-bot-api');

class TelegramService {
  constructor() {
    this.bot = null;
    this.channelId = process.env.TELEGRAM_CHANNEL_ID;
    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!this.botToken || !this.channelId) {
      console.warn('TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID are required for Telegram file storage');
      return;
    }
    
    // Initialize bot with polling disabled
    this.bot = new TelegramBot(this.botToken, { polling: false });
  }

  /**
   * Upload file to Telegram private channel
   * @param {Buffer|string} fileData - File buffer or path
   * @param {string} filename - Original filename
   * @param {string} mimeType - File MIME type
   * @param {string} caption - Optional caption for the file
   * @returns {Promise<Object>} - Telegram file info
   */
  async uploadFile(fileData, filename, mimeType, caption = '') {
    try {
      const options = {
        caption: caption.substring(0, 1024), // Telegram caption limit
        parse_mode: 'HTML'
      };

      let message;
      
      // Determine upload method based on file type
      if (mimeType.startsWith('image/')) {
        message = await this.bot.sendPhoto(this.channelId, fileData, options);
      } else if (mimeType.startsWith('video/')) {
        message = await this.bot.sendVideo(this.channelId, fileData, options);
      } else if (mimeType.startsWith('audio/')) {
        message = await this.bot.sendAudio(this.channelId, fileData, options);
      } else if (mimeType === 'application/pdf') {
        message = await this.bot.sendDocument(this.channelId, fileData, options);
      } else {
        // For other file types, use document method
        message = await this.bot.sendDocument(this.channelId, fileData, options);
      }

      // Extract file information
      const fileInfo = this.extractFileInfo(message);
      
      return {
        success: true,
        messageId: message.message_id,
        fileId: fileInfo.fileId,
        fileSize: fileInfo.fileSize,
        mimeType: fileInfo.mimeType,
        filename: filename
      };

    } catch (error) {
      console.error('Telegram upload error:', error);
      throw new Error(`Failed to upload file to Telegram: ${error.message}`);
    }
  }

  /**
   * Get file download link from Telegram
   * @param {string} fileId - Telegram file ID
   * @returns {Promise<string>} - Download URL
   */
  async getFileLink(fileId) {
    try {
      const fileInfo = await this.bot.getFile(fileId);
      
      if (!fileInfo) {
        throw new Error('File not found');
      }

      // Create direct download URL
      const downloadUrl = `https://api.telegram.org/file/bot${this.botToken}/${fileInfo.file_path}`;
      
      return {
        success: true,
        downloadUrl: downloadUrl,
        filePath: fileInfo.file_path,
        fileSize: fileInfo.file_size
      };

    } catch (error) {
      console.error('Telegram get file error:', error);
      throw new Error(`Failed to get file link: ${error.message}`);
    }
  }

  /**
   * Stream file from Telegram
   * @param {string} fileId - Telegram file ID
   * @returns {Promise<Stream>} - File stream
   */
  async getFileStream(fileId) {
    try {
      const fileInfo = await this.bot.getFile(fileId);
      
      if (!fileInfo) {
        throw new Error('File not found');
      }

      // Get file stream
      const fileStream = this.bot.getFileStream(fileId);
      
      return fileStream;

    } catch (error) {
      console.error('Telegram stream error:', error);
      throw new Error(`Failed to stream file: ${error.message}`);
    }
  }

  /**
   * Delete message from channel
   * @param {number} messageId - Message ID to delete
   * @returns {Promise<boolean>} - Success status
   */
  async deleteMessage(messageId) {
    try {
      await this.bot.deleteMessage(this.channelId, messageId);
      return true;
    } catch (error) {
      console.error('Telegram delete error:', error);
      return false;
    }
  }

  /**
   * Extract file information from Telegram message
   * @param {Object} message - Telegram message object
   * @returns {Object} - File information
   */
  extractFileInfo(message) {
    let fileInfo = {};

    if (message.photo) {
      // Get the largest photo
      const photo = message.photo[message.photo.length - 1];
      fileInfo = {
        fileId: photo.file_id,
        fileSize: photo.file_size,
        mimeType: 'image/jpeg'
      };
    } else if (message.video) {
      fileInfo = {
        fileId: message.video.file_id,
        fileSize: message.video.file_size,
        mimeType: message.video.mime_type
      };
    } else if (message.audio) {
      fileInfo = {
        fileId: message.audio.file_id,
        fileSize: message.audio.file_size,
        mimeType: message.audio.mime_type
      };
    } else if (message.document) {
      fileInfo = {
        fileId: message.document.file_id,
        fileSize: message.document.file_size,
        mimeType: message.document.mime_type
      };
    }

    return fileInfo;
  }

  /**
   * Get bot information
   * @returns {Promise<Object>} - Bot information
   */
  async getBotInfo() {
    try {
      const botInfo = await this.bot.getMe();
      return botInfo;
    } catch (error) {
      console.error('Telegram bot info error:', error);
      throw new Error(`Failed to get bot info: ${error.message}`);
    }
  }

  /**
   * Check if bot is member of channel
   * @returns {Promise<boolean>} - Bot membership status
   */
  async checkChannelAccess() {
    try {
      const chatMember = await this.bot.getChatMember(this.channelId, this.botToken.split(':')[0]);
      return chatMember.status === 'administrator' || chatMember.status === 'creator';
    } catch (error) {
      console.error('Telegram channel access error:', error);
      return false;
    }
  }
}

module.exports = TelegramService;
