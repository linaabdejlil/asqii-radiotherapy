const express = require("express");
const router = express.Router();

const requireToken = require("../middleware/requireToken");
const discussionControllers = require("../controllers/discussions");
const allDiscussionsForOne = require("../middleware/allDiscussionsForOne");
const verifyUserId = require("../middleware/verifyUserId");

router.param("id", verifyUserId);

router.get(
  "/getAllDiscussion",
  requireToken,
  allDiscussionsForOne,
  discussionControllers.getAll
);

router.post(
  "/createDiscussion",
  requireToken,
  discussionControllers.createDiscussion
);
router.get(
  "/existingDiscussion/:id",
  requireToken,
  allDiscussionsForOne,
  discussionControllers.existingDiscussion
);
module.exports = router;
