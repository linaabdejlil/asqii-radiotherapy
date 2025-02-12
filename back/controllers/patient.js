//controllers/patient.js

const {
  Patient,
  Traitement,
  Contourage,
  Dosimetrie,
  Importation,
  Validation,
  Qualite,
  Scanner,
  Prescription,
  Seance,
  Machine,
  CentreTraitement,
  UserPatient,
  User,
} = require("../models");
const { Op, where, col } = require("sequelize"); // Ensure Op and other utilities are imported

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      include: [
        {
          model: Traitement,
         
          include: [
            {
              model: Contourage,
             
            },
            {
              model: Dosimetrie,
             
            },
            {
              model: Importation,
              
            },
            {
              model: Validation,
              
            },
            {
              model: Qualite,
              
            },
            {
              model: Scanner,
           
              include: [
                {
                  model: Machine,
                  
                },
              ],
            },
            {
              model: Prescription,
             
            },
            {
              model: Seance,
             
            },

            {
              model: CentreTraitement,
              
            },
          ],
        },
      ],
    });

    // Renvoyer les patients en tant que réponse JSON
    res.json(patients);
  } catch (error) {
    console.error("Erreur lors de la récupération des patients :", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la récupération des patients" });
  }
};

exports.addPatient = async (req, res) => {
  const {
    nom,
    prenom,
    dateNaissance,
    sexe,
    mail,
    numTel,
    autres,
    adresse,
    DMI,
    Cin,
    securiteSociale,
    nationalite,
  } = req.body;

  try {
    // Créer un nouveau patient dans la base de données
    const newPatient = await Patient.create({
      nom,
      prenom,
      dateNaissance,
      sexe,
      mail,
      numTel,
      autres,
      adresse,
      DMI,
      Cin,
      securiteSociale,
      nationalite,
    });

    // Renvoyer le nouveau patient créé en tant que réponse JSON
    res.json(newPatient);
  } catch (error) {
    console.error("Erreur lors de l'ajout du patient :", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de l'ajout du patient" });
  }
};

exports.getPatientById = async (req, res) => {
  const { patientId } = req.params;

  try {
    // Récupérer le patient avec les détails de traitement et contourage associés
    const patientWithDetails = await Patient.findByPk(patientId, {
      include: [
        {
          model: Traitement,
      
          include: [
            {
              model: Contourage,
              
            },
            {
              model: Dosimetrie,
            },
            {
              model: Importation,
              
            },
            {
              model: Validation,
              
            },
            {
              model: Qualite,
            
            },
            {
              model: Scanner,
          
              include: [
                {
                  model: Machine,
                  
                },
              ],
            },
            {
              model: Prescription,
             
            },
            {
              model: Seance,
             
            },

            {
              model: CentreTraitement,
              
            },
          ],
        },
      ],
    });

    if (!patientWithDetails) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Return the patient with details as a JSON response
    res.json(patientWithDetails);
  } catch (error) {
    console.error(`Error getting patient by ID ${patientId}:`, error.message);
    console.error(error.stack);
    res.status(500).json({ error: "Server error while getting patient by ID" });
  }
};

// Rechercher des patients par nom ou prénom

// Rechercher des patients par nom ou prénom
exports.searchPatientsByName = async (req, res) => {
  const { letters } = req.params;

  try {
    const searchResults = await Patient.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { nom: { [Op.like]: `%${letters}%` } },
              { prenom: { [Op.like]: `%${letters}%` } },
            ],
          },
        ],
      },
      include: [
        {
          model: Traitement,
        
          include: [
            {
              model: Contourage,
              
            },
            {
              model: Dosimetrie,
            },
            {
              model: Importation,
              
            },
            {
              model: Validation,
         
            },
            { model: Qualite },

            {
              model: Scanner,
             
              include: [{ model: Machine }],
            },
            {
              model: Prescription,
              
            },
            {
              model: Seance,
              
            },
            {
              model: CentreTraitement,
              
            },
          ],
        },
      ],
    });

    res.json(searchResults);
  } catch (error) {
    console.error("Erreur lors de la recherche de patients :", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la recherche de patients" });
  }
};

// Rechercher des patients par DMI

// Rechercher des patients par DMI
exports.searchPatientsByDMI = async (req, res) => {
  const { letters } = req.params;

  try {
    const searchResults = await Patient.findAll({
      where: {
        [Op.or]: [{ DMI: { [Op.like]: `%${letters}%` } }],
      },
      include: [
        {
          model: Traitement,
          
          include: [
            {
              model: Contourage,
              
            },
            {
              model: Dosimetrie,
              
            },
            {
              model: Importation,
              
            },
            {
              model: Validation,
             
            },
            { model: Qualite},

            {
              model: Scanner,
              
              include: [{ model: Machine, attributes }],
            },
            {
              model: Prescription,
             
            },
            {
              model: Seance,
              
            },
            {
              model: CentreTraitement,
              
            },
          ],
        },
      ],
    });

    res.json(searchResults);
  } catch (error) {
    console.error("Erreur lors de la recherche de patients :", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la recherche de patients" });
  }
};

// Rechercher des patients par date de début de traitement
exports.searchPatientsByStartDate = async (req, res) => {
  const { startDate } = req.params;

  try {
    // Parse the start date to ensure it's in the correct format
    const parsedStartDate = new Date(startDate);

    // Effectuer une recherche de patients par date de début de traitement
    const searchResults = await Patient.findAll({
      include: [
        {
          model: Traitement,
         
          where: {
            dateDebut: {
              [Op.between]: [
                parsedStartDate,
                new Date(parsedStartDate.getTime() + 24 * 60 * 60 * 1000),
              ],
            },
          },
          include: [
            {
              model: Contourage,
              
            },
            {
              model: Dosimetrie,
             
            },
            {
              model: Importation,
             
            },
            {
              model: Validation,
            },
            {
              model: Qualite,
              
            },
            {
              model: Scanner,
           
              include: [
                {
                  model: Machine,
                
                },
              ],
            },
            {
              model: Prescription,
            
            },
            {
              model: Seance,
             
            },

            {
              model: CentreTraitement,
              
            },
          ],
        },
      ],
    });

    res.json(searchResults);
  } catch (error) {
    console.error("Erreur lors de la recherche de patients :", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la recherche de patients" });
  }
};

// Rechercher des patients par nom du centre de traitement

exports.searchPatientsByTreatmentCenterName = async (req, res) => {
  const { letters } = req.params;

  try {
    const searchResults = await Patient.findAll({
      include: [
        {
          model: Traitement,
         
          include: [
            {
              model: Contourage,
            },
            {
              model: Dosimetrie,
            },
            {
              model: Importation,
              
            },
            {
              model: Validation,
            },
            {
              model: Qualite,
            
            },
            {
              model: Scanner,
             
              include: [
                {
                  model: Machine,
                 
                },
              ],
            },
            {
              model: Prescription,
              
            },
            {
              model: Seance,
              
            },
            {
              model: CentreTraitement,
              
              where: {
                nom: {
                  [Op.like]: `%${letters}%`,
                },
              },
              required: true, // Ensure that only treatments with the specified CentreTraitement are included
            },
          ],
          required: true, // Ensure that only patients with the specified Traitement are included
        },
      ],
    });

    // Renvoyer les résultats de la recherche en tant que réponse JSON
    res.json(searchResults);
  } catch (error) {
    console.error("Erreur lors de la recherche de patients :", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la recherche de patients" });
  }
};

// Rechercher des patients par nom de la machine de scanner
exports.searchPatientsByScannerMachineName = async (req, res) => {
  const { letters } = req.params;

  try {
    const searchResults = await Patient.findAll({
      include: [
        {
          model: Traitement,
         
          include: [
            {
              model: Contourage,
              
            },
            {
              model: Dosimetrie,
              
            },
            {
              model: Importation,
              
            },
            {
              model: Validation,
            
            },
            {
              model: Qualite,
             
            },
            {
              model: Scanner,
            
              include: [
                {
                  model: Machine,
                  
                  where: {
                    nomMachine: {
                      [Op.like]: `%${letters}%`,
                    },
                  },
                  required: true,
                },
              ],
              required: true, // Ensure that only Scanners with the specified Machine are included
            },
            {
              model: Prescription,
             
            },
            {
              model: Seance,
              
            },
            {
              model: CentreTraitement,
              
            },
          ],
          required: true, // Ensure that only treatments with the specified Scanner are included
        },
      ],
    });

    // Renvoyer les résultats de la recherche en tant que réponse JSON
    res.json(searchResults);
  } catch (error) {
    console.error("Erreur lors de la recherche de patients :", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la recherche de patients" });
  }
};

// Affecter des utilisateurs à un patient donné
exports.assignUsersToPatient = async (req, res) => {
  const { patientId } = req.params;
  const { userIds } = req.body;

  try {
    // Récupérer le patient par son ID
    const patient = await Patient.findByPk(patientId);

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Affecter les utilisateurs au patient
    await patient.addUsers(userIds);

    res.json({ message: "Users assigned to patient successfully" });
  } catch (error) {
    console.error("Error assigning users to patient:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Récupérer les utilisateurs affectés à un patient donné
exports.getAssignedUsersForPatient = async (req, res) => {
  const { patientId } = req.params;

  try {
    // Récupérer le patient par son ID avec les utilisateurs associés
    const patient = await Patient.findByPk(patientId, {
      include: [
        {
          model: User,
          attributes: [
            "id",
            "role",
            "nom",
            "prenom",
            "email",
            "tel",
            "ddn",
            "genre",
            "image",
          ], // Choisissez les attributs que vous souhaitez afficher pour les utilisateurs
        },
      ],
    });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Extraire les utilisateurs du patient
    const assignedUsers = patient.Users;

    // Renvoyer les utilisateurs affectés en tant que réponse JSON
    res.json(assignedUsers);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des utilisateurs affectés au patient :",
      error
    );
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des utilisateurs affectés",
    });
  }
};
exports.getTotalPatients = async (req, res) => {
  try {
    const totalPatients = await Patient.count();
    res.json({ totalPatients });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du nombre total de patients :",
      error
    );
    res.status(500).json({
      error:
        "Erreur serveur lors de la récupération du nombre total de patients",
    });
  }
};

exports.countPatientsByPrescriptionStatus = async (req, res) => {
  try {
    // Count patients with treatments that have no associated prescription
    const waitingCount = await Patient.count({
      include: [
        {
          model: Traitement,
          required: true,
          include: [
            {
              model: Prescription,
              required: false,
            },
          ],
        },
      ],
      where: {
        "$Traitements->Prescription.id$": null,
      },
    });

    // Count patients with treatments linked to a completed prescription
    const completedCount = await Patient.count({
      include: [
        {
          model: Traitement,
          required: true,
          include: [
            {
              model: Prescription,
              required: true,
              where: { etat: true },
            },
          ],
        },
      ],
    });

    res.json({
      waitingCount,
      completedCount,
    });
  } catch (error) {
    console.error("Error counting patients by prescription status:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
exports.countPatientsByScannerStatus = async (req, res) => {
  try {
    // Patients with completed prescriptions but without a scanner
    const waitingCount = await Patient.count({
      include: [
        {
          model: Traitement,
          required: true,
          include: [
            {
              model: Prescription,
              required: true,
              where: { etat: true },
            },
          ],
          where: {
            scannerId: {
              [Op.is]: null,
            },
          },
        },
      ],
    });

    // Patients with completed scanners
    const completedCount = await Patient.count({
      include: [
        {
          model: Traitement,
          required: true,
          include: [
            {
              model: Scanner,
              required: true,
              where: { etat: true },
            },
          ],
        },
      ],
    });

    res.json({
      waitingCount,
      completedCount,
    });
  } catch (error) {
    console.error("Error counting patients by scanner status:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
exports.countPatientsByImportationStatus = async (req, res) => {
  try {
    // Count patients waiting for importation (scanner state is true and no importation)
    const waitingCount = await Patient.count({
      include: [
        {
          model: Traitement,
          required: true,
          include: [
            {
              model: Scanner,
              required: true,
              where: { etat: true },
            },
          ],
          where: {
            importationId: null,
          },
        },
      ],
    });

    // Count patients with completed importation (importation state is true)
    const completedCount = await Patient.count({
      include: [
        {
          model: Traitement,
          required: true,
          include: [
            {
              model: Importation,
              required: true,
              where: { etat: true },
            },
          ],
        },
      ],
    });

    res.json({
      waitingCount,
      completedCount,
    });
  } catch (error) {
    console.error("Error counting patients by importation status:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
exports.countPatientsByContourageStatus = async (req, res) => {
  try {
    // Count patients waiting for contourage (importation state is true and no contourage)
    const waitingCount = await Patient.count({
      include: [
        {
          model: Traitement,
          required: true,
          include: [
            {
              model: Importation,
              required: true,
              where: { etat: true },
            },
          ],
          where: {
            contourageId: null,
          },
        },
      ],
    });

    // Count patients with completed contourage (contourage state is true)
    const completedCount = await Patient.count({
      include: [
        {
          model: Traitement,
          required: true,
          include: [
            {
              model: Contourage,
              required: true,
              where: { etat: true },
            },
          ],
        },
      ],
    });

    res.json({
      waitingCount,
      completedCount,
    });
  } catch (error) {
    console.error("Error counting patients by contourage status:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
exports.countPatientsByDosimetrieStatus = async (req, res) => {
  try {
    // Count patients waiting for dosimetry (contourage state is true and no dosimetry)
    const waitingCount = await Patient.count({
      include: [
        {
          model: Traitement,
          required: true,
          include: [
            {
              model: Contourage,
              required: true,
              where: { etat: true },
            },
          ],
          where: {
            dosimetrieId: null,
          },
        },
      ],
    });

    // Count patients with completed dosimetry (dosimetry state is true)
    const completedCount = await Patient.count({
      include: [
        {
          model: Traitement,
          required: true,
          include: [
            {
              model: Dosimetrie,
              required: true,
              where: { etat: true },
            },
          ],
        },
      ],
    });

    res.json({
      waitingCount,
      completedCount,
    });
  } catch (error) {
    console.error("Error counting patients by dosimetry status:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
exports.countPatientsByValidationStatus = async (req, res) => {
  try {
    const waitingCount = await Patient.count({
      include: [
        {
          model: Traitement,
          required: true,
          include: [
            {
              model: Dosimetrie,
              required: true,
              where: { etat: true },
            },
          ],
          where: {
            validationId: null,
          },
        },
      ],
    });

    // Count patients with completed validation (validation state is true)
    const completedCount = await Patient.count({
      include: [
        {
          model: Traitement,
          required: true,
          include: [
            {
              model: Validation,
              required: true,
              where: { etat: true },
            },
          ],
        },
      ],
    });

    res.json({
      waitingCount,
      completedCount,
    });
  } catch (error) {
    console.error("Error counting patients by validation status:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

exports.countPatientsByQualiteStatus = async (req, res) => {
  try {
   

    // Count patients with completed qualite (qualite state is true)
    const completedCount = await Patient.count({
      include: [
        {
          model: Traitement,
          required: true,
          include: [
            {
              model: Qualite,
              required: true,
              where: { etat: true },
            },
          ],
        },
      ],
    });

    res.json({
      completedCount,
    });
  } catch (error) {
    console.error("Error counting patients by qualite status:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
exports.updatePatient = async (req, res) => {
  try {
    const patientId = req.params.id;
    const { nom, prenom, dateNaissance, sexe, mail, numTel, autres, adresse, DMI, Cin, securiteSociale, nationalite } = req.body;

    // Trouver le patient par ID
    const patient = await Patient.findByPk(patientId);

    if (!patient) {
      return res.status(404).json({ message: "Patient non trouvé" });
    }

    // Mettre à jour les champs du patient
    patient.nom = nom || patient.nom;
    patient.prenom = prenom || patient.prenom;
    patient.dateNaissance = dateNaissance || patient.dateNaissance;
    patient.sexe = sexe || patient.sexe;
    patient.mail = mail || patient.mail;
    patient.numTel = numTel || patient.numTel;
    patient.autres = autres || patient.autres;
    patient.adresse = adresse || patient.adresse;
    patient.DMI = DMI || patient.DMI;
    patient.Cin = Cin || patient.Cin;
    patient.securiteSociale = securiteSociale || patient.securiteSociale;
    patient.nationalite = nationalite || patient.nationalite;

    // Sauvegarder les modifications
    await patient.save();

    res.status(200).json({ message: "Patient mis à jour avec succès", patient });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du patient:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

