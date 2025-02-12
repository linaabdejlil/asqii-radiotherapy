//routes/note.js
const express = require("express");
const router = express.Router();
const noteControllers = require("../controllers/note");
const authMiddleware = require("./authMiddleware");
const upload = require("../config/multer"); // Ensure this is correctly configured

// Create a new note or update an existing one
router.post(
  "/create",
  authMiddleware,
  upload.array("files"),
  noteControllers.createNote
);
// Fetch all notes (public and private) for the authenticated user and all public notes from other users
router.get("/publicAndPrivate", authMiddleware, noteControllers.getUserAndPublicNotes);
// Fetch all notes for the authenticated user
router.get("/all", authMiddleware, noteControllers.getAllNotesForUser);
// Fetch all public notes for a given user by userId
router.get("/public/:userId", noteControllers.getPublicNotesForUser);
router.get("/public", noteControllers.getAllPublicNotes);
// Fetch a single note by ID
router.get("/note/:id", authMiddleware, noteControllers.getNoteById);



module.exports = router;
