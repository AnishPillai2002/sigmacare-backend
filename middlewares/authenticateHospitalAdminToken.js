const jwt = require('jsonwebtoken');

const authenticateHospitalAdminToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access Denied. No token provided.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token.' });

        req.admin = admin; // Attach the admin info to the request object
        next();
    });
};

module.exports = authenticateHospitalAdminToken;
