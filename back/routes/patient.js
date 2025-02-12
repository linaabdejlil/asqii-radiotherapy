//routes/patient.js
const express = require("express");
const router = express.Router();
const patientControllers = require("../controllers/patient");
const { Patient } = require("../models");
const authMiddleware = require("./authMiddleware");

router.get("/all", patientControllers.getAllPatients);
router.post("/add", patientControllers.addPatient);
router.get("/search/:letters", patientControllers.searchPatientsByName);
router.get("/searchDMI/:letters", patientControllers.searchPatientsByDMI);
router.get(
  "/searchDDT/:startDate",
  patientControllers.searchPatientsByStartDate
);
router.get(
  "/searchCT/:letters",
  patientControllers.searchPatientsByTreatmentCenterName
);
router.get(
  "/searchMachine/:letters",
  patientControllers.searchPatientsByScannerMachineName
);
router.post(
  "/assign-users/:patientId",
  patientControllers.assignUsersToPatient
);
router.get(
  "/assigned-users/:patientId",
  patientControllers.getAssignedUsersForPatient
);
router.put("/updatePatient/:id", patientControllers.updatePatient);

router.delete("/deletePatient/:patientId", authMiddleware, async (req, res) => {
  const { patientId } = req.params;

  try {
    // Finding the patient by ID
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Deleting the patient from the database
    await patient.destroy();

    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/total", patientControllers.getTotalPatients);
router.get(
  "/prescription-status-count",
  patientControllers.countPatientsByPrescriptionStatus
);
router.get(
  "/scanner-status-count",
  patientControllers.countPatientsByScannerStatus
);
router.get(
  "/importation-status-count",
  patientControllers.countPatientsByImportationStatus
);
router.get(
  "/contourage-status-count",
  patientControllers.countPatientsByContourageStatus
);
router.get(
  "/dosimetrie-status-count",
  patientControllers.countPatientsByDosimetrieStatus
);
router.get(
  "/validation-status-count",
  patientControllers.countPatientsByValidationStatus
);
router.get(
  "/qualite-status-count",
  patientControllers.countPatientsByQualiteStatus
);



router.get("/:patientId", patientControllers.getPatientById);

module.exports = router;
