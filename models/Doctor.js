const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },  
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    contact: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);
