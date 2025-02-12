const { Traitement, Dosimetrie, User, Patient } = require("../models");

// Ajouter une dosimétrie à un traitement spécifique
exports.addDosimetrie = async (req, res) => {
  const { traitementId } = req.params;
  const { date, etat, remarque } = req.body;
  const userId = req.user.id;

  try {
    const traitement = await Traitement.findByPk(traitementId);
    if (!traitement) {
      return res.status(404).json({ error: "Traitement not found" });
    }

    const newDosimetrie = await Dosimetrie.create({
      date,
      etat,
      remarque,
      traitementId,
      UserId: userId,
    });

    traitement.dosimetrieId = newDosimetrie.id;
    await traitement.save();

    res.status(201).json(newDosimetrie);
  } catch (error) {
    console.error("Error adding dosimetry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Obtenir une dosimétrie par ID
exports.getDosimetrieById = async (req, res) => {
  const { dosimetrieId } = req.params;

  try {
    const dosimetrie = await Dosimetrie.findByPk(dosimetrieId, {
      include: [{ model: Traitement, include: [Patient] }, { model: User }],
    });

    if (!dosimetrie) {
      return res.status(404).json({ error: "Dosimetry not found" });
    }

    res.status(200).json(dosimetrie);
  } catch (error) {
    console.error("Error fetching dosimetry by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Supprimer une dosimétrie par ID
exports.deleteDosimetrieById = async (req, res) => {
  const { dosimetrieId } = req.params;

  try {
    const dosimetrie = await Dosimetrie.findByPk(dosimetrieId);

    if (!dosimetrie) {
      return res.status(404).json({ error: "Dosimetry not found" });
    }

    await dosimetrie.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting dosimetry by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = exports;
