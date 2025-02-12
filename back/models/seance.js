// models/seance.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Traitement = require("./traitement");

const Seance = sequelize.define("Seance", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  numero_seance: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  etat: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  remarque: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reporte: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Seance;
