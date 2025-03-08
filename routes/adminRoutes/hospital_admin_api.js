const express = require("express");
const router = express.Router();

const jwt = require('jsonwebtoken');
const Doctor = require('../../models/Doctor'); 
const Hospital = require('../../models/Hospital'); 
const HospitalAdmin = require('../../models/HospitalAdmin'); 
const Schedule = require("../../models/Schedule");

const authenticateHospitalAdminToken = require('../../middlewares/authenticateHospitalAdminToken');



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
    const { email, password} = req.body;

    try {
        const admin = await HospitalAdmin.findOne({ email });

        if (!admin) {
            return res.status(400).json({ error: 'Invalid credentials' });
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



// Add New Doctor (Protected Route)
router.post('/add-doctor', authenticateHospitalAdminToken, async (req, res) => {
    const { name, specialization, experience, contact } = req.body;
    const hospitalId = req.admin.hospitalId;
    try {

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

// Get Single Doctor Details (Protected Route)
router.get('/doctor/:doctorId', authenticateHospitalAdminToken, async (req, res) => {
    try {
        const { doctorId } = req.params;
        const hospitalId = req.admin.hospitalId;

        // Find the doctor and ensure they belong to the same hospital
        const doctor = await Doctor.findOne({ _id: doctorId, hospitalId });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found or does not belong to your hospital.' });
        }

        res.status(200).json({ doctor });

    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


// Update Doctor Details (Protected Route)
router.put('/doctor/:doctorId', authenticateHospitalAdminToken, async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { name, specialization, experience, contact } = req.body;
        const hospitalId = req.admin.hospitalId;

        // Find the doctor and ensure they belong to the same hospital
        const doctor = await Doctor.findOne({ _id: doctorId, hospitalId });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found or does not belong to your hospital.' });
        }

        // Update doctor details
        if (name) doctor.name = name;
        if (specialization) doctor.specialization = specialization;
        if (experience) doctor.experience = experience;
        if (contact) doctor.contact = contact;

        await doctor.save();
        res.status(200).json({ message: 'Doctor details updated successfully.', doctor });

    } catch (error) {
        console.error('Error updating doctor:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


// Get All Doctors (Protected Route)
router.get('/doctors', authenticateHospitalAdminToken, async (req, res) => {

    try{
        const hospitalId = req.admin.hospitalId;
        const doctors = await Doctor.find({hospitalId});

        res.status(200).json({ doctors });

    }catch(error){
        console.error('Error getting doctors:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Create a schedule for a specific date with doctor slots
router.post("/create-schedule", authenticateHospitalAdminToken, async (req, res) => {
    try {
        const {date, doctorSlots } = req.body;

        const hospitalId = req.admin.hospitalId;

        if (!hospitalId || !date || !doctorSlots || !doctorSlots.length) {
            return res.status(400).json({ message: "Date, and doctor slots are required" });
        }

        // Check if a schedule already exists for the hospital on the given date
        const existingSchedule = await Schedule.findOne({ hospitalId, date });

        if (existingSchedule) {
            return res.status(400).json({ message: "Schedule already exists for this date" });
        }

        // Validate each doctor and create schedule entries
        const scheduleEntries = [];

        for (const slot of doctorSlots) {
            const { doctorId, maxAppointments } = slot;

            // Check if the doctor exists
            const doctor = await Doctor.findOne({ _id: doctorId, hospitalId });
            if (!doctor) {
                return res.status(404).json({ message: `Doctor with ID ${doctorId} not found in this hospital` });
            }

            scheduleEntries.push({ doctorId, maxAppointments });
        }

        // Create new schedule
        const newSchedule = new Schedule({
            hospitalId,
            date,
            doctorSlots: scheduleEntries,
        });

        await newSchedule.save();

        res.status(201).json({ message: "Schedule created successfully", schedule: newSchedule });

    } catch (error) {
        console.error("Error creating schedule:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update a schedule using the date
router.put("/update-schedule", authenticateHospitalAdminToken, async (req, res) => {
    try {
        const {date, doctorSlots } = req.body;
        const hospitalId = req.admin.hospitalId;
        if (!hospitalId || !date || !doctorSlots || !doctorSlots.length) {
            return res.status(400).json({ message: "Date, and doctor slots are required" });
        }

        // Find the schedule by hospital ID and date
        const schedule = await Schedule.findOne({ hospitalId, date });

        if (!schedule) {
            return res.status(404).json({ message: "Schedule not found for the given date" });
        }

        // Validate each doctor before updating slots
        for (const slot of doctorSlots) {
            const { doctorId, maxAppointments } = slot;

            // Check if the doctor exists in this hospital
            const doctor = await Doctor.findOne({ _id: doctorId, hospitalId });

            if (!doctor) {
                return res.status(404).json({ message: `Doctor with ID ${doctorId} not found in this hospital` });
            }
        }

        // Update the doctor slots in the schedule
        schedule.doctorSlots = doctorSlots;
        await schedule.save();

        res.status(200).json({ message: "Schedule updated successfully", schedule });

    } catch (error) {
        console.error("Error updating schedule:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get schedules of a specific day
router.get("/get-schedule", authenticateHospitalAdminToken, async (req, res) => {
    try {
        const {date } = req.body;
        const hospitalId = req.admin.hospitalId;

        if (!hospitalId || !date) {
            return res.status(400).json({ message: "Date are required" });
        }

        // Find schedules for the given date and hospital
        const schedules = await Schedule.find({ hospitalId, date });

        if (!schedules.length) {
            return res.status(404).json({ message: "No schedules found for this date" });
        }

        res.status(200).json({ schedules });

    } catch (error) {
        console.error("Error fetching schedules:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get all schedules
router.get("/get-schedules", authenticateHospitalAdminToken, async (req, res) => {
    try {
        const hospitalId = req.admin.hospitalId;

        if (!hospitalId) {
            return res.status(400).json({ message: "HospitalId are required" });
        }

        // Find schedules for the given date and hospital
        const schedules = await Schedule.find({ hospitalId});

        if (!schedules.length) {
            return res.status(404).json({ message: "No schedules found" });
        }

        res.status(200).json({ schedules });

    } catch (error) {
        console.error("Error fetching schedules:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;