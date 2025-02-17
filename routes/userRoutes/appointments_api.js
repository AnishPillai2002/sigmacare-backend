const express = require('express');
const authenticateToken = require('../../middlewares/authenticateToken');
const mongoose = require('mongoose');
const Appointment = require('../../models/Appointment');
const router = express.Router();


// Book appointment
router.post('/', authenticateToken, async (req, res) => {
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


// Get all appointments for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from token

        // Convert userId to ObjectId for querying the database
        const appointments = await Appointment.find({ userId: new mongoose.Types.ObjectId(userId) });

        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ message: 'No appointments found.' });
        }

        res.status(200).json({ appointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});



// Get a single appointment for the authenticated user
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params; // Extract appointment ID from URL
        const userId = req.user.id; // Extract user ID from token

        if (!id) {
            return res.status(400).json({ error: 'Appointment ID is required.' });
        }

        // Convert id and userId to ObjectId for querying the database
        const appointment = await Appointment.findOne({
            _id: new mongoose.Types.ObjectId(id),
            userId: new mongoose.Types.ObjectId(userId),
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found or does not belong to the user.' });
        }

        res.status(200).json({ appointment });
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


// Update a single appointment for the authenticated user
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params; // Extract appointment ID from URL
        const userId = req.user.id; // Extract user ID from token
        const updateData = req.body; // Get update data from request body

        if (!id) {
            return res.status(400).json({ error: 'Appointment ID is required.' });
        }

        // Convert id and userId to ObjectId for querying the database
        const updatedAppointment = await Appointment.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(id), userId: new mongoose.Types.ObjectId(userId) },
            { $set: updateData },
            { new: true, runValidators: true } // Return updated document and validate changes
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found or does not belong to the user.' });
        }

        res.status(200).json({ message: 'Appointment updated successfully.', appointment: updatedAppointment });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


// Delete appointment
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Appointment ID is required.' });
        }

        // Convert id to ObjectId for MongoDB query
        const appointment = await Appointment.findByIdAndDelete(new mongoose.Types.ObjectId(id));

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

