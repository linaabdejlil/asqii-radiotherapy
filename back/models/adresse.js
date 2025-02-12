const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

const adresse = sequelize.define("Adresses", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  latitude: {
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

  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = adresse;
