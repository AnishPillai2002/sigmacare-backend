const express = require("express");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../../middlewares/authenticateToken"); // Middleware for caretaker auth
const Device = require("../../models/Device");

const router = express.Router();

// 📌 Register a new Device (Caretaker must authenticate)
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { device_code, device_secret } = req.body;
        const caretaker_id = req.user.id;

        if (!device_code || !device_secret) {
            return res.status(400).json({ message: "Device code and secret key are required" });
        }

        // Check if device exists
        const device = await Device.findOne({ device_code, device_secret });

        if (!device) {
            return res.status(401).json({ message: "Invalid device credentials" });
        }

        if (device.isRegistered) {
            return res.status(400).json({ message: "Device is already registered" });
        }

        // Generate JWT token for device authentication
        const token = jwt.sign({ deviceId: device._id }, process.env.JWT_SECRET);

        // Link device to caretaker and mark as registered
        device.caretaker_id = caretaker_id;
        device.isRegistered = true;
        device.jwtToken = token;
        await device.save();

        res.status(200).json({ message: "Device registered successfully", device });
    } catch (error) {
        console.error("Error registering device:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;
