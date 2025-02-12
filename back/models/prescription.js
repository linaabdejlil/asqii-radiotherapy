// models/prescription.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prescription = sequelize.define('Prescription', {
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
    defaultValue: false, 
  },
  doseTotale: {
    type: DataTypes.STRING, 
    allowNull: true,

  },
  doseSeance: {
    type: DataTypes.STRING, 
    allowNull: true,

  },
  volume: {
    type: DataTypes.STRING, 
    allowNull: true,

  },
  technique: {
    type: DataTypes.STRING, 
    allowNull: true,

  },
  remarque: {
    type: DataTypes.STRING,    
     allowNull: true,

  },
});

module.exports = Prescription;
