// models/machine.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Machine = sequelize.define('Machine', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  nomMachine: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});



module.exports = Machine;
