const httpResponseCodes = require("../utils/http");
const { prepareResponse } = require("../utils/response");
const { SERVER_ERROR_MESSAGE } = require("../utils/messages");
const model = require("../models/mappingIndex");

// Function to normalize table name (handle case sensitivity and common variations)
const normalizeTableName = (tableName) => {
  if (!tableName) return tableName;
  
  // Get all available model names
  const modelNames = Object.keys(model);
  
  // Check for exact match first
  if (model[tableName]) {
    return tableName;
  }
  
  // Check for case-insensitive match
  const caseInsensitiveMatch = modelNames.find(name => name.toLowerCase() === tableName.toLowerCase());
  if (caseInsensitiveMatch) {
    console.log(`Normalized table name: ${tableName} -> ${caseInsensitiveMatch}`);
    return caseInsensitiveMatch;
  }
  
  // Handle common variations with explicit mappings
  const variations = {
    'NewsandBlogs': 'NewsAndBlogs',  // lowercase 'a'
    'newsandblogs': 'NewsAndBlogs',  // all lowercase
    'NewsAndBlogs': 'NewsAndBlogs',  // correct format
    'JobPosting': 'JobPosting',
    'jobposting': 'JobPosting',
    'PortfolioProject': 'PortfolioProject',
    'portfolioproject': 'PortfolioProject',
    'PortfolioContact': 'PortfolioContact',
    'portfoliocontact': 'PortfolioContact',
    'PortfolioAchievement': 'PortfolioAchievement',
    'portfolioachievement': 'PortfolioAchievement',
    'Movies': 'Movie',
    'movies': 'Movie',
  };
  
  if (variations[tableName]) {
    console.log(`Normalized table name via variations: ${tableName} -> ${variations[tableName]}`);
    return variations[tableName];
  }
  
  // If no match found, return original (will be caught by model validation)
  console.warn(`Could not normalize table name: ${tableName}. Available models: ${modelNames.join(', ')}`);
  return tableName;
};

const asyncHandler = (tableName, cb) => async (req, res, next) => {
  try {
    req.tableName = tableName;
    if (tableName === "") {
      req.tableName = req.params.tableName;
      delete req.params.tableName;
      
      // Normalize the table name
      req.tableName = normalizeTableName(req.tableName);
    }
    await cb(req, res, next);
  } catch (err) {
    return res
      .status(httpResponseCodes.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, err));
  }
  return true;
};

module.exports = {
  asyncHandler,
  normalizeTableName,
};
