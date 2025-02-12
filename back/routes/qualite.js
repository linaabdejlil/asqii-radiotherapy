const express = require("express");
const router = express.Router();
const authMiddleware = require("./authMiddleware"); // Importation du middleware d'authentification
const qualiteController = require("../controllers/qualite");

// Route pour ajouter une qualité à un traitement spécifique
router.post("/add/:traitementId", authMiddleware, qualiteController.addQualite);

// Route pour obtenir une qualité par son ID
router.get("/:qualiteId", qualiteController.getQualiteById);

module.exports = router;
