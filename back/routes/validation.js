const express = require("express");
const router = express.Router();
const authMiddleware = require("./authMiddleware"); // Importation du middleware d'authentification
const validationController = require("../controllers/validation");

// Route pour ajouter une validztion à un traitement spécifique
router.post(
  "/add/:traitementId",
  authMiddleware,
  validationController.addValidation
);

// Route pour obtenir une validation par son ID
router.get("/:validationId", validationController.getValidationById);

module.exports = router;
