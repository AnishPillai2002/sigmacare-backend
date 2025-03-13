const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  device_name: { type: String, required: true },
  device_code: { type: String, required: true, unique: true },
  device_secret: { type: String, required: true, unique: true },
  caretaker_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Nullable until registered
  isRegistered: { type: Boolean, default: false }, // Default is false, changes to true upon registration
  jwtToken: { type: String, default: null } // Store permanent JWT token
}, { timestamps: true });

const Device = mongoose.model("Device", deviceSchema);

module.exports = Device;
