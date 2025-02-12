const express = require("express");
const router = express.Router();
const prescriptionController = require("../controllers/prescription");
const authMiddleware = require("./authMiddleware");

router.post(
  "/addprescriptionAndUpdateTraitement/:traitementId/:patientId/:centreTraitementId",
  authMiddleware,
  prescriptionController.addPrescriptionAndUpdateTraitement
);
router.get(
  "/:prescriptionId/:traitementId",
  authMiddleware,
  prescriptionController.getPrescriptionByIdAndTreatmentId
);

module.exports = router;
