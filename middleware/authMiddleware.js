const jwt = require('jsonwebtoken');
const invalidTokens = new Set();
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);
    if (invalidTokens.has(token)) return res.sendStatus(403);


    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const invalidateToken = (token) => {
    invalidTokens.add(token);
}

module.exports = { authenticateToken, invalidateToken };
