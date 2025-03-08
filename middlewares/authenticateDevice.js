const Device = require("../models/Device");

const authenticateDevice = async (req, res, next) => {
    try {
        const { device_code } = req.body;
        // Ensure device_code is provided
        if (!device_code) {
            return res.status(400).json({ message: "Device authentication failed: Missing device_code" });
        }

        // Find the device in the database
        const device = await Device.findOne({ device_code });

        // Check if the device exists
        if (!device) {
            return res.status(401).json({ message: "Invalid device_code" });
        }

        // Check if the device is registered (i.e., has a caretaker_id)
        if (!device.isRegistered) {
            return res.status(403).json({ message: "Device is not registered with a caretaker" });
        }

        // Attach the device info to the request object
        req.device = device;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Device authentication error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = authenticateDevice;
