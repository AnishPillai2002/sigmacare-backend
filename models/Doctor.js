const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    hospitalId: { type: String, required: true },  // store hospitalId as a string
    specialization: { type: String, required: true },
    experience: { type: Number },
    contact: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);
