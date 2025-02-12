//controllers/traitement.js
const {
  Traitement,
  Contourage,
  Patient,
  CentreTraitement,
  Importation,
  Validation,
  Qualite,
  Dosimetrie,
  Prescription,
  Scanner,
  Machine,
  Seance,
  User,
} = require("../models");

// Ajouter un nouveau traitement et l'associer à un patient
exports.addTraitement = async (req, res) => {
  const { patientId } = req.params;

  try {
    const { localisation, indication, chimio } = req.body;

    const newTraitement = await Traitement.create({
      localisation: localisation,
      indication: indication,
      chimio: chimio,
      patientId: patientId,
    });

    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    await patient.addTraitement(newTraitement);

    res.status(201).json(newTraitement);
  } catch (error) {
    console.error("Error adding new traitement:", error);
    res.status(500).json({ error: "Server error while adding new traitement" });
  }
};

// Récupérer tous les traitements
exports.getAllTraitements = async (req, res) => {
  try {
    const traitements = await Traitement.findAll({
      include: [
        {
          model: Patient,
         
        },
        {
          model: Contourage,
          
          include: [
            {
              model: User,
             
            },
          ],
        },
        {
          model: Dosimetrie,
         
          include: [
            {
              model: User,
             
            },
          ],
        },
        {
          model: Importation,
         
          include: [
            {
              model: User,
              
            },
          ],
        },
        {
          model: Validation,
          
          include: [
            {
              model: User,
          
            },
          ],
        },
        {
          model: Qualite,
         
          include: [
            {
              model: User,
             
            },
          ],
        },
        {
          model: Scanner,
         
          include: [
            {
              model: Machine,
             
            },
            {
              model: User,
              
            },
          ],
        },
        {
          model: Prescription,
          
          include: [
            {
              model: User,
              
            },
          ],
        },
        {
          model: Seance,
          
        },

        {
          model: CentreTraitement,
          
        },
      ],
    });

    // Renvoyer les traitements en tant que réponse JSON
    res.json(traitements);
  } catch (error) {
    console.error("Erreur lors de la récupération des traitements :", error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des traitements",
    });
  }
};

// Récupérer les traitements associés à un patient spécifique
exports.getTraitementsByPatientId = async (req, res) => {
  const { patientId } = req.params; // Récupérer l'ID du patient à partir des paramètres de la route

  try {
    // Trouver le patient correspondant à l'ID fourni
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Récupérer tous les traitements associés à ce patient
    const traitements = await Traitement.findAll({
      where: { patientId: patientId },
    });

    // Renvoyer les traitements en tant que réponse JSON
    res.json(traitements);
  } catch (error) {
    console.error("Error fetching traitements for patient:", error);
    res
      .status(500)
      .json({ error: "Server error while fetching traitements for patient" });
  }
};

// Récupérer un traitement par son ID
exports.getTraitementById = async (req, res) => {
  const { traitementId } = req.params;

  try {
    const traitementWithDetails = await Traitement.findByPk(traitementId, {
      include: [
        {
          model: Patient,
         
        },
        {
          model: Contourage,
         
          include: [
            {
              model: User,
             
            },
          ],
        },
        {
          model: Dosimetrie,
         
          include: [
            {
              model: User,
              
            },
          ],
        },
        {
          model: Importation,
          
          include: [
            {
              model: User,
            
            },
          ],
        },
        {
          model: Validation,
          
          include: [
            {
              model: User,
              
            },
          ],
        },
        {
          model: Qualite,
         
          include: [
            {
              model: User,
              
            },
          ],
        },
        {
          model: Scanner,
         
          include: [
            {
              model: Machine,
              
            },
            {
              model: User,
              
            },
          ],
        },
        {
          model: Prescription,
         
          include: [
            {
              model: User,
             
            },
          ],
        },
        {
          model: Seance,
        
        },

        {
          model: CentreTraitement,
         
        },
      ],
    });

    if (!traitementWithDetails) {
      return res.status(404).json({ error: "Traitement not found" });
    }

    // Renvoyer le traitement avec les détails en tant que réponse JSON
    res.json(traitementWithDetails);
  } catch (error) {
    console.error(`Error getting traitement by ID ${traitementId}:`, error);
    res
      .status(500)
      .json({ error: "Server error while getting traitement by ID" });
  }
};

// Récupérer tous les traitements à partir d'une certaine date
exports.getTraitementsByStartDate = async (req, res) => {
  try {
    // Extract start date from route parameters
    const startDate = req.params.startDate;

    // Build the where clause for the query
    const whereClause = startDate
      ? { dateDebut: { [Op.gte]: new Date(startDate) } }
      : {};

    // Récupérer tous les traitements avec les détails de contourage et patient depuis la base de données
    const traitements = await Traitement.findAll({
      where: whereClause,
      include: [
        {
          model: Patient,
       
        },
        {
          model: Contourage,
         
          include: [
            {
              model: User,
              
            },
          ],
        },
        {
          model: Dosimetrie,
         
          include: [
            {
              model: User,
              
            },
          ],
        },
        {
          model: Importation,
          
          include: [
            {
              model: User,
             
            },
          ],
        },
        {
          model: Validation,
         
          include: [
            {
              model: User,
              
            },
          ],
        },
        {
          model: Qualite,
         
          include: [
            {
              model: User,
             
            },
          ],
        },
        {
          model: Scanner,
          
          include: [
            {
              model: Machine,
             
            },
            {
              model: User,
             
            },
          ],
        },
        {
          model: Prescription,
         
          include: [
            {
              model: User,
             
            },
          ],
        },
        {
          model: Seance,
        
        },

        {
          model: CentreTraitement,
       
        },
      ],
    });

    // Renvoyer les traitements en tant que réponse JSON
    res.json(traitements);
  } catch (error) {
    console.error("Erreur lors de la récupération des traitements :", error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des traitements",
    });
  }
};

// Utility to add days skipping weekends
const addBusinessDays = (date, daysToAdd) => {
  let dateCopy = new Date(date);

  while (daysToAdd > 0) {
    dateCopy.setDate(dateCopy.getDate() + 1);
    // Increment the date only if it's a weekday
    if (dateCopy.getDay() !== 0 && dateCopy.getDay() !== 6) {
      daysToAdd--;
    }
  }
  return dateCopy;
};

// Update traitement and adjust all associated seances
exports.updateTraitement = async (req, res) => {
  const { traitementId } = req.params;
  const { dateDebut } = req.body;

  try {
    const traitementToUpdate = await Traitement.findByPk(traitementId);

    if (!traitementToUpdate) {
      return res.status(404).json({ error: "Traitement not found" });
    }

    traitementToUpdate.dateDebut = dateDebut;
    await traitementToUpdate.save();

    // Fetch all sessions associated with this treatment
    const seances = await Seance.findAll({
      where: { traitementId: traitementId },
      order: [["numero_seance", "ASC"]],
    });

    // Update each session date skipping weekends
    for (let i = 0; i < seances.length; i++) {
      const newDate = addBusinessDays(dateDebut, i);
      await seances[i].update({ date: newDate });
    }

    res.json({
      traitement: traitementToUpdate,
      message: "Treatment and sessions updated successfully.",
    });
  } catch (error) {
    console.error("Error updating traitement and seances:", error);
    res
      .status(500)
      .json({ error: "Server error while updating traitement and seances" });
  }
};
// Supprimer un traitement par son ID
exports.deleteTraitementById = async (req, res) => {
  const { traitementId } = req.params; // Récupérer l'ID du traitement à supprimer

  try {
    // Rechercher le traitement à supprimer
    const traitementToDelete = await Traitement.findByPk(traitementId);

    // Vérifier si le traitement existe
    if (!traitementToDelete) {
      return res.status(404).json({ error: "Traitement non trouvé" });
    }

    // Supprimer le traitement de la base de données
    await traitementToDelete.destroy();

    // Répondre avec un message de succès
    res.json({ message: "Traitement supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du traitement :", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la suppression du traitement" });
  }
};

module.exports = exports;
