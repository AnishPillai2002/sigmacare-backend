const express = require("express");
const { InfluxDB, Point } = require("@influxdata/influxdb-client"); // Import required InfluxDB modules

const router = express.Router();

// Get InfluxDB Client from environment variables
const influxDB = new InfluxDB({
  url: process.env.INFLUX_URL,
  token: process.env.INFLUX_TOKEN,
});

const writeApi = influxDB.getWriteApi(process.env.INFLUX_ORG, process.env.INFLUX_BUCKET, "ms");
const queryApi = influxDB.getQueryApi(process.env.INFLUX_ORG);

// 📌 POST: Store sensor data in InfluxDB
router.post("/", async (req, res) => {
  try {
    const { deviceId, accelX, accelY, accelZ, gyroX, gyroY, gyroZ } = req.body;

    if (!deviceId || accelX === undefined || accelY === undefined || accelZ === undefined ||
        gyroX === undefined || gyroY === undefined || gyroZ === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create the Point object for InfluxDB
    const point = new Point(process.env.INFLUX_MEASUREMENT)
      .tag("deviceId", deviceId)
      .floatField("accelX", accelX)
      .floatField("accelY", accelY)
      .floatField("accelZ", accelZ)
      .floatField("gyroX", gyroX)
      .floatField("gyroY", gyroY)
      .floatField("gyroZ", gyroZ)
      .timestamp(new Date());

    // Write the point to InfluxDB
    writeApi.writePoint(point);
    await writeApi.flush();

    res.status(201).json({ message: "Sensor data stored successfully" });
  } catch (error) {
    console.error("Error storing sensor data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 📌 GET: Retrieve sensor data from InfluxDB by deviceId
router.get("/:deviceId", async (req, res) => {
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
