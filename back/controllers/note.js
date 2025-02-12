//controllers/note.js
const { Note, Fichier , User } = require("../models");
const cloudinary = require("cloudinary").v2;

exports.createNote = async (req, res) => {
  const { titre, contenu, rappel, type } = req.body;
  const userId = req.user.id; // Assuming `req.user` is populated by your authentication middleware

  // Validate required input fields
  if (!titre || !contenu) {
    return res
      .status(400)
      .json({ message: "Title (titre) and content (contenu) are required." });
  }

  try {
    // Create a new note
    const note = await Note.create({
      titre,
      contenu,
      rappel,
      type,
      userId,
    });

    // Handle file uploads if there are any
    if (req.files && req.files.length > 0) {
      const filePromises = req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "radiotherapie",
          resource_type: "auto", // Automatically detects the type of the file
        });

        // Create a Fichier record for each file uploaded
        return Fichier.create({
          lien: result.secure_url,
          type: file.mimetype,
          noteId: note.id,
        });
      });

      // Wait for all file uploads and database entries to complete
      await Promise.all(filePromises);
    }

    // Send success response
    res.status(201).json({
      message: "Note created successfully",
      note: note,
    });
  } catch (error) {
    console.error("Error in creating note:", error);
    res
      .status(500)
      .json({ message: "Failed to create note", error: error.message });
  }
};

exports.getAllNotesForUser = async (req, res) => {
  const userId = req.user.id; // Supposons que `req.user` soit rempli par votre middleware d'authentification

  try {
    // Récupérer toutes les notes de l'utilisateur connecté
    const notes = await Note.findAll({
      where: { userId: userId },
      include: [
        {
          model: Fichier,
         
        },
      ],
    });

    // Vérifier si des notes ont été trouvées
    if (!notes || notes.length === 0) {
      return res.status(404).json({ message: "Aucune note trouvée pour cet utilisateur." });
    }

    // Envoyer les notes en réponse
    res.status(200).json({ notes });
  } catch (error) {
    console.error("Erreur lors de la récupération des notes:", error);
    res
      .status(500)
      .json({ message: "Échec de la récupération des notes", error: error.message });
  }
};
exports.getPublicNotesForUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Récupérer toutes les notes publiques pour un utilisateur donné
    const notes = await Note.findAll({
      where: { 
        userId: userId, 
        type: "publique" 
      },
      include: [
        {
          model: Fichier,
         
        },
      ],
    });

    // Vérifier si des notes publiques ont été trouvées
    if (!notes || notes.length === 0) {
      return res.status(404).json({ message: "Aucune note publique trouvée pour cet utilisateur." });
    }

    // Envoyer les notes publiques en réponse
    res.status(200).json({ notes });
  } catch (error) {
    console.error("Erreur lors de la récupération des notes publiques:", error);
    res.status(500).json({ message: "Échec de la récupération des notes publiques", error: error.message });
  }
};
exports.getAllPublicNotes = async (req, res) => {
  try {
    // Récupérer toutes les notes publiques avec les informations des utilisateurs
    const notes = await Note.findAll({
      where: { type: "publique" },
      include: [
        {
          model: Fichier,
          
        },
        {
          model: User,
         
        },
      ],
    });

    // Vérifier si des notes publiques ont été trouvées
    if (!notes || notes.length === 0) {
      return res.status(404).json({ message: "Aucune note publique trouvée." });
    }

    // Envoyer les notes publiques en réponse
    res.status(200).json({ notes });
  } catch (error) {
    console.error("Erreur lors de la récupération des notes publiques:", error);
    res.status(500).json({ message: "Échec de la récupération des notes publiques", error: error.message });
  }
};
exports.getNoteById = async (req, res) => {
  const noteId = req.params.id;

  try {
    // Fetch the note by its ID including associated files
    const note = await Note.findOne({
      where: { id: noteId },
      include: [
        {
          model: Fichier,
         
        },
      ],
    });

    // Check if the note was found
    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    // Send the note in the response
    res.status(200).json({ note });
  } catch (error) {
    console.error("Error fetching note by ID:", error);
    res.status(500).json({ message: "Failed to fetch note", error: error.message });
  }
};


exports.getUserAndPublicNotes = async (req, res) => {
  const userId = req.user.id; // Assurez-vous que `req.user` est bien défini

  try {
    // Récupérer les notes publiques et privées de l'utilisateur connecté
    const userNotes = await Note.findAll({
      where: {
        userId: userId, 
        [Op.or]: [{ type: "public" }, { type: "privé" }]
      },
      include: [
        {
          model: Fichier,
        }
      ],
    });

    // Récupérer toutes les notes publiques des autres utilisateurs
    const publicNotes = await Note.findAll({
      where: {
        userId: { [Op.ne]: userId }, // Tous les utilisateurs sauf l'utilisateur connecté
        type: "public",
      },
      include: [
        {
          model: Fichier,
          
        },
        {
          model: User, // Inclure les informations de l'utilisateur
          
        },
      ],
    });

    // Vérifier si des notes ont été trouvées
    if (userNotes.length === 0 && publicNotes.length === 0) {
      return res.status(404).json({ message: "Aucune note trouvée." });
    }

    // Envoyer les notes en réponse
    res.status(200).json({ userNotes, publicNotes });
  } catch (error) {
    console.error("Erreur lors de la récupération des notes:", error);
    res.status(500).json({ message: "Échec de la récupération des notes", error: error.message });
  }
};