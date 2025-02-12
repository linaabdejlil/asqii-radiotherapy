//models/note.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Note = sequelize.define("note", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  titre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contenu: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  rappel: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Note;
