const express = require("express");
const router = express.Router();
const dosimetrieControllers = require("../controllers/dosimetrie");
const authMiddleware = require("./authMiddleware");

// Ajouter une dosimétrie à un traitement spécifique
router.post(
  "/add/:traitementId",
  authMiddleware,
  dosimetrieControllers.addDosimetrie
);

// Obtenir une dosimétrie par ID
router.get("/:dosimetrieId", dosimetrieControllers.getDosimetrieById);

// Supprimer une dosimétrie par ID
router.delete("/:dosimetrieId", dosimetrieControllers.deleteDosimetrieById);

module.exports = router;
