const bcrypt = require('bcryptjs');
const pool = require('../utils/db');
const jwt = require('jsonwebtoken');
const { generateToken, generateRefreshToken } = require('../utils/token');
const {invalidateToken} = require("../middleware/authMiddleware");

const signin = async (req, res) => {
    const { id, password } = req.body;

    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [id]);
    if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    await pool.query('UPDATE users SET refreshToken = ? WHERE id = ?', [refreshToken, user.id]);

    res.json({ token, refreshToken });
};

const signup = async (req, res) => {
    const { id, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [id, hashedPassword]);
    const newUser = { id: result.insertId, username: id };

    const token = generateToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    await pool.query('UPDATE users SET refreshToken = ? WHERE id = ?', [refreshToken, newUser.id]);

    res.json({ token, refreshToken });
};

const newToken = async (req, res) => {
    const { refreshToken } = req.body;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    invalidateToken(token)
    if (!refreshToken) return res.sendStatus(401);

    const [rows] = await pool.query('SELECT * FROM users WHERE refreshToken = ?', [refreshToken]);
    if (rows.length === 0) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        const newToken = generateToken(user);
        const newRefreshToken = generateRefreshToken(user);

        pool.query('UPDATE users SET refreshToken = ? WHERE id = ?', [newRefreshToken, user.id]);

        res.json({ token: newToken, refreshToken: newRefreshToken });
    });
};

const logout = async (req, res) => {
    const { id } = req.user;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    invalidateToken(token)
    await pool.query('UPDATE users SET refreshToken = NULL WHERE id = ?', [id]);

    res.sendStatus(204);
};

const testUser = async (req, res) => {
    res.json({ user: req.user });
}

module.exports = {
    signin,
    signup,
    newToken,
    logout,
    testUser
};
