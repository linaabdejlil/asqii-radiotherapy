const express = require("express");
const router = express.Router();
const importationControllers = require("../controllers/importation");
const authMiddleware = require("./authMiddleware");

// Ajouter une importation à un traitement spécifique
router.post(
  "/add/:traitementId",
  authMiddleware,
  importationControllers.addImportation
);

// Obtenir une importation par ID
router.get("/:importationId", importationControllers.getImportationById);

module.exports = router;
