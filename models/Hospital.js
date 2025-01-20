const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Hospital', HospitalSchema);
