const { Seance, Traitement, Patient } = require("../models");

const sequelize = require("../config/database");

// Mettre à jour une séance et ajouter une nouvelle séance associée au même traitement
exports.updateAndAddSeance = async (req, res) => {
  const { traitementId, seanceId } = req.params;
  const { updatedSeanceData, newSeanceData } = req.body;

  try {
    // Update the existing session
    const [updatedSeanceCount] = await Seance.update(updatedSeanceData, {
      where: { id: seanceId, traitementId: traitementId },
    });

    // Check if the session was found and updated
    if (updatedSeanceCount === 0) {
      return res
        .status(404)
        .json({ error: "Session not found for the given treatment" });
    }

    // Add a new session associated with the same treatment (using the existing treatment ID)
    const newSeance = await Seance.create({
      traitementId: traitementId,
      ...newSeanceData,
    });

    // Renvoyer la réponse JSON avec la session mise à jour et la nouvelle séance
    res.json({ updatedSeance: { rowCount: updatedSeanceCount }, newSeance });
  } catch (error) {
    console.error(
      `Error updating session with ID ${seanceId} for traitement ${traitementId}:`,
      error
    );
    res.status(500).json({ error: "Server error while updating session" });
  }
};

// Obtenir une séance par son ID et l'ID du traitement
exports.getSeanceByIdAndTraitementId = async (req, res) => {
  const { traitementId, seanceId } = req.params;

  try {
    // Retrieve the session based on ID and treatment ID
    const session = await Seance.findOne({
      where: { id: seanceId, traitementId: traitementId },
    });

    // Check if the session was found
    if (!session) {
      return res
        .status(404)
        .json({ error: "Session not found for the given treatment" });
    }

    // Renvoyer la réponse JSON avec la session
    res.json(session);
  } catch (error) {
    console.error(
      `Error getting session with ID ${seanceId} for traitement ${traitementId}:`,
      error
    );
    res.status(500).json({ error: "Server error while getting session" });
  }
};

exports.getAllSeancesByTraitementId = async (req, res) => {
  const { traitementId } = req.params;

  try {
    // Retrieve all sessions for the given treatment
    const sessions = await Seance.findAll({
      
      where: { traitementId: traitementId }, // Correct placement of the where clause
    });

    // Return the JSON response with all the sessions
    res.json(sessions);
  } catch (error) {
    console.error(
      `Error getting sessions for traitement ${traitementId}:`,
      error
    );
    res.status(500).json({ error: "Server error while getting sessions" });
  }
};

exports.updateSeanceById = async (req, res) => {
  const { seanceId } = req.params;
  const { remarque } = req.body;

  try {
    const seance = await Seance.findByPk(seanceId);
    if (!seance) {
      return res.status(404).json({ error: "Seance not found" });
    }

    // Update the 'remarque' field if it's provided, otherwise leave it unchanged
    if (remarque !== undefined) {
      seance.remarque = remarque;
    }

    await seance.save();

    res.json({
      message: "Seance updated successfully",
      seance,
    });
  } catch (error) {
    console.error(`Error updating seance with ID ${seanceId}:`, error);
    res.status(500).json({ error: "Server error while updating seance" });
  }
};

// Changer la date d'une séance par son ID de traitement et numéro de séance
exports.changeSeanceDate = async (req, res) => {
  const { traitementId, numero_seance } = req.params;
  const { newDate } = req.body;

  try {
    const [updatedRowCount] = await Seance.update(
      { date: newDate },
      {
        where: { traitementId: traitementId, numero_seance: numero_seance },
      }
    );

    if (updatedRowCount === 0) {
      return res.status(404).json({ error: "Seance not found" });
    }

    // Renvoyer la réponse JSON avec le nombre de lignes mises à jour
    res.json({ updatedSeance: { rowCount: updatedRowCount } });
  } catch (error) {
    console.error(
      `Error updating seance date with ID traitement ${traitementId} and numero seance ${numero_seance} :`,
      error
    );
    res.status(500).json({ error: "Server error while updating seance date" });
  }
};
// Assuming this function is part of your seanceController

exports.rescheduleSeance = async (req, res) => {
  const { seanceId } = req.params;
  const { newDate, remarque } = req.body; // 'remarque' is now only for the rescheduled session

  try {
    const result = await sequelize.transaction(async (t) => {
      // First, update the existing session to mark it as postponed and update the remark
      const updatedSeance = await Seance.update(
        { reporte: true, remarque: remarque }, // Update 'remarque' here
        { where: { id: seanceId }, transaction: t }
      );

      if (updatedSeance[0] === 0) {
        throw new Error("Seance not found");
      }

      // Retrieve details to clone for a new session except the remark
      const existingSeance = await Seance.findByPk(seanceId, {
        transaction: t,
      });
      if (!existingSeance) {
        throw new Error("Seance not found");
      }

      // Create a new session with the new date and default/empty remark
      const newSeance = await Seance.create(
        {
          traitementId: existingSeance.traitementId,
          numero_seance: existingSeance.numero_seance,
          etat: existingSeance.etat,
          date: newDate,
          remarque: "", // Set default or empty remark for new session
          reporte: false,
        },
        { transaction: t }
      );

      return { updatedSeance: existingSeance, newSeance };
    });

    res.json({
      message: "Seance rescheduled successfully",
      data: result,
    });
  } catch (error) {
    console.error(
      `Error rescheduling seance with ID ${seanceId}:`,
      error.message
    );
    res.status(500).json({
      error: "Server error while rescheduling seance",
      details: error.message,
    });
  }
};

exports.getAllSeances = async (req, res) => {
  try {
    const seances = await Seance.findAll({
      include: [
        {
          model: Traitement,
          include: [
            {
              model: Patient,
              // Assurez-vous que les attributs sont corrects
            },
          ],
        },
      ],
    });

    const formattedSeances = seances.map((seance) => {
      // Vérifiez si le traitement et le patient sont bien définis avant de concaténer les noms
      const patientNom =
        seance.Traitement && seance.Traitement.Patient
          ? `${seance.Traitement.Patient.nom} ${seance.Traitement.Patient.prenom}`
          : "Pas de patient";

      return {
        patientNom: patientNom,
        dateSeance: seance.date,
      };
    });

    res.status(200).json(formattedSeances);
  } catch (error) {
    console.error("Failed to fetch seances", error);
    res
      .status(500)
      .send({ message: "Error fetching seances", error: error.message });
  }
};

module.exports = exports;
