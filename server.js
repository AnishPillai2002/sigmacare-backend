require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { InfluxDB } = require("@influxdata/influxdb-client");

const userRoutes = require('./routes/userRoutes/user');
const adminRoutes = require('./routes/adminRoutes/hospital_admin_api');
const apiRoutes = require('./routes/userRoutes/hospital_api');
const appointmentRoutes = require('./routes/userRoutes/appointments_api');
const sensorRoutes = require('./routes/deviceRoutes/device_api'); // ✅ Import InfluxDB sensor API
const patientRoutes = require('./routes/userRoutes/patient_api');
const deviceRoutes = require('./routes/deviceRoutes/deviceRegister'); // ✅ Import Device Register API


const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api', apiRoutes);
app.use('/api/appointment',appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/sensor-data", sensorRoutes); // ✅ Sensor Data API (InfluxDB)
app.use("/api/patients", patientRoutes); // ✅ Patient API
app.use('/api/device-register', deviceRoutes); // ✅ Device Register API


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
