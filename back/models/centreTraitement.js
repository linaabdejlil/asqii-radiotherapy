const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

const centreTraitement = sequelize.define("CentreTraitement", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ville: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  codePostal: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  mail: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  localisation: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  numTel: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = centreTraitement;
