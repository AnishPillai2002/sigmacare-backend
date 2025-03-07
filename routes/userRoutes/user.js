const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const Device = require("../../models/Device");
const authenticateToken = require('../../middlewares/authenticateToken');
const router = express.Router();


// User Registration
router.post('/register', async (req, res) => {
    try {
        const { username, email, password,phone} = req.body;
        const user = new User({ username, email, password, phone });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get Current User (Protected Route)
router.get("/me", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id, "-password"); // Exclude password field

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get all devices registered by the authenticated caretaker
router.get("/my-devices", authenticateToken, async (req, res) => {
    try {
        const caretaker_id = req.user.id;

        // Fetch devices linked to the caretaker
        const devices = await Device.find({ caretaker_id });

        if (!devices.length) {
            return res.status(404).json({ message: "No registered devices found." });
        }

        res.status(200).json({ devices });
    } catch (error) {
        console.error("Error fetching devices:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
