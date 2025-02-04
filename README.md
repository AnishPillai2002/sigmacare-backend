# Healthcare Management System

## Overview
The **Healthcare Management System** is a web-based application designed to manage hospital operations efficiently. It includes user and hospital login systems, patient records, appointment scheduling, and more. The backend is powered by **Node.js, Express, and MongoDB**.

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
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['patient', 'admin'], required: true },
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
```

### 2. Hospital Admin Schema
```javascript
const HospitalAdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
    isVerified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('HospitalAdmin', HospitalAdminSchema);
```

---

## API Endpoints

### Authentication

#### 1. Register a New User
**Endpoint:** `POST /api/auth/register`
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "patient"
}
```
**Response:**
```json
{
  "message": "User registered successfully"
}
```

#### 2. Login User
**Endpoint:** `POST /api/auth/login`
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

### Hospital Management

#### 3. Register a New Hospital Admin
**Endpoint:** `POST /api/hospital/register`
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

#### 4. Hospital Admin Login
**Endpoint:** `POST /api/hospital/login`
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

