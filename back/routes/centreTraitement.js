// routes/centreTraitement.js

const express = require("express");
const router = express.Router();
const centreTraitementController = require("../controllers/centreTraitement");

// Routes
router.post("/add", centreTraitementController.createCentreTraitement);
router.get("/getAll", centreTraitementController.getAllCentresTraitement);
router.get("/getOne/:id", centreTraitementController.getCentreTraitementById);
router.put("/update/:id", centreTraitementController.updateCentreTraitement);
router.delete("/delete/:id", centreTraitementController.deleteCentreTraitement);
router.get("/search", centreTraitementController.searchCentreTraitementByName);

module.exports = router;
