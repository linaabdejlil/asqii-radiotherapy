//routes/traitement.js
const express = require("express");
const router = express.Router();
const traitementControllers = require("../controllers/traitement");

// Ajouter un nouveau traitement et l'associer à un patient
router.post("/add/:patientId", traitementControllers.addTraitement);

// Récupérer tous les traitements
router.get("/all", traitementControllers.getAllTraitements);

// Récupérer les traitements associés à un patient spécifique
router.get(
  "/patient/:patientId",
  traitementControllers.getTraitementsByPatientId
);

// Récupérer un traitement par son ID
router.get("/one/:traitementId", traitementControllers.getTraitementById);

// Récupérer tous les traitements à partir d'une certaine date
router.get("/all/:startDate", traitementControllers.getTraitementsByStartDate);

// Mettre à jour un traitement
router.put("/update/:traitementId", traitementControllers.updateTraitement);
// Supprimer un traitement par son ID
router.delete(
  "/delete/:traitementId",
  traitementControllers.deleteTraitementById
);

module.exports = router;
