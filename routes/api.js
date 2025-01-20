const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken');
const mongoose = require('mongoose');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const router = express.Router();

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

// Book appointment
router.post('/appointments', authenticateToken, async (req, res) => {
    try {
        const { hospitalId, doctorId, date } = req.body;

        if (!hospitalId || !doctorId || !date) {
            return res.status(400).json({ error: 'Hospital ID, Doctor ID, and Date are required.' });
        }

        const appointment = new Appointment({
            userId: req.user.id,
            hospitalId,
            doctorId,
            date
        });

        await appointment.save();
        res.status(201).json({ message: 'Appointment booked successfully', appointment });
    } catch (error) {
        console.error('Error booking appointment:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Delete appointment
router.delete('/appointments/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Appointment ID is required.' });
        }

        const appointment = await Appointment.findByIdAndDelete(id);

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found.' });
        }

        res.status(200).json({ message: 'Appointment deleted successfully.' });
    } catch (error) {
        console.error('Error deleting appointment:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
