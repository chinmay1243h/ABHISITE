const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PDFParser = require('pdf2json');
const mammoth = require('mammoth');
const { prepareResponse } = require('../utils/response');
const httpRes = require('../utils/http');
const logger = require('../utils/logger');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'), false);
    }
  }
});

// AI-powered resume parsing function
const parseResumeWithAI = async (text) => {
  // This is a sophisticated regex-based parser that simulates AI extraction
  // In production, you might want to integrate with OpenAI API, Google Cloud AI, or similar
  
  const parsedData = {
    personalInfo: {},
    experience: [],
    education: [],
    skills: [],
    summary: ''
  };

  // Extract personal information
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const nameRegex = /^([A-Z][a-z]+\s+[A-Z][a-z]+)/m;
  
  const emails = text.match(emailRegex) || [];
  const phones = text.match(phoneRegex) || [];
  const nameMatch = text.match(nameRegex);
  
  parsedData.personalInfo = {
    name: nameMatch ? nameMatch[1] : '',
    email: emails[0] || '',
    phone: phones[0] || '',
    location: extractLocation(text)
  };

  // Extract experience
  parsedData.experience = extractExperience(text);
  
  // Extract education
  parsedData.education = extractEducation(text);
  
  // Extract skills
  parsedData.skills = extractSkills(text);
  
  // Extract summary/objective
  parsedData.summary = extractSummary(text);

  return parsedData;
};

// Helper function to extract location
const extractLocation = (text) => {
  const locationPatterns = [
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2})\b/g,
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z][a-z]+)\b/g
  ];
  
  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match && match.length > 0) {
      return match[0];
    }
  }
  
  return '';
};

// Helper function to extract work experience
const extractExperience = (text) => {
  const experiences = [];
  
  // Look for experience patterns
  const experiencePatterns = [
    /([A-Z][a-zA-Z\s]+)\s*\n\s*([A-Z][a-zA-Z\s&]+)\s*\n\s*(\d{1,2}\/\d{4}\s*-\s*(?:\d{1,2}\/\d{4}|Present))/gi,
    /([A-Za-z\s]+)\s+at\s+([A-Za-z\s&]+)\s*\((\d{4}\s*-\s*(?:\d{4}|Present))\)/gi
  ];
  
  for (const pattern of experiencePatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      experiences.push({
        title: match[1].trim(),
        company: match[2].trim(),
        duration: match[3].trim(),
        description: extractDescriptionAfterMatch(text, match.index)
      });
    }
  }
  
  // If no structured patterns found, try to extract based on common keywords
  if (experiences.length === 0) {
    const lines = text.split('\n');
    let currentExperience = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Look for job titles
      if (isJobTitle(line)) {
        if (currentExperience) {
          experiences.push(currentExperience);
        }
        currentExperience = {
          title: line,
          company: '',
          duration: '',
          description: ''
        };
      } else if (currentExperience && !currentExperience.company && isCompanyName(line)) {
        currentExperience.company = line;
      } else if (currentExperience && !currentExperience.duration && isDateRange(line)) {
        currentExperience.duration = line;
      } else if (currentExperience && currentExperience.company && currentExperience.duration) {
        currentExperience.description += line + ' ';
      }
    }
    
    if (currentExperience && currentExperience.title) {
      experiences.push(currentExperience);
    }
  }
  
  return experiences.slice(0, 5); // Limit to 5 most recent experiences
};

// Helper function to extract education
const extractEducation = (text) => {
  const education = [];
  
  const educationPatterns = [
    /([A-Z][a-zA-Z\s]+(?:Degree|Bachelor|Master|PhD|B\.Tech|M\.Tech|B\.Sc|M\.Sc))\s*\n\s*([A-Z][a-zA-Z\s&]+)\s*\n\s*(\d{4})/gi,
    /([A-Za-z\s]+(?:Degree|Bachelor|Master|PhD|B\.Tech|M\.Tech|B\.Sc|M\.Sc))\s+at\s+([A-Za-z\s&]+)\s*\((\d{4})\)/gi
  ];
  
  for (const pattern of educationPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      education.push({
        degree: match[1].trim(),
        institute: match[2].trim(),
        year: match[3].trim(),
        location: ''
      });
    }
  }
  
  return education.slice(0, 3); // Limit to 3 most recent education entries
};

// Helper function to extract skills
const extractSkills = (text) => {
  const commonSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'HTML', 'CSS',
    'SQL', 'MongoDB', 'Express', 'Angular', 'Vue.js', 'TypeScript', 'Git',
    'Docker', 'AWS', 'Azure', 'Google Cloud', 'Machine Learning', 'Data Science',
    'Project Management', 'Leadership', 'Communication', 'Problem Solving',
    'Agile', 'Scrum', 'DevOps', 'CI/CD', 'Testing', 'REST API', 'GraphQL',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'Kubernetes'
  ];
  
  const foundSkills = [];
  const lowerText = text.toLowerCase();
  
  for (const skill of commonSkills) {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  }
  
  return foundSkills.slice(0, 10); // Limit to 10 skills
};

// Helper function to extract summary
const extractSummary = (text) => {
  const summaryPatterns = [
    /(?:Summary|Objective|Profile|About)\s*[:\-]\s*([^\n]+(?:\n[^A-Z][^\n]*)*)/gi,
    /^([A-Z][^.]*\.(?:\s+[A-Z][^.]*\.){0,2})/m
  ];
  
  for (const pattern of summaryPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim().substring(0, 300); // Limit summary length
    }
  }
  
  return '';
};

// Helper functions for pattern matching
const isJobTitle = (text) => {
  const jobTitles = [
    'Engineer', 'Developer', 'Manager', 'Director', 'Analyst', 'Designer',
    'Consultant', 'Specialist', 'Coordinator', 'Administrator', 'Associate',
    'Senior', 'Lead', 'Principal', 'Head', 'Chief', 'VP', 'President'
  ];
  
  return jobTitles.some(title => 
    text.toLowerCase().includes(title.toLowerCase()) && text.length < 50
  );
};

const isCompanyName = (text) => {
  // Simple heuristic: if it contains common company indicators
  return text.includes('Inc') || text.includes('Ltd') || text.includes('LLC') || 
         text.includes('Corporation') || text.includes('Company') || text.length < 50;
};

const isDateRange = (text) => {
  const datePattern = /\d{4}|\d{1,2}\/\d{4}|Present|\d{1,2}\/\d{2}/;
  return datePattern.test(text) && (text.includes('-') || text.includes('to') || text.includes('–'));
};

const extractDescriptionAfterMatch = (text, startIndex) => {
  const lines = text.substring(startIndex).split('\n');
  let description = '';
  let descriptionLines = 0;
  
  for (let i = 1; i < lines.length && descriptionLines < 3; i++) {
    const line = lines[i].trim();
    if (line && !isJobTitle(line) && !isDateRange(line)) {
      description += line + ' ';
      descriptionLines++;
    } else if (isJobTitle(line)) {
      break;
    }
  }
  
  return description.trim().substring(0, 200);
};

// Main controller function
exports.parseResume = async (req, res) => {
  try {
    logger.info('Resume parsing request received');
    logger.info('File info:', req.file ? {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : 'No file');
    
    if (!req.file) {
      logger.error('No file uploaded');
      return res.status(httpRes.BAD_REQUEST).json(
        prepareResponse("BAD_REQUEST", "No file uploaded", null, null)
      );
    }

    let text = '';

    // Extract text based on file type
    logger.info('Starting text extraction for file type:', req.file.mimetype);
    
    if (req.file.mimetype === 'application/pdf') {
      try {
        logger.info('Parsing PDF file...');
        // Use pdf2json to extract text
        const pdfParser = new PDFParser();
        text = await new Promise((resolve, reject) => {
          pdfParser.on('pdfParser_dataError', (errData) => {
            logger.error('PDF parsing error:', errData);
            reject(errData.parserError);
          });
          pdfParser.on('pdfParser_dataReady', (pdfData) => {
            logger.info('PDF data ready, extracting text...');
            let extractedText = '';
            if (pdfData.Pages) {
              pdfData.Pages.forEach((page) => {
                if (page.Texts) {
                  page.Texts.forEach((textItem) => {
                    if (textItem.R && textItem.R.length > 0) {
                      textItem.R.forEach((r) => {
                        if (r.T) {
                          extractedText += decodeURIComponent(r.T) + ' ';
                        }
                      });
                    }
                  });
                }
              });
            }
            logger.info('Extracted text length:', extractedText.length);
            resolve(extractedText.trim());
          });
          pdfParser.parseBuffer(req.file.buffer);
        });
        logger.info('PDF parsing completed');
      } catch (error) {
        logger.error('PDF parsing error:', error);
        return res.status(httpRes.BAD_REQUEST).json(
          prepareResponse("BAD_REQUEST", "Failed to parse PDF file", null, null)
        );
      }
    } else if (req.file.mimetype.includes('word') || req.file.mimetype.includes('document')) {
      try {
        logger.info('Parsing Word document...');
        const result = await mammoth.extractRawText({ buffer: req.file.buffer });
        text = result.value;
        logger.info('Word document parsing completed, text length:', text.length);
      } catch (error) {
        logger.error('Word document parsing error:', error);
        return res.status(httpRes.BAD_REQUEST).json(
          prepareResponse("BAD_REQUEST", "Failed to parse Word document", null, null)
        );
      }
    } else {
      logger.error('Unsupported file type:', req.file.mimetype);
      return res.status(httpRes.BAD_REQUEST).json(
        prepareResponse("BAD_REQUEST", "Unsupported file type. Please upload PDF or Word document.", null, null)
      );
    }

    if (!text || text.trim().length < 50) {
      logger.error('Insufficient text extracted:', text.length);
      return res.status(httpRes.BAD_REQUEST).json(
        prepareResponse("BAD_REQUEST", "Could not extract sufficient text from resume", null, null)
      );
    }

    logger.info('Text extraction successful, length:', text.length);

    // Parse the extracted text
    const parsedData = await parseResumeWithAI(text);
    logger.info('Resume parsing completed successfully');

    return res.status(httpRes.OK).json(
      prepareResponse("OK", "Resume parsed successfully", parsedData, null)
    );

  } catch (error) {
    logger.error('Resume parsing error:', error);
    return res.status(httpRes.SERVER_ERROR).json(
      prepareResponse("SERVER_ERROR", "Failed to parse resume", null, error.message)
    );
  }
};

// Middleware for file upload
exports.uploadMiddleware = upload.single('resume');
