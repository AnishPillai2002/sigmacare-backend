const express = require("express");
const router = express.Router();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Doctor = require('../../models/Doctor'); 
const Hospital = require('../../models/Hospital'); 
const HospitalAdmin = require('../../models/HospitalAdmin'); 

const authenticateToken = require('../../middlewares/authenticateHospitalAdminToken');



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


// Middleware to validate doctor input data
const validateDoctorData = (req, res, next) => {
    const { name, hospitalId, specialization, experience, contact } = req.body;

    if (!name || !hospitalId || !specialization || experience == null || !contact) {
        return res.status(400).json({ error: 'All fields (name, hospitalId, specialization, experience, contact) are required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(hospitalId)) {
        return res.status(400).json({ error: 'Invalid hospital ID format.' });
    }

    next();
};


// Add New Doctor (Protected Route)
router.post('/add-doctor', authenticateToken, async (req, res) => {
    const { name, hospitalId, specialization, experience, contact } = req.body;

    try {
        // Check if the hospital exists
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ error: 'Hospital not found.' });
        }

        // Create and save the new doctor
        const newDoctor = new Doctor({
            name,
            hospitalId,
            specialization,
            experience,
            contact
        });

        await newDoctor.save();
        res.status(201).json({ message: 'Doctor added successfully.', doctor: newDoctor });

    } catch (error) {
        console.error('Error adding doctor:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;