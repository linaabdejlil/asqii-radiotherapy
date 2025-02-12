const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

const Patient = sequelize.define("Patient", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  dateNaissance: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  sexe: {
    type: DataTypes.ENUM("homme", "femme"),
    allowNull: false,
  },
  mail: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  numTel: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isNumeric: true,
    },
  },
  autres: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  DMI: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Cin: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  securiteSociale: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nationalite: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Patient;
