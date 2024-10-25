
// server.js (Backend in Node.js)
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Init multer upload
const upload = multer({
    storage: storage,
}).array('files', 10); // Maximum 10 files at once

// Serve the public folder as static
app.use(express.static('public'));

// API route to handle file uploads
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: 'File upload failed.' });
        }
        res.status(200).json({ message: 'File uploaded successfully.' });
    });
});

// Start server
app.listen(5000, () => {
    console.log('Server started on http://localhost:5000');
});
