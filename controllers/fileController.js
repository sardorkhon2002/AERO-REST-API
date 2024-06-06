const pool = require('../utils/db');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const uploadFile = async (req, res) => {
    try {
        upload.single('file')(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: 'File upload failed', error: err.message });
            } else if (err) {
                return res.status(500).json({ message: 'File upload failed', error: err.message });
            }
            const file = req.file;
            const { originalname, mimetype, size, filename } = file;

            await pool.query('INSERT INTO files (name, extension, mimeType, size, uploadDate, filename) VALUES (?, ?, ?, ?, NOW(), ?)', [
                originalname,
                path.extname(originalname),
                mimetype,
                size,
                filename
            ]);

            res.status(201).json({ message: 'File uploaded successfully' });

        });
    } catch (err) {
        res.status(500).json({ message: 'File upload failed', error: err.message });
    }
};

const listFiles = async (req, res) => {
    try {
        const listSize = parseInt(req.query.list_size) || 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * listSize;

        const [rows] = await pool.query('SELECT * FROM files LIMIT ? OFFSET ?', [listSize, offset]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve files', error: err.message });
    }
};

const getFile = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM files WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve file', error: err.message });
    }
};

const downloadFile = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM files WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'File not found' });
        }

        const file = rows[0];
        const filePath = path.join(__dirname, '../uploads/', file.filename);

        res.download(filePath, file.name);
    } catch (err) {
        res.status(500).json({ message: 'Failed to download file', error: err.message });
    }
};

const deleteFile = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM files WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'File not found' });
        }

        const file = rows[0];
        const filePath = path.join(__dirname, '../uploads/', file.filename);

        fs.unlinkSync(filePath);
        await pool.query('DELETE FROM files WHERE id = ?', [id]);

        res.json({ message: 'File deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete file', error: err.message });
    }
};

// Обновление файла
const updateFile = async (req, res) => {
    try {
        upload.single('file')(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: 'File upload failed', error: err.message });
            } else if (err) {
                return res.status(500).json({ message: 'File upload failed', error: err.message });
            }
            const { id } = req.params;
            const [rows] = await pool.query('SELECT * FROM files WHERE id = ?', [id]);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'File not found' });
            }

            const oldFile = rows[0];
            const oldFilePath = path.join(__dirname, '../uploads/', oldFile.filename);

            await fs.unlink(oldFilePath, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Failed to update file', error: err.message });
                }
            })

            const file = req.file;

            const { originalname, mimetype, size, filename } = file;

            await pool.query('UPDATE files SET name = ?, extension = ?, mimeType = ?, size = ?, uploadDate = NOW(), filename = ? WHERE id = ?', [
                originalname,
                path.extname(originalname),
                mimetype,
                size,
                filename,
                id
            ]);

            res.json({ message: 'File updated successfully' });

        })

    } catch (err) {
        res.status(500).json({ message: 'Failed to update file', error: err.message });
    }
};

module.exports = {
    upload,
    uploadFile,
    listFiles,
    getFile,
    downloadFile,
    deleteFile,
    updateFile
};
