const {
  Traitement,
  Importation,
  User,
  Patient,
  Prescription,
  Scanner,
} = require("../models");

// Ajouter une importation à un traitement spécifique
exports.addImportation = async (req, res) => {
  const { traitementId } = req.params;
  const { date, etat, remarque } = req.body;
  const userId = req.user.id;

  try {
    const traitement = await Traitement.findByPk(traitementId);
    if (!traitement) {
      return res.status(404).json({ error: "Traitement not found" });
    }

    const newImportation = await Importation.create({
      date,
      etat,
      remarque,
      traitementId,
      UserId: userId,
    });

    traitement.importationId = newImportation.id;
    await traitement.save();

    res.status(201).json(newImportation);
  } catch (error) {
    console.error("Error adding importation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Obtenir une importation par ID
exports.getImportationById = async (req, res) => {
  const { importationId } = req.params;

  try {
    const importation = await Importation.findByPk(importationId, {
      include: [
        { model: Traitement, include: [Patient, Prescription, Scanner] },
        { model: User },
      ],
    });

    if (!importation) {
      return res.status(404).json({ error: "Importation not found" });
    }

    res.status(200).json(importation);
  } catch (error) {
    console.error("Error fetching importation by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = exports;
