const express = require("express");
const router = express.Router();
const authMiddleware = require("./authMiddleware"); // Import authMiddleware
const scannerController = require("../controllers/scanner");

// Route pour ajouter un scanner et une machine à un traitement spécifique
router.post(
  "/add/:traitementId/:patientId",
  authMiddleware,
  scannerController.addScannerAndMachine
);

// Route pour obtenir un scanner par son ID
router.get("/:scannerId", scannerController.getScannerById);

module.exports = router;
