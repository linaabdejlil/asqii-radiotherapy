const { Traitement, Scanner, Machine, User, Patient } = require("../models");

// Ajouter un scanner et une machine à un traitement spécifique
exports.addScannerAndMachine = async (req, res) => {
  const { traitementId, patientId } = req.params;

  const {
    type,
    episseurCorps,
    positionBras,
    contentionSBRT,
    marquage,
    docs,
    remarque,
    positionMalade,
    remplissageVescale,
    nom,
    plan,
    masque,
    caleTete,
    billotSousGenous,
    calePied,
    coussinSousVide,
    date,
    etat,
    machineNom,
    detailcible,
  } = req.body;
  const userId = req.user.id; // Get the authenticated user's ID

  try {
    // Vérifier si le traitement existe
    const traitement = await Traitement.findByPk(traitementId);
    if (!traitement) {
      return res.status(404).json({ error: "Traitement not found" });
    }

    // Ajouter le nouveau scanner et l'associer au traitement
    const newScanner = await Scanner.create({
      type,
      episseurCorps,
      positionBras,
      contentionSBRT,
      marquage,
      docs,
      remarque,
      positionMalade,
      remplissageVescale,
      nom,
      plan,
      masque,
      caleTete,
      billotSousGenous,
      calePied,
      coussinSousVide,
      date,
      etat,
      traitementId,
      UserId: userId,
      patientId,
      detailcible,
    });

    // Ajouter la nouvelle machine et l'associer au scanner
    const newMachine = await Machine.create({
      nomMachine: machineNom,
      scannerId: newScanner.id, // Assurez-vous de spécifier le ScannerId
    });

    // Associer le scanner à la machine
    newScanner.setMachine(newMachine);

    // Associer le scanner au traitement
    traitement.setScanner(newScanner);

    res.status(201).json({ scanner: newScanner, machine: newMachine });
  } catch (error) {
    console.error("Error adding scanner and machine:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Obtenir un scanner par son ID
exports.getScannerById = async (req, res) => {
  try {
    const scannerId = req.params.scannerId;

    // Trouver le scanner par ID et inclure les associations avec Machine et Traitement
    const scanner = await Scanner.findByPk(scannerId, {
      include: [
        {
          model: Machine,
          
        },
        {
          model: Traitement,
          include: [Patient], // Include Patient model inside Traitement
        },
        {
          model: User, // Include User model
        },
      ],
    });

    if (!scanner) {
      return res.status(404).json({ error: "Scanner not found" });
    }

    return res.json(scanner);
  } catch (error) {
    console.error("Error fetching scanner by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = exports;
