const express = require("express");
const router = express.Router();
const notificationControllers = require("../controllers/notification");
const requireToken = require("../middleware/requireToken");

// Récupérer les notifications d'un utilisateur
router.get("/", requireToken, notificationControllers.getUserNotifications);

module.exports = router;
