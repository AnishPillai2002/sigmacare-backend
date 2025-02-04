# SigmaCare Health Management System

## Overview
The **SigmaCare Healthcare Management System** is a web-based application designed to manage hospital operations efficiently. It includes user and hospital login systems, patient records, appointment scheduling, and more. The backend is powered by **Node.js, Express, and MongoDB**.

## Features
- **User Authentication** (Patients & Hospital Admins)
- **Secure JWT-based Login System**
- **Hospital & Patient Management**
- **MongoDB Database Integration**
- **API Endpoints for CRUD Operations**

## Technologies Used
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens) & Bcrypt.js for password hashing
- **API Testing:** Postman

---

## Database Schema

### 1. User Schema
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
}, { timestamps: true });

// Password hashing before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', UserSchema);

```

### 2. Hospital Admin Schema
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const HospitalAdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
    isVerified: { type: Boolean, default: false }, // Verification status field
}, { timestamps: true });

// Hash password before saving
HospitalAdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Prevent rehashing
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


// Method to check if password is correct
HospitalAdminSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('HospitalAdmin', HospitalAdminSchema);
```

### 3. Hospital Schema
```javascript
const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String, required:true },
}, { timestamps: true });

module.exports = mongoose.model('Hospital', HospitalSchema);

```

### 5. Doctor Schema
```javascript
const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    hospitalId: { type: String, required: true },  // store hospitalId as a string
    specialization: { type: String, required: true },
    experience: { type: Number },
    contact: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);
```

### 5. Appointment Schema
```javascript
const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Changed to ObjectId
    hospitalId: { type: String, required: true },
    doctorId: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);

```
---

## API Endpoints

### Authentication

#### 1. Register a New User
**Endpoint:** `POST /api/user/register`
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "phone": "number"
}
```
**Response:**
```json
{
  "message": "User registered successfully"
}
```

#### 2. Login User
**Endpoint:** `POST /api/user/login`
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```
**Response:**
```json
{
  "token": "jwt-token-here"
}
```

#### 3. Get All Hospitals
**Endpoint:** `GET /api/hospitals`
**Request Body:**
```json

```
**Response:**
```json
[
  {
    "_id": "678e29f172a92cc11e42d238",
    "name": "City Health Hospital",
    "email": "contact@cityhealth.com",
    "contact": "1234567890",
    "city": "New York",
    "state": "NY",
    "address": "123 Main St, New York, NY 10001"
  },
  {
    "_id": "678e2a0572a92cc11e42d239",
    "name": "Metro Medical Center",
    "email": "info@metromedical.com",
    "contact": "0987654321",
    "city": "Los Angeles",
    "state": "CA",
    "address": "456 Elm St, Los Angeles, CA 90001"
  },
]
```

#### 4. Get All Doctors in a Hospitals
**Endpoint:** `GET /api/hospitals/:hospitalId/doctors`
**Request Body:**
```json

```
**Response:**
```json
[
  {
    "_id": "678e2aa672a92cc11e42d23c",
    "name": "Dr. Robert Smith",
    "hospitalId": "678e29f172a92cc11e42d238",
    "specialization": "Neurology",
    "experience": 8,
    "contact": "0987654321"
  }
]
```

#### 5. Book an Appointment
**Endpoint:** `POST /api/appointment/`
**Request Body:**
```json
{
  "hospitalId": "678e2a0572a92cc11e42d239",
  "doctorId": "678e2a8372a92cc11e42d23b",
  "date": "2024-02-05T10:30:00.000Z"
}

```
**Response:**
```json
{
  "message": "Appointment booked successfully",
  "appointment": {
    "userId": "67a1c2dddcabd418c7845259",
    "hospitalId": "678e2a0572a92cc11e42d239",
    "doctorId": "678e2a8372a92cc11e42d23b",
    "date": "2024-02-05T10:30:00.000Z",
    "status": "Pending",
    "_id": "67a1c63584dca27d63166f7c",
    "createdAt": "2025-02-04T07:48:05.400Z",
    "updatedAt": "2025-02-04T07:48:05.400Z",
    "__v": 0
  }
}
```

#### 6. Get all the appointments made by the user
**Endpoint:** `GET /api/appointment/`
**Request Body:**
```json

```
**Response:**
```json
{
  "appointments": [
    {
      "_id": "67a1c63584dca27d63166f7c",
      "userId": "67a1c2dddcabd418c7845259",
      "hospitalId": "678e2a0572a92cc11e42d239",
      "doctorId": "678e2a8372a92cc11e42d23b",
      "date": "2024-02-05T10:30:00.000Z",
      "status": "Pending",
      "createdAt": "2025-02-04T07:48:05.400Z",
      "updatedAt": "2025-02-04T07:48:05.400Z",
      "__v": 0
    }
  ]
}
```

#### 6. Get a single appointment made by the user
**Endpoint:** `GET /api/appointment/:id`
**Request Body:**
```json

```
**Response:**
```json
{
  "appointment": {
    "_id": "67a1c63584dca27d63166f7c",
    "userId": "67a1c2dddcabd418c7845259",
    "hospitalId": "678e2a0572a92cc11e42d239",
    "doctorId": "678e2a8372a92cc11e42d23b",
    "date": "2024-02-05T10:30:00.000Z",
    "status": "Pending",
    "createdAt": "2025-02-04T07:48:05.400Z",
    "updatedAt": "2025-02-04T07:48:05.400Z",
    "__v": 0
  }
}
```

#### 6. Delete an appointment made by the user
**Endpoint:** `DELETE /api/appointment/:id`
**Request Body:**
```json

```
**Response:**
```json
{
  "message": "Appointment deleted successfully."
}
```

#### 6. Update an appointment made by the user
**Endpoint:** `PUT /api/appointment/:id`
**Request Body:**
```json
{
  "hospitalId": "678e2a0572a92cc11e42d239",
  "doctorId": "678e2a8372a92cc11e42d23b",
  "date": "2024-04-01T10:30:00.000Z"
}
```
**Response:**
```json
{
  "message": "Appointment updated successfully.",
  "appointment": {
    "_id": "67a1c63584dca27d63166f7c",
    "userId": "67a1c2dddcabd418c7845259",
    "hospitalId": "678e2a0572a92cc11e42d239",
    "doctorId": "678e2a8372a92cc11e42d23b",
    "date": "2024-04-01T10:30:00.000Z",
    "status": "Pending",
    "createdAt": "2025-02-04T07:48:05.400Z",
    "updatedAt": "2025-02-04T07:53:52.040Z",
    "__v": 0
  }
}
```

### Hospital Management

#### 7. Register a New Hospital Admin
**Endpoint:** `POST /api/admin/register`
**Request Body:**
```json
{
  "email": "admin@hospital.com",
  "password": "securepassword",
  "hospital": {
    "name": "City Hospital",
    "location": "New York"
  }
}
```
**Response:**
```json
{
  "message": "Admin registered successfully, pending verification"
}
```

#### 8. Hospital Admin Login
**Endpoint:** `POST /api/admin/login`
**Request Body:**
```json
{
  "email": "admin@hospital.com",
  "password": "securepassword",
  "hospitalId": "603d9c7f8c4b2b0015b5e982"
}
```
**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token-here"
}
```

---

## Installation
### Prerequisites
- Node.js & npm
- MongoDB installed and running

### Setup Instructions
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/healthcare-management.git
   cd healthcare-management
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and configure:
   ```sh
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
4. Start the server:
   ```sh
   npm start
   ```

---

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a Pull Request

---

## License
This project is licensed under the **MIT License**.

---

## Contact
For any queries, reach out at [your-email@example.com](mailto:your-email@example.com).

