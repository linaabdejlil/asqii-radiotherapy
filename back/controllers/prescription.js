const {
  Prescription,
  Traitement,
  Patient,
  User,
  Seance,
  CentreTraitement,
} = require("../models");

exports.addPrescriptionAndUpdateTraitement = async (req, res) => {
  const {
    date,
    etat,
    doseTotale,
    doseSeance,
    volume,
    technique,
    remarque,
    nombreSeances,
  } = req.body;
  const traitementId = req.params.traitementId;
  const patientId = req.params.patientId;
  const centreTraitementId = req.params.centreTraitementId;
  const userId = req.user.id;

  try {
    const traitement = await Traitement.findByPk(traitementId);
    if (!traitement) {
      return res.status(404).json({ error: "Traitement not found" });
    }

    const centreTraitement = await CentreTraitement.findByPk(
      centreTraitementId
    );
    if (!centreTraitement) {
      return res.status(404).json({ error: "Centre de traitement not found" });
    }

    traitement.centreTraitementId = centreTraitement.id;
    traitement.nombreSeances = nombreSeances;

    await traitement.save();

    const newPrescription = await Prescription.create({
      date,
      etat,
      doseTotale,
      doseSeance,
      volume,
      technique,
      remarque,
      traitementId,
      UserId: userId,
      patientId,
    });

    const sessions = [];
    for (let i = 1; i <= nombreSeances; i++) {
      const session = await Seance.create({
        numero_seance: i,
        etat,
        date,
        traitementId,
      });
      sessions.push(session);
    }

    return res.json({
      newPrescription,
      updatedTraitement: traitement,
      sessions,
    });
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getPrescriptionByIdAndTreatmentId = async (req, res) => {
  const { prescriptionId, traitementId } = req.params;

  try {
    const traitement = await Traitement.findByPk(traitementId);
    if (!traitement) {
      return res.status(404).json({ error: "Traitement not found" });
    }

    const prescription = await Prescription.findOne({
      where: {
        id: prescriptionId,
        traitementId: traitementId,
      },
      include: [
        {
          model: Traitement,
          
        },
        {
          model: User,
         
        },
        {
          model: Patient,
         
        },
      ],
    });

    if (!prescription) {
      return res
        .status(404)
        .json({ error: "Prescription not found for this treatment" });
    }

    return res.json(prescription);
  } catch (error) {
    console.error("Error fetching prescription details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
