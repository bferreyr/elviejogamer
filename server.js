require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3003;

// PostgreSQL Connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const frontendDistPath = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(frontendDistPath));

// Serve assets directory explicitly
const assetsPath = path.join(__dirname, 'assets');
app.use('/assets', express.static(assetsPath));

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 1 week
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.steam_id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE steam_id = $1', [id]);
        if (result.rows.length > 0) {
            done(null, result.rows[0]);
        } else {
            done(null, false);
        }
    } catch (err) {
        done(err, null);
    }
});

// Solo registrar la estrategia si hay un API KEY
if (process.env.STEAM_API_KEY && process.env.STEAM_API_KEY !== 'tu_steam_api_key') {
    passport.use(new SteamStrategy({
        returnURL: `${process.env.BASE_URL}/auth/steam/return`,
        realm: `${process.env.BASE_URL}/`,
        apiKey: process.env.STEAM_API_KEY
      },
      async (identifier, profile, done) => {
        try {
            const steamId = profile.id;
            const displayName = profile.displayName;
            const avatarUrl = profile.photos[2]?.value || profile.photos[0]?.value;
            const profileUrl = profile._json.profileurl;
    
            const result = await pool.query(
                `INSERT INTO users (steam_id, display_name, avatar_url, profile_url) 
                 VALUES ($1, $2, $3, $4) 
                 ON CONFLICT (steam_id) 
                 DO UPDATE SET display_name = $2, avatar_url = $3, profile_url = $4
                 RETURNING *`,
                [steamId, displayName, avatarUrl, profileUrl]
            );
    
            return done(null, result.rows[0]);
        } catch (err) {
            return done(err, null);
        }
      }
    ));
}

// --- Auth Routes ---
app.get('/auth/steam', passport.authenticate('steam', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/');
});

app.get('/auth/steam/return', passport.authenticate('steam', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/perfil.html');
});

app.get('/auth/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

app.get('/api/current_user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

// Ensure directories exist
const galleryPath = path.join(__dirname, 'assets', 'gallery');
if (!fs.existsSync(galleryPath)) fs.mkdirSync(galleryPath, { recursive: true });

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
app.get('/api/gallery', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM gallery_media ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to read gallery data' });
    }
});

// API: Upload to gallery
app.post('/api/upload', upload.single('media'), async (req, res) => {
    const password = req.headers['authorization'];
    if (password !== 'viejo123') { // Simple hardcoded password
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const filename = req.file.filename;
        const type = req.file.mimetype.startsWith('video') ? 'video' : 'image';
        const url = `assets/gallery/${filename}`;
        const uploaderSteamId = req.isAuthenticated() ? req.user.steam_id : null;

        const result = await pool.query(
            'INSERT INTO gallery_media (filename, type, url, uploader_steam_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [filename, type, url, uploaderSteamId]
        );

        res.json({ success: true, media: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save media data' });
    }
});

// API: Delete from gallery
app.delete('/api/gallery/:id', async (req, res) => {
    const password = req.headers['authorization'];
    if (password !== 'viejo123') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const id = parseInt(req.params.id);
        
        const result = await pool.query('SELECT * FROM gallery_media WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const item = result.rows[0];
        
        // Delete file
        const filePath = path.join(__dirname, item.url);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Remove from db
        await pool.query('DELETE FROM gallery_media WHERE id = $1', [id]);

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete media' });
    }
});

// React Router fallback (MUST BE THE LAST ROUTE)
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`El Viejo Gamer Server running on http://localhost:${PORT}`);
});
