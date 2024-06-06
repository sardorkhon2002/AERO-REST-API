const express = require('express');
const { signin, signup, newToken, logout, testUser } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/signin/new_token', authenticateToken, newToken);
router.get('/logout', authenticateToken, logout);
router.get('/user2', authenticateToken, testUser);

module.exports = router;
