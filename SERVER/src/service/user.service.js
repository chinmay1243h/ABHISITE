const User = require("../models/user.model");

const addData = async (obj) => {
  return await User.create(obj);
};

const addBulkData = async (obj) => {
  return await User.insertMany(obj);
};

const getOneUserByCond = async (cond) => {
  return await User.findOne(cond);
};

const updateUser = async (obj, cond) => {
  return await User.findOneAndUpdate(cond, obj, { new: true, runValidators: true });
};

const deleteUser = async (cond) => {
  return await User.findOneAndDelete(cond);
};

module.exports = {
  addData,
  addBulkData,
  getOneUserByCond,
  updateUser,
  deleteUser,
};