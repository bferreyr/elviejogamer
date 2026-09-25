const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3003; // We use the same port PM2 is currently using

// Middleware
app.use(express.json());
app.use(express.static(__dirname)); // Serve all static files from root

// Ensure directories exist
const galleryPath = path.join(__dirname, 'assets', 'gallery');
const dataPath = path.join(__dirname, 'data');
if (!fs.existsSync(galleryPath)) fs.mkdirSync(galleryPath, { recursive: true });
if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath, { recursive: true });

const galleryJsonPath = path.join(dataPath, 'gallery.json');
if (!fs.existsSync(galleryJsonPath)) fs.writeFileSync(galleryJsonPath, '[]');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, galleryPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// API: Get gallery
app.get('/api/gallery', (req, res) => {
    try {
        const data = fs.readFileSync(galleryJsonPath, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Failed to read gallery data' });
    }
});

// API: Upload to gallery
app.post('/api/upload', upload.single('media'), (req, res) => {
    // Very basic password protection
    const password = req.headers['authorization'];
    if (password !== 'viejo123') { // Simple hardcoded password
        // Also delete the file if unauthorized
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const gallery = JSON.parse(fs.readFileSync(galleryJsonPath, 'utf8'));
        
        const newMedia = {
            id: Date.now(),
            filename: req.file.filename,
            type: req.file.mimetype.startsWith('video') ? 'video' : 'image',
            url: `assets/gallery/${req.file.filename}`,
            date: new Date().toISOString()
        };

        gallery.unshift(newMedia); // Add to beginning
        fs.writeFileSync(galleryJsonPath, JSON.stringify(gallery, null, 2));

        res.json({ success: true, media: newMedia });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save media data' });
    }
});

app.listen(PORT, () => {
    console.log(`El Viejo Gamer Server running on http://localhost:${PORT}`);
});
