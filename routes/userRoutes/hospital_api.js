const express = require('express');
const authenticateToken = require('../../middlewares/authenticateToken');
const Hospital = require('../../models/Hospital');
const Doctor = require('../../models/Doctor');
const router = express.Router();
const mongoose = require('mongoose');

/*
API to fetch hospital and doctor details
*/


// Get all hospitals
router.get('/hospitals', async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        if (!hospitals.length) {
            return res.status(404).json({ message: 'No hospitals found.' });
        }
        res.status(200).json(hospitals);
    } catch (error) {
        console.error('Error fetching hospitals:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


// Get a single hospital by ID
router.get("/hospitals/:hospitalId", async (req, res) => {
    try {
        const { hospitalId } = req.params;

        if (!hospitalId) {
            return res.status(400).json({ error: "Hospital ID is required." });
        }

        const hospital = await Hospital.findById(hospitalId);

        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found." });
        }

        res.status(200).json(hospital);
    } catch (error) {
        console.error("Error fetching hospital details:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
});


// Get all doctors for a hospital
router.get('/hospitals/:hospitalId/doctors', async (req, res) => {
    try {
        const { hospitalId } = req.params;

        if (!hospitalId) {
            return res.status(400).json({ error: 'Hospital ID is required.' });
        }

        const doctors = await Doctor.find({ hospitalId });

        if (!doctors.length) {
            return res.status(404).json({ message: 'No doctors found for the given hospital ID.' });
        }

        res.status(200).json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// GET all doctors
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await Doctor.find().populate('hospitalId');
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET doctor details by ID
router.get('/doctors/:id', async (req, res) => {
    try {
        const doctorId = req.params.id;
        
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            return res.status(400).json({ message: 'Invalid doctor ID' });
        }
        
        const doctor = await Doctor.findById(doctorId).populate('hospitalId');
        
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
