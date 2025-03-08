# SigmaCare Backend API Documentation

## 📋 Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Authentication](#authentication)
4. [Hospital Management](#hospital-management)
5. [Patient Management](#patient-management)
6. [Appointment Management](#appointment-management)
7. [Device Management](#device-management)
8. [Sensor Data Management](#sensor-data-management)

## 🚀 Introduction
SigmaCare Backend is a comprehensive healthcare management system that provides APIs for managing hospitals, patients, appointments, and IoT device data.

## 💻 Getting Started

### Prerequisites
- Node.js & npm
- MongoDB
- InfluxDB (for sensor data)

### Installation
1. Fork the repository

2. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sigmacare-backend.git
   cd sigmacare-backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Configure environment variables:
   Create a `.env` file with:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   INFLUX_URL=your_influxdb_url
   INFLUX_TOKEN=your_influxdb_token
   INFLUX_ORG=your_organization
   INFLUX_BUCKET=your_bucket
   INFLUX_MEASUREMENT=your_measurement
   ```

5. Start the server:
   ```bash
   npm start
   ```

## 🔐 Authentication

### Register User
```http
POST /api/users/register
```

**Request Body:**
```json
{
  "username": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "phone": "1234567890"
}
```

**Response:**
```json
{
  "message": "User registered successfully"
}
```

### Login User
```http
POST /api/users/login
```

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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🏥 Hospital Management

### Register Hospital Admin
```http
POST /api/admin/register
```

**Request Body:**
```json
{
  "email": "admin@hospital.com",
  "password": "securepassword",
  "hospital": {
    "name": "City Hospital",
    "email": "contact@cityhospital.com",
    "contact": "1234567890",
    "city": "New York",
    "state": "NY",
    "address": "123 Main St"
  }
}
```

**Response:**
```json
{
  "message": "Admin registered successfully, pending verification"
}
```

### Hospital Admin Login
```http
POST /api/admin/login
```

**Request Body:**
```json
{
  "email": "admin@hospital.com",
  "password": "securepassword",
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Add Doctor
```http
POST /api/admin/add-doctor
```

**Headers:**
```json
{
  "Authorization": "Bearer <admin_token>"
}
```

**Request Body:**
```json
{
  "name": "Antony Dasan",
  "specialization": "Radiology",
  "experience": 12,
  "contact": "9876543215"
}
```

**Response:**
```json
{
  "message": "Doctor added successfully",
  "doctor": {
    "_id": "603d9c7f8c4b2b0015b5e983",
    "name": "Antony Dasan",
    "hospitalId": "67cbd1719a63d26518afbf9e",
    "specialization": "Radiology",
    "experience": 12,
    "contact": "9876543215"
  }
}
```

### See All Doctors
```http
GET /api/admin/doctors
```

**Headers:**
```json
{
  "Authorization": "Bearer <admin_token>"
}
```

**Request Body:**
```json

```

**Response:**
```json
{
  "doctors": [
    {
      "_id": "67cbd40e2a018996de7e505e",
      "name": "Antony Dasan",
      "hospitalId": "67cbd1719a63d26518afbf9e",
      "specialization": "Cardiology",
      "experience": 12,
      "contact": "9876543215",
      "createdAt": "2025-03-08T05:22:22.535Z",
      "updatedAt": "2025-03-08T05:22:22.535Z",
      "__v": 0
    },
    {
      "_id": "67cbd38d2a018996de7e505c",
      "name": "Madhav Sigma",
      "hospitalId": "67cbd1719a63d26518afbf9e",
      "specialization": "Orthopedist",
      "experience": 6,
      "contact": "9876543213",
      "createdAt": "2025-03-08T05:20:13.986Z",
      "updatedAt": "2025-03-08T05:20:13.986Z",
      "__v": 0
    }
  ]
}
```

### Get Doctor Detail
```http
GET /api/admin/doctor/:doctorId
```

**Request Body:**
```json

```

**Response:**
```json
{
  "doctor": {
    "_id": "67cbd40e2a018996de7e505e",
    "name": "Antony Dasan",
    "hospitalId": "67cbd1719a63d26518afbf9e",
    "specialization": "Gynocology",
    "experience": 12,
    "contact": "9876543215",
    "createdAt": "2025-03-08T05:22:22.535Z",
    "updatedAt": "2025-03-08T05:22:22.535Z",
    "__v": 0
  }
}
```

### Update Doctor Detail
```http
PUT /api/admin/doctor/:doctorId
```

**Request Body:**
```json
{
  "name": "Antony Dasan",
  "specialization": "Radiology",
  "experience": 12,
  "contact": "9876543215"
}

```

**Response:**
```json
{
  "doctor": {
    "_id": "67cbd40e2a018996de7e505e",
    "name": "Antony Dasan",
    "hospitalId": "67cbd1719a63d26518afbf9e",
    "specialization": "Gynocology",
    "experience": 12,
    "contact": "9876543215",
    "createdAt": "2025-03-08T05:22:22.535Z",
    "updatedAt": "2025-03-08T05:22:22.535Z",
    "__v": 0
  }
}
```

### Add Doctor Schedule
```http
PUT /api/admin/create-schedule
```

**Request Body:**
```json
{
    "date": "2025-03-10",
    "doctorSlots": [
        {
            "doctorId": "67cbd30d586af44c6e387a37",
            "maxAppointments": 5
        },
        {
            "doctorId": "67cbd38d2a018996de7e505c",
            "maxAppointments": 5
        },
        {
            "doctorId": "67cbd40e2a018996de7e505e",
            "maxAppointments": 5
        }
    ]
}

```

**Response:**
```json
{
  "message": "Schedule created successfully",
  "schedule": {
    "hospitalId": "67cbd1719a63d26518afbf9e",
    "date": "2025-03-10",
    "doctorSlots": [
      {
        "doctorId": "67cbd30d586af44c6e387a37",
        "maxAppointments": 5,
        "_id": "67cbd9ea7e79a9ae7be974b2"
      },
      {
        "doctorId": "67cbd38d2a018996de7e505c",
        "maxAppointments": 5,
        "_id": "67cbd9ea7e79a9ae7be974b3"
      },
      {
        "doctorId": "67cbd40e2a018996de7e505e",
        "maxAppointments": 5,
        "_id": "67cbd9ea7e79a9ae7be974b4"
      }
    ],
    "_id": "67cbd9ea7e79a9ae7be974b1",
    "__v": 0
  }
}
```

### Update Doctor Schedule
```http
PUT /api/admin/update-schedule
```

**Request Body:**
```json
{
    "date": "2025-03-10",
    "doctorSlots": [
        {
            "doctorId": "67cbd30d586af44c6e387a37",
            "maxAppointments": 10
        },
        {
            "doctorId": "67cbd38d2a018996de7e505c",
            "maxAppointments": 5
        },
        {
            "doctorId": "67cbd40e2a018996de7e505e",
            "maxAppointments": 5
        }
    ]
}

```

**Response:**
```json
{
  "message": "Schedule updated successfully",
  "schedule": {
    "hospitalId": "67cbd1719a63d26518afbf9e",
    "date": "2025-03-10",
    "doctorSlots": [
      {
        "doctorId": "67cbd30d586af44c6e387a37",
        "maxAppointments": 10,
        "_id": "67cbd9ea7e79a9ae7be974b2"
      },
      {
        "doctorId": "67cbd38d2a018996de7e505c",
        "maxAppointments": 5,
        "_id": "67cbd9ea7e79a9ae7be974b3"
      },
      {
        "doctorId": "67cbd40e2a018996de7e505e",
        "maxAppointments": 5,
        "_id": "67cbd9ea7e79a9ae7be974b4"
      }
    ],
    "_id": "67cbd9ea7e79a9ae7be974b1",
    "__v": 0
  }
}
```

### Get Schedule of a Date
```http
GET /api/admin/get-schedule
```

**Request Body:**
```json
{
  "date": "2025-03-10"
}
```

**Response:**
```json
{
  "schedules": [
    {
      "_id": "67cbd9ea7e79a9ae7be974b1",
      "hospitalId": "67cbd1719a63d26518afbf9e",
      "date": "2025-03-10",
      "doctorSlots": [
        {
          "doctorId": "67cbd30d586af44c6e387a37",
          "maxAppointments": 10,
          "_id": "67cbdb3cd1538b1687c28c34"
        },
        {
          "doctorId": "67cbd38d2a018996de7e505c",
          "maxAppointments": 5,
          "_id": "67cbdb3cd1538b1687c28c35"
        },
        {
          "doctorId": "67cbd40e2a018996de7e505e",
          "maxAppointments": 5,
          "_id": "67cbdb3cd1538b1687c28c36"
        }
      ],
      "__v": 3
    }
  ]
}
```

### Get All Doctor Schedule 
```http
GET /api/admin/get-schedules
```

**Request Body:**
```json

```

**Response:**
```json
{
  "schedules": [
    {
      "_id": "67cbd9ea7e79a9ae7be974b1",
      "hospitalId": "67cbd1719a63d26518afbf9e",
      "date": "2025-03-10",
      "doctorSlots": [
        { "doctorId": "67cbd30d586af44c6e387a37", "maxAppointments": 10 },
        { "doctorId": "67cbd38d2a018996de7e505c", "maxAppointments": 5 },
        { "doctorId": "67cbd40e2a018996de7e505e", "maxAppointments": 5 }
      ]
    },
    {
      "_id": "67cbddafb96a2d94b84a9f70",
      "hospitalId": "67cbd1719a63d26518afbf9e",
      "date": "2025-03-11",
      "doctorSlots": [
        { "doctorId": "67cbd30d586af44c6e387a37", "maxAppointments": 5 },
        { "doctorId": "67cbd38d2a018996de7e505c", "maxAppointments": 5 },
        { "doctorId": "67cbd40e2a018996de7e505e", "maxAppointments": 5 }
      ]
    }
  ]
}

```


## 👨‍👩‍👦 Patient Management

### Add Patient
```http
POST /api/patients
```

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Request Body:**
```json
{
  "name": "John Doe",
  "age": 65,
  "medical_conditions": ["Diabetes", "Hypertension"],
  "device_id": "DEVICE123" // optional
}
```

**Response:**
```json
{
  "message": "Patient added successfully",
  "patient": {
    "_id": "65a3cfe2b2c56f0012f78c8e",
    "name": "John Doe",
    "age": 65,
    "medical_conditions": ["Diabetes", "Hypertension"],
    "device_id": "DEVICE123",
    "caretaker_id": "603d9c7f8c4b2b0015b5e984"
  }
}
```

### Get All Patients
```http
GET /api/patients
```

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response:**
```json
[
  {
    "_id": "65a3cfe2b2c56f0012f78c8e",
    "name": "John Doe",
    "age": 65,
    "medical_conditions": ["Diabetes"],
    "device_id": "DEVICE123"
  }
]
```

### Get Patient by ID
```http
GET /api/patients/:id
```

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response:**
```json
{
  "_id": "65a3cfe2b2c56f0012f78c8e",
  "name": "John Doe",
  "age": 65,
  "medical_conditions": ["Diabetes"],
  "device_id": "DEVICE123"
}
```

### Update Patient
```http
PUT /api/patients/:id
```

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Request Body:**
```json
{
  "name": "John Smith",
  "age": 68,
  "medical_conditions": ["Hypertension"],
  "device_id": "NEWDEVICE123"
}
```

**Response:**
```json
{
  "message": "Patient updated successfully",
  "patient": {
    "_id": "65a3cfe2b2c56f0012f78c8e",
    "name": "John Smith",
    "age": 68,
    "medical_conditions": ["Hypertension"],
    "device_id": "NEWDEVICE123"
  }
}
```

## 📅 Appointment Management

### Book Appointment
```http
POST /api/appointment
```

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Request Body:**
```json
{
  "hospitalId": "603d9c7f8c4b2b0015b5e982",
  "doctorId": "603d9c7f8c4b2b0015b5e983",
  "date": "2024-02-05T10:30:00.000Z"
}
```

**Response:**
```json
{
  "message": "Appointment booked successfully",
  "appointment": {
    "_id": "67a1c63584dca27d63166f7c",
    "userId": "67a1c2dddcabd418c7845259",
    "hospitalId": "603d9c7f8c4b2b0015b5e982",
    "doctorId": "603d9c7f8c4b2b0015b5e983",
    "date": "2024-02-05T10:30:00.000Z",
    "status": "Pending"
  }
}
```

### Get User's Appointments
```http
GET /api/appointment
```

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response:**
```json
{
  "appointments": [
    {
      "_id": "67a1c63584dca27d63166f7c",
      "userId": "67a1c2dddcabd418c7845259",
      "hospitalId": "603d9c7f8c4b2b0015b5e982",
      "doctorId": "603d9c7f8c4b2b0015b5e983",
      "date": "2024-02-05T10:30:00.000Z",
      "status": "Pending"
    }
  ]
}
```

### Get Appointment by ID
```http
GET /api/appointment/:id
```

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response:**
```json
{
  "appointment": {
    "_id": "67a1c63584dca27d63166f7c",
    "userId": "67a1c2dddcabd418c7845259",
    "hospitalId": "603d9c7f8c4b2b0015b5e982",
    "doctorId": "603d9c7f8c4b2b0015b5e983",
    "date": "2024-02-05T10:30:00.000Z",
    "status": "Pending"
  }
}
```

### Update Appointment
```http
PUT /api/appointment/:id
```

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Request Body:**
```json
{
  "date": "2024-04-01T10:30:00.000Z"
}
```

**Response:**
```json
{
  "message": "Appointment updated successfully",
  "appointment": {
    "_id": "67a1c63584dca27d63166f7c",
    "userId": "67a1c2dddcabd418c7845259",
    "hospitalId": "603d9c7f8c4b2b0015b5e982",
    "doctorId": "603d9c7f8c4b2b0015b5e983",
    "date": "2024-04-01T10:30:00.000Z",
    "status": "Pending"
  }
}
```

### Delete Appointment
```http
DELETE /api/appointment/:id
```

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Response:**
```json
{
  "message": "Appointment deleted successfully"
}
```

### Get Slots Available in a Hospital
```http
POST /api/appointments/get-schedules
```

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Request Body:**
```json
{
  "hospitalId": "3hdhdh3h333"
}
```


**Response:**
```json
{
  "schedules": [
    {
      "_id": "67cbd9ea7e79a9ae7be974b1",
      "hospitalId": "67cbd1719a63d26518afbf9e",
      "date": "2025-03-10",
      "doctorSlots": [
        {
          "doctorId": "67cbd30d586af44c6e387a37",
          "maxAppointments": 10,
          "_id": "67cbdb3cd1538b1687c28c34"
        },
        {
          "doctorId": "67cbd40e2a018996de7e505e",
          "maxAppointments": 5,
          "_id": "67cbdb3cd1538b1687c28c36"
        }
      ],
      "__v": 3
    },
    {
      "_id": "67cbddafb96a2d94b84a9f70",
      "hospitalId": "67cbd1719a63d26518afbf9e",
      "date": "2025-03-11",
      "doctorSlots": [
        {
          "doctorId": "67cbd30d586af44c6e387a37",
          "maxAppointments": 5,
          "_id": "67cbddafb96a2d94b84a9f71"
        },
        {
          "doctorId": "67cbd40e2a018996de7e505e",
          "maxAppointments": 5,
          "_id": "67cbddafb96a2d94b84a9f73"
        }
      ],
      "__v": 0
    }
  ]
}
```


## 📱 Device Management

### Register Device
```http
POST /api/device-register
```

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Request Body:**
```json
{
  "device_code": "DEVICE123",
  "device_secret": "secret_key_here"
}
```

**Response:**
```json
{
  "message": "Device registered successfully",
  "device": {
    "device_code": "DEVICE123",
    "isRegistered": true,
    "caretaker_id": "603d9c7f8c4b2b0015b5e984"
  }
}
```

## 📊 Sensor Data Management

### Store Sensor Data
```http
POST /api/sensor-data
```

**Headers:**
```json
{
  "device_code": "DEVICE123"
}
```

**Request Body:**
```json
{
  "device_code": "DEVICE123",
  "accelX": 0.5,
  "accelY": -0.2,
  "accelZ": 9.8,
  "gyroX": 0.1,
  "gyroY": 0.2,
  "gyroZ": -0.1
}
```

**Response:**
```json
{
  "message": "Sensor data stored successfully"
}
```

### Get Sensor Data
```http
GET /api/sensor-data/:deviceId
```

**Headers:**
```json
{
  "device_code": "DEVICE123"
}
```

**Response:**
```json
[
  {
    "_time": "2024-02-04T10:00:00Z",
    "_value": 0.5,
    "deviceId": "DEVICE123",
    "_field": "accelX"
  },
  {
    "_time": "2024-02-04T10:00:00Z",
    "_value": -0.2,
    "deviceId": "DEVICE123",
    "_field": "accelY"
  }
]
```

## 🔒 Security
- All endpoints (except registration and login) require authentication
- JWT tokens are used for authentication
- Passwords are hashed using bcrypt
- Device authentication is required for sensor data endpoints

## 📝 Error Handling
All endpoints return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## 📚 Models

### User
- username (String, required)
- email (String, required, unique)
- password (String, required)
- phone (String, required)

### Hospital
- name (String, required)
- email (String, required)
- contact (String, required)
- city (String, required)
- state (String, required)
- address (String, required)

### Doctor
- name (String, required)
- hospitalId (String, required)
- specialization (String, required)
- experience (Number)
- contact (String)

### Patient
- name (String, required)
- age (Number, required)
- caretaker_id (ObjectId, required)
- medical_conditions (Array of Strings)
- device_id (String)

### Appointment
- userId (ObjectId, required)
- hospitalId (String, required)
- doctorId (String, required)
- date (Date, required)
- status (String, enum: ['Pending', 'Confirmed', 'Cancelled'])

### Device
- device_name (String, required)
- device_code (String, required, unique)
- device_secret (String, required, unique)
- caretaker_id (ObjectId)
- isRegistered (Boolean)

## 🤝 Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Create a Pull Request

## 📄 License
This project is licensed under the MIT License.

## 📞 Contact
For any queries or support, please contact:
- Email: anishpillai2002@gmail.com
- GitHub: [Your GitHub Profile](https://github.com/AnishPillai2002)

