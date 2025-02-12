const express = require("express");
const router = express.Router();
const requireToken = require("../middleware/requireToken");
const verifyDiscussionID = require("../middleware/verifyDiscussionID");
const verifyMessageID = require("../middleware/verifyMessageID");

const messageControllers = require("../controllers/messages");

router.param("idDiscussion", verifyDiscussionID);
router.param("idMessage", verifyMessageID);

router.post(
  "/sendMessage/:idDiscussion",
  requireToken,
  messageControllers.sendMessage
);
router.get(
  "/getAllMessage/:idDiscussion",
  requireToken,
  messageControllers.getAllMessage
);
router.get("/:idMessage", requireToken, messageControllers.getMessageById);

module.exports = router;
