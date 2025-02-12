const { Traitement, Validation, User, Patient } = require("../models"); // Importation du modèle User

// Ajouter une validation à un traitement spécifique
exports.addValidation = async (req, res) => {
  const { traitementId } = req.params;
  const { date, etat, remarque } = req.body;
  const userId = req.user.id; // Récupérer l'ID de l'utilisateur authentifié

  try {
    // Vérifier si le traitement existe
    const traitement = await Traitement.findByPk(traitementId);
    if (!traitement) {
      return res.status(404).json({ error: "Traitement not found" });
    }

    // Ajouter la nouvelle qualité associée à l'utilisateur connecté
    const newValidation = await Validation.create({
      date,
      etat,
      remarque,
      traitementId,
      UserId: userId,
    });

    traitement.validationId = newValidation.id;
    await traitement.save();

    res.status(201).json(newValidation);
  } catch (error) {
    console.error("Error adding validation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Obtenir une validation par son ID
exports.getValidationById = async (req, res) => {
  const { validationId } = req.params;

  try {
    // Trouver la validation par son ID
    const validation = await Validation.findByPk(validationId, {
      include: [
        {
          model: Traitement,
          include: [Patient], // Inclure le modèle Patient à l'intérieur du Traitement
        },
        {
          model: User, // Inclure le modèle User pour obtenir les informations sur l'utilisateur
        },
      ],
    });

    if (!validation) {
      return res.status(404).json({ error: "Validatiion not found" });
    }

    res.status(200).json(validation);
  } catch (error) {
    console.error("Error fetching validaton by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = exports;
