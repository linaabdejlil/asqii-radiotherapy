const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const { User } = require("../models");

const router = express.Router();

// Route pour la demande de réinitialisation de mot de passe
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Vérifier si l'e-mail existe dans la base de données
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ error: "Aucun utilisateur trouvé avec cet e-mail" });
    }

    // Générer un code de réinitialisation
    const resetCode = uuidv4();

    // Enregistrer le code de réinitialisation et son expiration dans la base de données
    user.resetCode = resetCode;
    user.resetCodeExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 heures d'expiration
    await user.save();

    // Envoyer un e-mail contenant le code de réinitialisation
    const transporter = nodemailer.createTransport({
      // Configurer le transporteur SMTP pour l'envoi d'e-mails
      // Exemple : Gmail
      service: "gmail",
      auth: {
        user: "talbihajer01@gmail.com",
        pass: "dmgqxthjmdbgelap",
      },
    });

    const mailOptions = {
      from: "talbihajer01@gmail.com",
      to: email,
      subject: "Réinitialisation de mot de passe",
      //text: `Utilisez ce code pour réinitialiser votre mot de passe : ${resetCode}`,
      html: `<!DOCTYPE html>
      <html lang="en" >
      <head>
        <meta charset="UTF-8">
        <title>CodePen - OTP Email Template</title>
      </head>
      <body>
        <!-- partial:index.partial.html -->
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
          <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
              <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Radiothérapie</a>
            </div>
            <p style="font-size:1.1em">Bonjour,</p>
            <p>Utilisez ce code pour réinitialiser votre mot de passe. Ce code s'expire dans un jour</p>
            <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${resetCode}</h2>
            <p style="font-size:0.9em;">Coordialement,<br />ASQII</p>
            <hr style="border:none;border-top:1px solid #eee" />
            <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
              <p>Radiothérapie</p>
              <p>Réinitialisation de mot de passe</p>
              <p>Tunis</p>
            </div>
          </div>
        </div>
        <!-- partial -->
      </body>
      </html>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Un e-mail de réinitialisation de mot de passe a été envoyé.",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la réinitialisation du mot de passe" });
  }
});

// Route pour la réinitialisation de mot de passe avec le code
router.post("/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    console.log(code);
    // Vérifier si l'e-mail existe dans la base de données
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ error: "Aucun utilisateur trouvé avec cet e-mail" });
    }

    // Vérifier si le code de réinitialisation est valide et non expiré
    if (user.resetCode !== code || Date.now() > user.resetCodeExpires) {
      return res
        .status(400)
        .json({ error: "Code de réinitialisation invalide ou expiré" });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe de l'utilisateur dans la base de données
    user.password = hashedPassword;
    user.resetCode = null; // Effacer le code de réinitialisation une fois utilisé
    user.resetCodeExpires = null;
    await user.save();

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la réinitialisation du mot de passe" });
  }
});

module.exports = router;
