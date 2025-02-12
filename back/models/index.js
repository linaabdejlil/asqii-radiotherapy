const sequelize = require("../config/database");
const User = require("./user");
const Scanner = require("./scanner");
const Seance = require("./seance");
const Machine = require("./machine");
const Patient = require("./patient");
const Traitement = require("./traitement");
const Contourage = require("./contourage");
const Dosimetrie = require("./dosimetrie");
const Importation = require("./importation");
const Qualite = require("./qualite");
const Validation = require("./validation");
const Adresse = require("./adresse");

const Prescription = require("./prescription");
const CentreTraitement = require("./centreTraitement");
const Message = require("./message");
const Group = require("./group");
const Discussion = require("./discussion");
const Notification = require("./notification");
const Note = require("./note");
const Fichier = require("./fichier");

//relation entre scanner et machine
Scanner.belongsTo(Machine, { foreignKey: "machineId" });
Machine.hasOne(Scanner, { foreignKey: "machineId" });
Machine.belongsTo(Scanner, { foreignKey: "scannerId" });
Scanner.hasOne(Machine, { foreignKey: "scannerId" });

//relation entre traitement et contourage
Contourage.belongsTo(Traitement, { foreignKey: "traitementId" });
Traitement.hasOne(Contourage, { foreignKey: "traitementId" });
Traitement.belongsTo(Contourage, { foreignKey: "contourageId" });
Contourage.hasOne(Traitement, { foreignKey: "contourageId" });
Contourage.belongsTo(Patient, { foreignKey: "patientId" });

// relation entre traitement et dosimetrie
Traitement.belongsTo(Dosimetrie, { foreignKey: "dosimetrieId" });
Dosimetrie.hasOne(Traitement, { foreignKey: "dosimetrieId" });
Dosimetrie.belongsTo(Traitement, { foreignKey: "traitementId" });
Traitement.hasOne(Dosimetrie, { foreignKey: "traitementId" });
Dosimetrie.belongsTo(Patient, { foreignKey: "patientId" });

// relation entre traitement et importation
Traitement.belongsTo(Importation, { foreignKey: "importationId" });
Importation.hasOne(Traitement, { foreignKey: "importationId" });
Importation.belongsTo(Traitement, { foreignKey: "traitementId" });
Traitement.hasOne(Importation, { foreignKey: "traitementId" });
Importation.belongsTo(Patient, { foreignKey: "patientId" });

// relation entre traitement et Qualite
Traitement.belongsTo(Qualite, { foreignKey: "importationMachineId" });
Qualite.hasOne(Traitement, { foreignKey: "importationMachineId" });
Qualite.belongsTo(Traitement, { foreignKey: "traitementId" });
Traitement.hasOne(Qualite, { foreignKey: "traitementId" });
Qualite.belongsTo(Patient, { foreignKey: "patientId" });

// relation entre traitement et scanner
Traitement.belongsTo(Scanner, { foreignKey: "scannerId" });
Scanner.hasOne(Traitement, { foreignKey: "scannerId" });
Scanner.belongsTo(Traitement, { foreignKey: "traitementId" });
Traitement.hasOne(Scanner, { foreignKey: "traitementId" });
Scanner.belongsTo(Patient, { foreignKey: "patientId" });
// relation entre traitement et validation
Traitement.belongsTo(Validation, { foreignKey: "validationId" });
Validation.hasOne(Traitement, { foreignKey: "validationId" });
Validation.belongsTo(Traitement, { foreignKey: "traitementId" });
Traitement.hasOne(Validation, { foreignKey: "traitementId" });
Validation.belongsTo(Patient, { foreignKey: "patientId" });

// relation entre traitement et Prescription
Traitement.belongsTo(Prescription, { foreignKey: "prescriptionId" });
Prescription.hasOne(Traitement, { foreignKey: "prescriptionId" });
Prescription.belongsTo(Traitement, { foreignKey: "traitementId" });
Traitement.hasOne(Prescription, { foreignKey: "traitementId" });

// Dans votre modèle Prescription
Prescription.belongsTo(Patient, { foreignKey: "patientId" });

// relation entre patient et traitements

Patient.belongsToMany(Traitement, { through: "TraitementPatient" });
Traitement.belongsTo(Patient, { foreignKey: "patientId" });

// relation entre centreTraitement et traitements

CentreTraitement.hasOne(Traitement, { foreignKey: "centreTraitementId" });
Traitement.belongsTo(CentreTraitement, { foreignKey: "centreTraitementId" });

// relation entre traitement et seances

Seance.belongsTo(Traitement, { foreignKey: "traitementId" });
Traitement.hasMany(Seance, { foreignKey: "traitementId" });
//relation entre user et adresse
User.belongsTo(Adresse, { foreignKey: "adresseId" });
Adresse.hasOne(User, { foreignKey: "adresseId" });
//relation entre user et patient
User.belongsToMany(Patient, { through: "UserPatient" });
Patient.belongsToMany(User, { through: "UserPatient" });
//relation entre user et prescription
User.hasOne(Prescription, { foreignKey: "UserId" });
Prescription.belongsTo(User, { foreignKey: "UserId" });
//relation entre user et validation
User.hasOne(Validation, { foreignKey: "UserId" });
Validation.belongsTo(User, { foreignKey: "UserId" });
//relation entre user et contourage
User.hasOne(Contourage, { foreignKey: "UserId" });
Contourage.belongsTo(User, { foreignKey: "UserId" });
//relation entre user et dosimetrie
User.hasOne(Dosimetrie, { foreignKey: "UserId" });
Dosimetrie.belongsTo(User, { foreignKey: "UserId" });
//relation entre user et importation
User.hasOne(Importation, { foreignKey: "UserId" });
Importation.belongsTo(User, { foreignKey: "UserId" });
//relation entre user et importation machine
User.hasOne(Qualite, { foreignKey: "UserId" });
Qualite.belongsTo(User, { foreignKey: "UserId" });
//relation entre user et scanner
User.hasOne(Scanner, { foreignKey: "UserId" });
Scanner.belongsTo(User, { foreignKey: "UserId" });

// Message and User
Message.belongsTo(User, {
  onDelete: "cascade",
  foreignKey: "senderId",
  as: "sender",
});
User.hasMany(Message, { onDelete: "cascade", foreignKey: "senderId" });
// Message and Discussion
Message.belongsTo(Discussion, {
  onDelete: "cascade",
  foreignKey: "discussionId",
});
Discussion.hasMany(Message, {
  onDelete: "cascade",
  foreignKey: "discussionId",
  as: "messages",
});

// A discussion has one last message
Discussion.hasOne(Message, {
  onDelete: "cascade",
  as: "lastMessage",
  foreignKey: "idLastMessage",
});
Message.belongsTo(Discussion, {
  onDelete: "cascade",
  foreignKey: "idLastMessage",
  as: "lastMessage",
});

// User and Discussion
User.belongsToMany(Discussion, { through: "UsersDiscussions" });
Discussion.belongsToMany(User, { through: "UsersDiscussions" });

// relation entre user et notofication
Notification.belongsTo(User, { foreignKey: "senderId", as: "sender" });
User.hasMany(Notification, { foreignKey: "senderId" });
Notification.belongsTo(User, { foreignKey: "recipientId", as: "recipient" });
User.hasMany(Notification, { foreignKey: "recipientId" });
// relation entre user et note
Note.belongsTo(User, { foreignKey: "userId" });
User.hasOne(Note, { foreignKey: "userId" });
//relation entre note et fichier
Fichier.belongsTo(Note, { foreignKey: "noteId" });
Note.hasMany(Fichier, { foreignKey: "noteId" });

// Export the models
module.exports = {
  User,
  Traitement,
  Scanner,
  Seance,
  Machine,
  Patient,
  Contourage,
  Dosimetrie,
  Importation,
  Qualite,
  Validation,
  Prescription,
  CentreTraitement,
  Message,
  Discussion,
  Group,
  Adresse,
  Notification,
  Note,
  Fichier,
};
