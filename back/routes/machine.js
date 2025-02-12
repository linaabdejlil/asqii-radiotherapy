const express = require("express");
const router = express.Router();
const machineControllers = require("../controllers/machine");
const authMiddleware = require("./authMiddleware");

// Obtenir une machine par son ID
router.get("/:machineId", authMiddleware, machineControllers.getMachineById);

module.exports = router;
