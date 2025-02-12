const { Traitement, Contourage, User, Patient } = require("../models");

// Ajouter un contourage à un traitement spécifique
exports.addContourage = async (req, res) => {
  const { traitementId } = req.params;
  const { date, etat, remarque } = req.body;
  const userId = req.user.id;

  try {
    const traitement = await Traitement.findByPk(traitementId);
    if (!traitement) {
      return res.status(404).json({ error: "Traitement not found" });
    }

    const newContourage = await Contourage.create({
      date,
      etat,
      remarque,
      traitementId,
      UserId: userId,
    });

    traitement.contourageId = newContourage.id;
    await traitement.save();

    res.status(201).json(newContourage);
  } catch (error) {
    console.error("Error adding contourage:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Obtenir un contourage par ID
exports.getContourageById = async (req, res) => {
  try {
    const contourageId = req.params.contourageId;
    const contourage = await Contourage.findByPk(contourageId, {
      include: [{ model: Traitement, include: [Patient] }, { model: User }],
    });

    if (!contourage) {
      return res.status(404).json({ error: "Contourage not found" });
    }

    return res.json(contourage);
  } catch (error) {
    console.error("Error fetching contourage by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Supprimer un contourage par ID
exports.deleteContourageById = async (req, res) => {
  const { contourageId } = req.params;

  try {
    const contourage = await Contourage.findByPk(contourageId);
    if (!contourage) {
      return res.status(404).json({ error: "Contourage not found" });
    }

    await contourage.destroy();
    res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error("Error deleting contourage by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = exports;
