// models/contourage.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Importation = sequelize.define('Importation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  etat: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, 
  },
  remarque: {
    type: DataTypes.STRING, 
  },
});

module.exports = Importation;
