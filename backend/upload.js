const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('./db'); // your DB connection

const router = express.Router();

const fs = require('fs');

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueName = 'user-' + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Endpoint: POST /api/upload-photo
router.post('/upload-photo', upload.single('profilePhoto'), (req, res) => {
  const userId = req.body.id;
  const photoPath = `/uploads/${req.file.filename}`;

  // Save to DB
  db.query(
    'UPDATE users SET profilePhoto = ? WHERE id = ?',
    [photoPath, userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'DB update failed' });
      }
      res.status(200).json({ message: 'Photo updated', profilePhoto: photoPath });
    }
  );
});

module.exports = router;
