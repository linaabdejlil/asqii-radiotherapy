//routre/user.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // for generating tokens
const { v4: uuidv4 } = require("uuid"); // for generating unique verificationToken
const { User, Notification } = require("../models"); // Ensure the correct path
const authMiddleware = require("./authMiddleware");
const { Op } = require("sequelize");
const upload = require("../config/multer"); // Importer la configuration Multer
const requireToken = require("../middleware/requireToken");
const userControllers = require("../controllers/users");
const verifyUserId = require("../middleware/verifyUserId");
const nodemailer = require("nodemailer");
const router = express.Router();

//// nouveau
router.param("OtherUserId", verifyUserId);

router.get("/getUser", requireToken, userControllers?.getUser);

router.get("/getAllUser", requireToken, userControllers?.getAllUser);
router.get(
  "/getSurgeonsRadiologists",
  requireToken,
  userControllers?.getSurgeonsRadiologists
);

router.get(
  "/getOtherUser/:OtherUserId",
  requireToken,
  userControllers?.getOtherUser
);

//// ancien

const { initializeSocket, sendNotification } = require("../socketIO"); // Importez le module socketIO

router.post("/signup", upload.single("image"), async (req, res) => {
  try {
    const { role, nom, prenom, email, password, tel, ddn, genre, adresse } =
      req.body;
    const imageUrl = req.file.path;

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    const newUser = await User.create({
      role,
      nom,
      prenom,
      email,
      ddn,
      genre,
      image: imageUrl,
      password: hashedPassword,
      tel,
      adresse,
      verificationToken,
    });

    // Créer une notification pour le propriétaire du template
    const notification = await Notification.create({
      senderId: newUser.id,
      recipientId: 3, // Assurez-vous que cet ID existe dans la table des utilisateurs
      content: `New user ${nom} ${prenom} has registered.`,
    });

    // Envoyer une notification via Socket.io à tous les utilisateurs connectés
    sendNotification(notification);

    res.status(201).json({ message: "Utilisateur enregistré avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    // Check if the user exists and the password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, "your-secret-key", {
      expiresIn: "5h", // Token expires in 5 hour
    });

    // Send the token and user details in the response
    res.json({ token, nom: user.nom, prenom: user.prenom, id: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/protected", authMiddleware, (req, res) => {
  // Access the authenticated user using req.user
  res.json({ message: "This is a protected route", user: req.user });
});
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // Accédez aux détails de l'utilisateur à partir de req.user
    const user = req.user;

    const { id, nom, prenom, email, image, role, tel, ddn, genre, adresse } =
      user;

    // Envoyez les détails de l'utilisateur en réponse
    res.json({ id, nom, prenom, email, image, role, tel, ddn, genre, adresse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/getAllGestionUser", authMiddleware, async (req, res) => {
  try {
    // Récupérer tous les utilisateurs sauf ceux avec le rôle "Admin"
    const users = await User.findAll({
      where: {
        role: {
          [Op.ne]: "Admin",
        },
      },
    });

    // Répondre avec la liste des utilisateurs
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/validerCompte/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { compteValide } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.compteValide = compteValide;
    await user.save();

    if (compteValide) {
      // Envoyer un e-mail pour informer l'utilisateur que son compte est validé
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "talbihajer01@gmail.com",
          pass: "dmgqxthjmdbgelap",
        },
      });

      const mailOptions = {
        from: "talbihajer01@gmail.com",
        to: user.email,
        subject: "Validation de votre compte",
        html: `<p>Bonjour ${user.nom} ${user.prenom},</p>
               <p>Votre compte a été validé avec succès. Vous pouvez désormais vous connecter à votre compte.</p>
               <p>Cordialement,<br>L'équipe de votre application</p>`,
      };

      await transporter.sendMail(mailOptions);
    }

    res.json({ message: "Compte valide updated successfully" });
  } catch (error) {
    console.error("Error updating compte valide:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/deleteUser/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params; // Extracting userId from request parameters

  try {
    // Finding the user by ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" }); // If user not found, return 404
    }

    // Deleting the user from the database
    await user.destroy();

    res.json({ message: "User deleted successfully" }); // Return success message
  } catch (error) {
    console.error("Error deleting user:", error); // Log error to console
    res.status(500).json({ error: "Internal Server Error" }); // Return 500 if error occurs
  }
});

router.get("/all", async (req, res) => {
  try {
    // Retrieve all users from the database
    const users = await User.findAll();

    // Respond with the list of users
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/:userId", async (req, res) => {
  try {
    // Extract the userId from the request parameters
    const userId = req.params.userId;

    // Find the user by their ID in the database
    const user = await User.findByPk(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Respond with the user object
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route pour rechercher un user par nom ou prénom
router.get("/search/:letters", async (req, res) => {
  const { letters } = req.params;

  try {
    // Effectuer une recherche d'utilisateurs par nom ou prénom
    const searchResults = await User.findAll({
      where: {
        [Op.or]: [
          { nom: { [Op.like]: `%${letters}%` } },
          { prenom: { [Op.like]: `%${letters}%` } },
        ],
      },
    });

    // Renvoyer les résultats de la recherche en tant que réponse JSON
    res.json(searchResults);
  } catch (error) {
    console.error("Erreur lors de la recherche d'utilisateurs :", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la recherche d'utilisateurs" });
  }
});

//recherche user par son role
router.get("/role/:role", async (req, res) => {
  try {
    // Extract the role from the route parameters
    const role = req.params.role;

    // Find users by their role in the database
    const users = await User.findAll({ where: { role } });

    // Check if any users with the specified role are found
    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ error: `Users not found for the role: ${role}` });
    }

    // Respond with the list of users
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/update", authMiddleware, async (req, res) => {
  try {
    // Extract user ID from the authenticated user
    const userId = req.user.id;

    // Extract fields to update from the request body
    const {
      nom,
      prenom,
      email,
      tel,
      ddn,
      genre,
      adresse,
      password,
      newPassword,
    } = req.body;

    // Find the user by their ID in the database
    const user = await User.findByPk(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user fields
    if (nom) user.nom = nom;
    if (prenom) user.prenom = prenom;
    if (email) user.email = email;
    if (tel) user.tel = tel;
    if (ddn) user.ddn = ddn;
    if (adresse) user.adresse = adresse;
    if (genre) user.genre = genre;

    // Check if the password needs to be updated
    if (password && newPassword) {
      // Check if the provided current password matches the stored password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      // Hash the new password only if it's provided
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
    }

    // Save the updated user
    await user.save();

    // Respond with the updated user object
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
