//this has to be deleted in final version


const express = require("express");
const { InfluxDB, Point } = require("@influxdata/influxdb-client"); // Import required InfluxDB modules

const authenticateDevice = require('../../middlewares/authenticateDevice'); // ✅ Import authenticateDevice middleware

const router = express.Router();

// Get InfluxDB Client from environment variables
const influxDB = new InfluxDB({
  url: process.env.INFLUX_URL,
  token: process.env.INFLUX_TOKEN,
});

const writeApi = influxDB.getWriteApi(process.env.INFLUX_ORG, process.env.INFLUX_BUCKET, "ms");
const queryApi = influxDB.getQueryApi(process.env.INFLUX_ORG);

// 📌 POST: Store sensor data in InfluxDB
router.post("/", authenticateDevice, async (req, res) => {
  try {
    const { device_code, temperature, accelX, accelY, accelZ, gyroX, gyroY, gyroZ, bpm, spo2 } = req.body;

    if (!device_code || accelX === undefined || accelY === undefined || accelZ === undefined ||
        gyroX === undefined || gyroY === undefined || gyroZ === undefined || bpm === undefined || spo2 === undefined || temperature === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create the Point object for InfluxDB
    const point = new Point(process.env.INFLUX_MEASUREMENT)
      .tag("deviceId", device_code)
      .floatField("temperature", temperature)
      .floatField("accelX", accelX)
      .floatField("accelY", accelY)
      .floatField("accelZ", accelZ)
      .floatField("gyroX", gyroX)
      .floatField("gyroY", gyroY)
      .floatField("gyroZ", gyroZ)
      .floatField("spo2", spo2)
      .floatField("bpm", bpm) 
      .timestamp(new Date());

    // Write the point to InfluxDB
    writeApi.writePoint(point);
    await writeApi.flush();

    //fall detection
    


    res.status(201).json({ message: "Sensor data stored successfully" });
  } catch (error) {
    console.error("Error storing sensor data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 📌 GET: Retrieve sensor data from InfluxDB by deviceId
router.get("/:deviceId",authenticateDevice, async (req, res) => {
  try {
    const { deviceId } = req.params;

    const query = `from(bucket: "${process.env.INFLUX_BUCKET}")
                    |> range(start: -1h)
                    |> filter(fn: (r) => r["_measurement"] == "${process.env.INFLUX_MEASUREMENT}")
                    |> filter(fn: (r) => r["deviceId"] == "${deviceId}")`;

    // Execute the query
    const data = await queryApi.collectRows(query);

    if (data.length === 0) {
      return res.status(404).json({ message: "No data found for this device" });
    }

    res.json(data);
  } catch (error) {
    console.error("Error retrieving sensor data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
