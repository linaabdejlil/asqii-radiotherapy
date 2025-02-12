const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');


const Traitement = sequelize.define('Traitement', 
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombreSeances: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dateDebut: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    etat: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, 
    },
    localisation:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    indication:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    etalement:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    chimio: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, 
    },
  },
  
);



module.exports = Traitement;
