const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
    date: { type: String, required: true }, // Store as YYYY-MM-DD
    doctorSlots: [
        {
            doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
            maxAppointments: { type: Number, required: true },
        }
    ]
});

module.exports = mongoose.model("Schedule", ScheduleSchema);
