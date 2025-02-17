const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },  // Unique ID for each device
  accelX: { type: Number, required: true },
  accelY: { type: Number, required: true },
  accelZ: { type: Number, required: true },
  gyroX: { type: Number, required: true },
  gyroY: { type: Number, required: true },
  gyroZ: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now } // Auto-stores the time of reading
});

const SensorData = mongoose.model("SensorData", sensorDataSchema);

module.exports = SensorData;
