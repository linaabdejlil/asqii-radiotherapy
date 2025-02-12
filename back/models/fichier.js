//models/fichier.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Fichier = sequelize.define("fichier", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  lien: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Fichier;
