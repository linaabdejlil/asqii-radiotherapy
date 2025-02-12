const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const helmet = require("helmet");
const http = require("http");
const socketIo = require("./socketIO"); // Importez le module socketIO
const sequelize = require("./config/database");
const models = require("./models");
const patientRoutes = require("./routes/patient");
const traitementRoutes = require("./routes/traitement");
const contourageRoutes = require("./routes/contourage");
const dosimetrieRoutes = require("./routes/dosimetrie");
const importationRoutes = require("./routes/importation");
const qualiteRoutes = require("./routes/qualite");
const validationRoutes = require("./routes/validation");
const scannerRoutes = require("./routes/scanner");
const machineRoutes = require("./routes/machine");
const prescriptionRoutes = require("./routes/prescription");
const centreTraitementRoutes = require("./routes/centreTraitement");
const seanceRoutes = require("./routes/seance");
const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/messages");
const discussionsRouter = require("./routes/discussions");
const mdpRouter = require("./routes/mdp");
const notifRouter = require("./routes/notification");
const noteRouter = require("./routes/note");

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configurer Cloudinary
cloudinary.config({
  cloud_name: 'dh3co0nj3', 
  api_key: '427651133419167', 
  api_secret: 'ymc1eOdevnWvpap28KjwbUna8Ig'
});

// Configurer le stockage multer pour Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "radiotherapie",
    resource_type: "auto", // Automatically detect the resource type
    public_id: (req, file) => "uploaded_" + Date.now(),
    allowed_formats: [
      "jpg",
      "png",
      "jpeg",
      "gif",
      "webp",
      "pdf",
      "docx",
      "mp4",
      "txt",
    ],

    transformation: [{ width: 150, height: 150, crop: "limit" }],
  },
});
const upload = multer({ storage: storage });

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger("dev"));
app.use(helmet({ contentSecurityPolicy: false, xDownloadOptions: false }));

// Initialiser Socket.io
const socketServer = http.createServer(app);
socketIo.initializeSocket(socketServer);
// Configuration de l'instance de Socket.io
// app.set("socketio", io);
socketServer.listen(4000);
// Routes
app.use("/patients", patientRoutes);
app.use("/traitements", traitementRoutes);
app.use("/contourages", contourageRoutes);
app.use("/dosimetries", dosimetrieRoutes);
app.use("/importations", importationRoutes);
app.use("/qualites", qualiteRoutes);
app.use("/validations", validationRoutes);
app.use("/scanners", scannerRoutes);
app.use("/machines", machineRoutes);
app.use("/prescriptions", prescriptionRoutes);
app.use("/seances", seanceRoutes);
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);
app.use("/discussions", discussionsRouter);
app.use("/centreTraitements", centreTraitementRoutes);
app.use("/mdp", mdpRouter);
app.use("/notifications", notifRouter);
app.use("/notes", noteRouter);

// Assurez-vous que tous les modèles sont importés avant de synchroniser la base de données
const {
  User,
  Patient,
  Traitement,
  Scanner,
  Seance,
  Machine,
  Message,
  Notification,
  Note,
} = models;

// Synchroniser la base de données avec les modèles Sequelize et créer la base de données si elle n'existe pas
sequelize
  .sync({ force: false }) // Définissez force sur false pour la production
  .then(() => {
    console.log("Base de données synchronisée avec succès");

    // Démarrer le serveur une fois la synchronisation terminée
    const PORT = process.env.PORT || 4001;
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Le serveur fonctionne sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erreur lors de run de serveur  :", err);
  });

// Route d'exemple pour gérer les téléversements d'images à l'aide de Cloudinary
app.post("/upload", upload.single("image"), (req, res) => {
  // Accéder aux informations sur l'image téléversée dans req.file
  res.json({ imageUrl: req.file.path });
});

module.exports = app;
