const express = require("express");
const authenticateToken = require("../../middlewares/authenticateToken");
const Device = require("../../models/Device");
const router = express.Router();

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
