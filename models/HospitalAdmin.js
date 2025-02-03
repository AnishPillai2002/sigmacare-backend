const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const HospitalAdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true }, // Reference to Hospital
}, { timestamps: true });

// Hash password before saving
HospitalAdminSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to check if password is correct
HospitalAdminSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('HospitalAdmin', HospitalAdminSchema);
