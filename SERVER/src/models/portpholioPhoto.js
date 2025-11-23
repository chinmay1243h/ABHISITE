const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const portfolioPhoto = sequelize.define(
  "portfolioPhoto",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "portfoliPhoto",
    timestamps: true,
  }
);

module.exports = portfolioPhoto;
