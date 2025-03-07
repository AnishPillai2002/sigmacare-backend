const express = require('express');
const authenticateToken = require('../../middlewares/authenticateToken');
const Patient = require('../../models/Patient');
const router = express.Router();

/*
API to help caretakers manage patients
*/

// 📌 Add a Patient
router.post("/", authenticateToken, async (req, res) => {
    try {
      const { name, age, medical_conditions, device_id } = req.body;
  
      if (!name || !age ) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      // Extract caretaker_id from authenticated user
      const caretaker_id = req.user.id; 
      console.log(caretaker_id);
      const newPatient = new Patient({ name, age, caretaker_id, medical_conditions, device_id });
      await newPatient.save();
  
      res.status(201).json({ message: "Patient added successfully", patient: newPatient });
    } catch (error) {
      console.error("Error adding patient:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
});
  
// 📌 Get All Patients
router.get("/",authenticateToken, async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 📌 Get Patient by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 📌 Delete Patient
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const patientId = req.params.id;

        // Find and delete the patient
        const deletedPatient = await Patient.findByIdAndDelete(patientId);

        if (!deletedPatient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.status(200).json({ message: "Patient deleted successfully", patient: deletedPatient });
    } catch (error) {
        console.error("Error deleting patient:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// 📌 Update Patient
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const patientId = req.params.id;
        const { name, age, medical_conditions, device_id } = req.body;

        // Find and update the patient
        const updatedPatient = await Patient.findByIdAndUpdate(
            patientId,
            { name, age, medical_conditions, device_id },
            { new: true, runValidators: true } // Return the updated document & validate fields
        );

        if (!updatedPatient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.status(200).json({ message: "Patient updated successfully", patient: updatedPatient });
    } catch (error) {
        console.error("Error updating patient:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;
