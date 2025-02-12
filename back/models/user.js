const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  tel: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ddn: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  genre: {
    type: DataTypes.ENUM("homme", "femme"),
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  compteValide: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  resetCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetCodeExpires: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
module.exports = User;
