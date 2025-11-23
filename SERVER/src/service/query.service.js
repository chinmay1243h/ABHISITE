const model = require("../models/mappingIndex");
const mongoose = require("mongoose");
const logger = require("../utils/logger");
const { normalizeTableName } = require("../middleware/asyncHandler");

// Helper function to normalize and validate table name
const normalizeAndValidateTableName = (tableName) => {
  const normalized = normalizeTableName(tableName);
  if (!model[normalized]) {
    throw new Error(`Model ${tableName} (normalized: ${normalized}) not found. Available models: ${Object.keys(model).join(', ')}`);
  }
  return normalized;
};

const addData = async (tableName, obj) => {
  // Normalize table name to handle case sensitivity
  tableName = normalizeAndValidateTableName(tableName);
  
  // Convert userId to ObjectId if it's a string
  if (obj.userId && typeof obj.userId === 'string' && mongoose.Types.ObjectId.isValid(obj.userId)) {
    obj.userId = new mongoose.Types.ObjectId(obj.userId);
  }
  
  // Clean up null/undefined/empty string values
  Object.keys(obj).forEach(key => {
    if (obj[key] === '' || obj[key] === undefined) {
      obj[key] = null;
    }
  });
  
  return await model[tableName].create(obj);
};

const addBulkCreate = async (tableName, obj) => {
  // Check if model exists
  if (!model[tableName]) {
    throw new Error(`Model ${tableName} not found. Available models: ${Object.keys(model).join(', ')}`);
  }
  return await model[tableName].insertMany(obj);
};

const getAllDataByCondAndPagination = async (
  tableName,
  cond,
  page,
  pageSize,
  order
) => {
  // Check if model exists
  if (!model[tableName]) {
    throw new Error(`Model ${tableName} not found. Available models: ${Object.keys(model).join(', ')}`);
  }
  
  const skip = page * pageSize;
  const limit = pageSize;
  let filter = cond.filter || "";
  let fields = cond.fields || [];
  delete cond.filter;
  delete cond.fields;

  let query = { ...cond };

  // Build search query if filter exists
  if (filter !== "" && fields.length > 0) {
    const searchRegex = new RegExp(filter, "i");
    query.$or = fields.map((field) => ({
      [field]: { $regex: searchRegex },
    }));
  }

  // Convert order array to Mongoose sort format
  let sort = {};
  if (order && Array.isArray(order) && order.length > 0) {
    order.forEach(([field, direction]) => {
      sort[field] = direction === "ASC" ? 1 : -1;
    });
  } else {
    sort.createdAt = -1; // Default sort
  }

  const [data, total] = await Promise.all([
    model[tableName].find(query).sort(sort).skip(skip).limit(limit).lean(),
    model[tableName].countDocuments(query),
  ]);

  return {
    rows: data,
    count: total,
  };
};

const updateData = async (tableName, cond, obj) => {
  // Convert string IDs to ObjectId if needed
  const convertedCond = { ...cond };
  
  if (convertedCond.id) {
    if (mongoose.Types.ObjectId.isValid(convertedCond.id)) {
      convertedCond._id = new mongoose.Types.ObjectId(convertedCond.id);
    }
    delete convertedCond.id;
  }

  const result = await model[tableName].updateMany(convertedCond, { $set: obj });
  return result;
};

const deleteData = async (tableName, cond) => {
  // Convert string IDs to ObjectId if needed
  const convertedCond = { ...cond };
  
  if (convertedCond.id) {
    if (mongoose.Types.ObjectId.isValid(convertedCond.id)) {
      convertedCond._id = new mongoose.Types.ObjectId(convertedCond.id);
    }
    delete convertedCond.id;
  }

  return await model[tableName].deleteMany(convertedCond);
};

const getAllData = async (tableName) => {
  return await model[tableName].find().lean();
};

const getAllDataByCond = async (tableName, cond) => {
  // Check if model exists
  if (!model[tableName]) {
    throw new Error(`Model ${tableName} not found. Available models: ${Object.keys(model).join(', ')}`);
  }
  
  if (cond && cond.fieldName) {
    if (cond.fieldName.toLowerCase().includes("date")) {
      cond[cond.fieldName] = { $gte: new Date(cond.fieldValue) };
      delete cond.fieldName;
      delete cond.fieldValue;
    }
    return await model[tableName].find(cond).lean();
  } else {
    return await model[tableName].find(cond || {}).lean();
  }
};

const findAndCountAllDataByCond = async (tableName, cond, other = {}) => {
  const query = model[tableName].find(cond);
  
  if (other.order) {
    let sort = {};
    if (Array.isArray(other.order)) {
      other.order.forEach(([field, direction]) => {
        sort[field] = direction === "ASC" ? 1 : -1;
      });
      query.sort(sort);
    }
  }

  if (other.limit) {
    query.limit(other.limit);
  }

  if (other.offset) {
    query.skip(other.offset);
  }

  const [data, count] = await Promise.all([
    query.lean(),
    model[tableName].countDocuments(cond),
  ]);

  return {
    rows: data,
    count: count,
  };
};

const getOneDataByCond = async (tableName, cond) => {
  // Check if model exists
  if (!model[tableName]) {
    throw new Error(`Model ${tableName} not found. Available models: ${Object.keys(model).join(', ')}`);
  }
  
  // Convert string ID to ObjectId if needed
  const convertedCond = { ...cond };
  
  if (convertedCond.id) {
    if (mongoose.Types.ObjectId.isValid(convertedCond.id)) {
      convertedCond._id = new mongoose.Types.ObjectId(convertedCond.id);
    }
    delete convertedCond.id;
  }

  return await model[tableName].findOne(convertedCond).lean();
};

const getAllDataByAttr = async (tableName, attr) => {
  const projection = {};
  attr.forEach((field) => {
    projection[field] = 1;
  });
  return await model[tableName].find({}, projection).lean();
};

const getAllDataByCondWithHasAll = async (tableName, cond, secondTable) => {
  return await model[tableName].find(cond).populate(secondTable).lean();
};

const getOneDataByCondWithHasAll = async (tableName, cond, secondTable) => {
  // Convert string ID to ObjectId if needed
  const convertedCond = { ...cond };
  
  if (convertedCond.id) {
    if (mongoose.Types.ObjectId.isValid(convertedCond.id)) {
      convertedCond._id = new mongoose.Types.ObjectId(convertedCond.id);
    }
    delete convertedCond.id;
  }

  return await model[tableName].findOne(convertedCond).populate(secondTable).lean();
};

const getAllDataByCondWithBelongsTo = async (tableName, cond, secondTable) => {
  // Check if the model exists
  if (!model[tableName]) {
    throw new Error(`Model ${tableName} not found`);
  }
  
  // Try to populate with strictPopulate disabled to handle cases where the path doesn't exist
  // This is useful for reverse relationships or virtual populates
  try {
    return await model[tableName].find(cond).populate({
      path: secondTable,
      strictPopulate: false
    }).lean();
  } catch (error) {
    // If populate fails, return data without populating
    logger.warn(`Failed to populate ${secondTable} on ${tableName}: ${error.message}`);
    return await model[tableName].find(cond).lean();
  }
};

const getOneDataByCondWithBelongsTo = async (tableName, cond, secondTable) => {
  // Check if the model exists
  if (!model[tableName]) {
    throw new Error(`Model ${tableName} not found`);
  }
  
  // Convert string ID to ObjectId if needed
  const convertedCond = { ...cond };
  
  if (convertedCond.id) {
    if (mongoose.Types.ObjectId.isValid(convertedCond.id)) {
      convertedCond._id = new mongoose.Types.ObjectId(convertedCond.id);
    }
    delete convertedCond.id;
  }

  // Try to populate with strictPopulate disabled to handle cases where the path doesn't exist
  // This is useful for reverse relationships or virtual populates
  try {
    return await model[tableName].findOne(convertedCond).populate({
      path: secondTable,
      strictPopulate: false
    }).lean();
  } catch (error) {
    // If populate fails, return data without populating
    logger.warn(`Failed to populate ${secondTable} on ${tableName}: ${error.message}`);
    return await model[tableName].findOne(convertedCond).lean();
  }
};

module.exports = {
  addData,
  addBulkCreate,
  updateData,
  deleteData,
  getAllData,
  getAllDataByCond,
  getAllDataByAttr,
  getAllDataByCondWithBelongsTo,
  getAllDataByCondAndPagination,
  getOneDataByCond,
  getOneDataByCondWithBelongsTo,
  getAllDataByCondWithHasAll,
  getOneDataByCondWithHasAll,
  findAndCountAllDataByCond,
};