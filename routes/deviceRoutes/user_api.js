const express = require("express");
const authenticateToken = require("../../middlewares/authenticateToken");
const Device = require("../../models/Device");
const { InfluxDB, flux } = require("@influxdata/influxdb-client");

const router = express.Router();

// Initialize InfluxDB Client
const influx = new InfluxDB({
    url: process.env.INFLUX_URL,
    token: process.env.INFLUX_TOKEN
});
const queryApi = influx.getQueryApi(process.env.INFLUX_ORG);

// 📌 Get all devices registered by the authenticated caretaker
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

// 📌 Get historical sensor data for a specific device
router.get("/sensor-reading/:deviceId", authenticateToken, async (req, res) => {
    try {
        const { deviceId } = req.params;
        console.log("Fetching data for device:", deviceId);

        const timeRange = req.query.time || "-1h"; // Default to last 1 hour

        // Construct InfluxDB Query
        const query = `
            from(bucket: "${process.env.INFLUX_BUCKET}")
            |> range(start: ${timeRange})
            |> filter(fn: (r) => r["_measurement"] == "${process.env.INFLUX_MEASUREMENT}")
            |> filter(fn: (r) => r["deviceId"] == "${deviceId}")
            |> sort(columns: ["_time"], desc: false)
        `;

        const results = [];
        await queryApi.collectRows(query)
            .then(rows => results.push(...rows))
            .catch(err => {
                console.error("InfluxDB Query Error:", err);
                throw new Error("Error executing InfluxDB query.");
            });

        if (!results.length) {
            return res.status(404).json({ message: "No sensor data found for the given time range." });
        }

        res.status(200).json({ deviceId, data: results });
    } catch (error) {
        console.error("Error fetching sensor data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;
