const { Traitement, Qualite, User, Patient } = require("../models"); // Importation du modèle User

// Ajouter une qualité à un traitement spécifique
exports.addQualite = async (req, res) => {
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
    const newQualite = await Qualite.create({
      date,
      etat,
      remarque,
      traitementId,
      UserId: userId,
    });

    traitement.qualiteId = newQualite.id;
    await traitement.save();

    res.status(201).json(newQualite);
  } catch (error) {
    console.error("Error adding qualite:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Obtenir une qualité par son ID
exports.getQualiteById = async (req, res) => {
  const { qualiteId } = req.params;

  try {
    // Trouver la qualité par son ID
    const qualite = await Qualite.findByPk(qualiteId, {
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

    if (!qualite) {
      return res.status(404).json({ error: "Qualite not found" });
    }

    res.status(200).json(qualite);
  } catch (error) {
    console.error("Error fetching qualite by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = exports;
