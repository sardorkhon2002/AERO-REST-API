const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { uploadFile, listFiles, getFile, downloadFile, deleteFile, updateFile } = require('../controllers/fileController');

const router = express.Router();

router.post('/upload', authenticateToken, uploadFile);
router.get('/list', authenticateToken, listFiles);
router.get('/:id', authenticateToken, getFile);
router.get('/download/:id', authenticateToken, downloadFile);
router.delete('/delete/:id', authenticateToken, deleteFile);
router.put('/update/:id', authenticateToken, updateFile);

module.exports = router;
