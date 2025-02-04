const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Hospital = require('../models/Hospital');
const HospitalAdmin = require('../models/HospitalAdmin');


// Admin Registration
router.post('/register', async (req, res) => {
    const { email, password, hospital } = req.body;

    try {
        let existingAdmin = await HospitalAdmin.findOne({ email });

        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin already exists' });
        }

        const newHospital = new Hospital(hospital);
        await newHospital.save();

        const newAdmin = new HospitalAdmin({
            email,
            password: password,
            hospitalId: newHospital._id,
            isVerified: false
        });

        await newAdmin.save();

        res.status(201).json({ message: 'Admin registered successfully, pending verification' });
    } catch (error) {
        console.error('Error registering admin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin Login
router.post('/login', async (req, res) => {
    const { email, password, hospitalId } = req.body;

    try {
        const admin = await HospitalAdmin.findOne({ email });

        if (!admin) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        if (admin.hospitalId.toString() !== hospitalId) {
            return res.status(400).json({ error: 'Invalid hospital ID' });
        }    

        const isMatch = await admin.comparePassword(password);


        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        if (!admin.isVerified) {
            return res.status(403).json({ error: 'Account not verified' });
        }

        const token = jwt.sign({ id: admin._id, hospitalId: admin.hospitalId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
// Get all appointments for a hospital admin
// router.get('/admin/appointments', authenticateHospitalAdminToken, async (req, res) => {
//     try {
//         const { hospitalId } = req.admin; // Extract hospitalId from the JWT token

//         const appointments = await Appointment.find(new mongoose.Types.ObjectId(hospitalId));

//         if (!appointments || appointments.length === 0) {
//             return res.status(404).json({ message: 'No appointments found for this hospital.' });
//         }

//         res.status(200).json({ appointments });
//     } catch (error) {
//         console.error('Error fetching appointments:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


