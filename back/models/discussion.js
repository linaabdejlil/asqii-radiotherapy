const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Discussion = sequelize.define("discussions", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  idLastMessage: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  nbUnReadMessage: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Discussion;
