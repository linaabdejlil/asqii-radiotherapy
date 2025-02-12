// models/scanner.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Scanner = sequelize.define("Scanner", {
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
    defaultValue: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  episseurCorps: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  positionBras: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contentionSBRT: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  marquage: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  docs: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  remarque: {
    type: DataTypes.STRING,
  },
  positionMalade: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  remplissageVescale: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  nom: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  detailcible: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  plan: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  masque: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  caleTete: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  billotSousGenous: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  calePied: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  coussinSousVide: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Scanner;
