const queryService = require("../service/query.service");
const httpres = require("../utils/http");
const {
  SERVER_ERROR_MESSAGE,
  ADD,
  UPDATE,
  GET,
  DELETE,
} = require("../utils/messages");
const { prepareResponse } = require("../utils/response");
const logger = require("../utils/logger");

exports.createData = async (req, res) => {
  try {
    // Normalize table name to handle case sensitivity
    const { normalizeTableName } = require("../middleware/asyncHandler");
    req.tableName = normalizeTableName(req.tableName);
    
    logger.info(`Creating ${req.tableName} with data:`, JSON.stringify(req.body, null, 2));
    
    // Clean up data - remove null/undefined thumbnail if empty
    if (req.body.thumbnail === null || req.body.thumbnail === undefined || req.body.thumbnail === '') {
      req.body.thumbnail = null;
    }
    
    let result = await queryService.addData(req.tableName, req.body);
    res
      .status(httpres.CREATED)
      .json(prepareResponse("CREATED", ADD, result, null));
  } catch (error) {
    logger.error(`Error creating ${req.tableName}:`, error);
    logger.error("Error message:", error.message);
    logger.error("Error stack:", error.stack);
    logger.error("Request body:", JSON.stringify(req.body, null, 2));
    
    // Provide more specific error messages
    let errorMessage = SERVER_ERROR_MESSAGE;
    if (error.message) {
      errorMessage = error.message;
      // Handle validation errors
      if (error.message.includes('validation failed') || error.message.includes('required')) {
        errorMessage = `Validation error: ${error.message}`;
      }
      // Handle duplicate key errors
      if (error.code === 11000) {
        errorMessage = "Duplicate entry. This record already exists.";
      }
    }
    
    res
      .status(httpres.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", errorMessage, null, error.message || error.toString()));
  }
};

exports.insertManyData = async (req, res) => {
  try {
    let result = await queryService.addBulkCreate(req.tableName, req.body);
    res
      .status(httpres.CREATED)
      .json(prepareResponse("CREATED", ADD, result, null));
  } catch (error) {
    logger.error("Internal server error:" + error);
    res
      .status(httpres.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

exports.getAllRecod = async (req, res) => {
  try {
    // Normalize table name to handle case sensitivity
    const { normalizeTableName } = require("../middleware/asyncHandler");
    req.tableName = normalizeTableName(req.tableName);
    
    let result = await queryService.getAllDataByCond(req.tableName, req.body);
    res.status(httpres.OK).json(prepareResponse("OK", GET, result, null));
  } catch (error) {
    logger.error("Internal server error:" + error);
    res
      .status(httpres.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};
exports.getAllRecordBelongsTo = async (req, res) => {
  try {
    let secondTable = req.body.secondTable;
    delete req.body.secondTable;
    let result = await queryService.getAllDataByCondWithBelongsTo(
      req.tableName,
      req.body,
      secondTable
    );
    res.status(httpres.OK).json(prepareResponse("OK", GET, result, null));
  } catch (error) {
    logger.error("Internal server error:" + error);
    res
      .status(httpres.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};
exports.updaterecord = async (req, res) => {
  try {
    logger.info(`Updating ${req.tableName} with id:`, req.params.id);
    logger.info("Update data:", JSON.stringify(req.body, null, 2));
    
    // Clean up data - remove null/undefined thumbnail if empty
    if (req.body.thumbnail === null || req.body.thumbnail === undefined || req.body.thumbnail === '') {
      req.body.thumbnail = null;
    }
    
    let result = await queryService.updateData(
      req.tableName,
      req.params,
      req.body
    );
    
    // Check if any documents were updated
    if (result.matchedCount === 0) {
      logger.warn(`No ${req.tableName} found with id:`, req.params.id);
      return res
        .status(httpres.NOT_FOUND)
        .json(prepareResponse("NOT_FOUND", "Record not found", null, null));
    }
    
    logger.info(`Successfully updated ${result.modifiedCount} record(s) in ${req.tableName}`);
    res.status(httpres.OK).json(prepareResponse("OK", UPDATE, result, null));
  } catch (error) {
    logger.error(`Error updating ${req.tableName}:`, error);
    logger.error("Error message:", error.message);
    logger.error("Error stack:", error.stack);
    res
      .status(httpres.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error.message || error.toString()));
  }
};
exports.deleterecord = async (req, res) => {
  try {
    // Normalize table name to handle case sensitivity
    const { normalizeTableName } = require("../middleware/asyncHandler");
    req.tableName = normalizeTableName(req.tableName);
    
    logger.info(`Deleting ${req.tableName} with id:`, req.params.id);
    
    let result = await queryService.deleteData(req.tableName, req.params);
    
    // Check if any documents were deleted
    if (result.deletedCount === 0) {
      logger.warn(`No ${req.tableName} found with id:`, req.params.id);
      return res
        .status(httpres.NOT_FOUND)
        .json(prepareResponse("NOT_FOUND", "Record not found", null, null));
    }
    
    logger.info(`Successfully deleted ${result.deletedCount} record(s) from ${req.tableName}`);
    res.status(httpres.OK).json(prepareResponse("OK", DELETE, { deletedCount: result.deletedCount }, null));
  } catch (error) {
    logger.error(`Error deleting ${req.tableName}:`, error);
    logger.error("Error message:", error.message);
    logger.error("Error stack:", error.stack);
    res
      .status(httpres.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error.message || error.toString()));
  }
};

exports.getOneData = async (req, res) => {
  try {
    // const id = req.params.id;

    let result = await queryService.getOneDataByCond(req.tableName, req.params);
    res.status(httpres.OK).json(prepareResponse("OK", GET, result, null));
  } catch (error) {
    logger.error("Internal server error:" + error);
    res
      .status(httpres.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", SERVER_ERROR_MESSAGE, null, error));
  }
};

exports.getOneDataByUniqeKey = async (req, res) => {
  try {
    // Normalize table name to handle case sensitivity
    const { normalizeTableName } = require("../middleware/asyncHandler");
    req.tableName = normalizeTableName(req.tableName);
    
    logger.info(`Getting one record for ${req.tableName} with query:`, JSON.stringify(req.query, null, 2));
    
    // Check if tableName is provided
    if (!req.tableName) {
      return res
        .status(httpres.BAD_REQUEST)
        .json(prepareResponse("BAD_REQUEST", "Table name is required", null, null));
    }
    
    let result = await queryService.getOneDataByCond(req.tableName, req.query);
    res.status(httpres.OK).json(prepareResponse("OK", GET, result, null));
  } catch (error) {
    logger.error(`Error getting one record for ${req.tableName}:`, error);
    logger.error("Error message:", error.message);
    
    // Provide more specific error messages
    let errorMessage = SERVER_ERROR_MESSAGE;
    if (error.message && error.message.includes('not found')) {
      errorMessage = `Model/Table "${req.tableName}" not found. ${error.message}`;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res
      .status(httpres.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", errorMessage, null, error.message || error.toString()));
  }
};

exports.searchData = async (req, res) => {
  try {
    logger.info(`Searching ${req.tableName} with data:`, JSON.stringify(req.body, null, 2));
    
    // Check if tableName is provided
    if (!req.tableName) {
      return res
        .status(httpres.BAD_REQUEST)
        .json(prepareResponse("BAD_REQUEST", "Table name is required", null, null));
    }
    
    let cond = req.body.data || {};
    let page = req.body.page || 0;
    let pageSize = req.body.pageSize || 50;
    let order = req.body.order || [];
    
    let result = await queryService.getAllDataByCondAndPagination(
      req.tableName,
      cond,
      page,
      pageSize,
      order
    );
    res.status(httpres.OK).json(prepareResponse("OK", GET, result, null));
  } catch (error) {
    logger.error(`Error searching ${req.tableName}:`, error);
    logger.error("Error message:", error.message);
    
    // Provide more specific error messages
    let errorMessage = SERVER_ERROR_MESSAGE;
    if (error.message && error.message.includes('not found')) {
      errorMessage = `Model/Table "${req.tableName}" not found. ${error.message}`;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res
      .status(httpres.SERVER_ERROR)
      .json(prepareResponse("SERVER_ERROR", errorMessage, null, error.message || error.toString()));
  }
};
