const express = require("express");
const router = express.Router();
const seanceController = require("../controllers/seance");
// Mettre à jour une séance par son ID
router.put("/update/:seanceId", seanceController.updateSeanceById);
router.put("/reschedule/:seanceId", seanceController.rescheduleSeance);
router.get("/getAll", seanceController.getAllSeances);

// Mettre à jour une séance et ajouter une nouvelle séance associée au même traitement
router.put("/:traitementId/:seanceId", seanceController.updateAndAddSeance);

// Obtenir une séance par son ID et l'ID du traitement
router.get(
  "/:traitementId/:seanceId",
  seanceController.getSeanceByIdAndTraitementId
);

// Obtenir toutes les séances pour un traitement donné
router.get("/:traitementId", seanceController.getAllSeancesByTraitementId);

// Changer la date d'une séance
router.put("/change-date/:traitementId", seanceController.changeSeanceDate);
// Add this route to handle rescheduling

module.exports = router;
