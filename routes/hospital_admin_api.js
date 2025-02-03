const jwt = require('jsonwebtoken');
const HospitalAdmin = require('../models/HospitalAdmin');
const authenticateHospitalAdminToken = require('../middlewares/authenticateHospitalAdminToken');
const express = require('express');;
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const router = express.Router();



router.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await HospitalAdmin.findOne({ email });

        if (!admin) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await admin.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id, hospitalId: admin.hospitalId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all appointments for a hospital admin
router.get('/admin/appointments', authenticateHospitalAdminToken, async (req, res) => {
    try {
        const { hospitalId } = req.admin; // Extract hospitalId from the JWT token

        const appointments = await Appointment.find(new mongoose.Types.ObjectId(hospitalId));

        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ message: 'No appointments found for this hospital.' });
        }

        res.status(200).json({ appointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


