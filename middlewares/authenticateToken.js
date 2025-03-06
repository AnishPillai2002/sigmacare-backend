const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({ error: 'Access Denied' });

        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Token missing' });

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ error: 'Invalid or expired token' });
            
            req.user = user; // Attach the decoded user to req
            next();
        });
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = authenticateToken;
