const express = require("express");
const router = express.Router();
const contourageControllers = require("../controllers/contourage");
const authMiddleware = require("./authMiddleware");

// Ajouter un contourage à un traitement spécifique
router.post(
  "/add/:traitementId",
  authMiddleware,
  contourageControllers.addContourage
);

// Obtenir un contourage par ID
router.get("/:contourageId", contourageControllers.getContourageById);

// Supprimer un contourage par ID
router.delete("/:contourageId", contourageControllers.deleteContourageById);

module.exports = router;
