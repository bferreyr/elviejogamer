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
    res.redirect('/perfil');
});

app.get('/auth/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

app.get('/api/current_user', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const statsResult = await pool.query(`
                SELECT
                    SUM((player->>'kills')::int) as total_kills,
                    SUM((player->>'deaths')::int) as total_deaths,
                    SUM((player->>'assists')::int) as total_assists,
                    SUM((player->>'headshots')::int) as total_headshots,
                    SUM((player->>'mvps')::int) as total_mvps,
                    SUM((player->>'damage')::int) as total_damage,
                    COUNT(m.id) as matches_played
                FROM matches m, jsonb_array_elements(m.stats) as player
                WHERE player->>'steam_id' = $1
            `, [req.user.steam_id]);

            const aggr = statsResult.rows[0];
            let kd_ratio = 0;
            let hs_percent = 0;
            let total_kills = parseInt(aggr.total_kills || 0);
            let total_deaths = parseInt(aggr.total_deaths || 0);
            let total_headshots = parseInt(aggr.total_headshots || 0);
            
            if (total_deaths > 0) kd_ratio = total_kills / total_deaths;
            else if (total_kills > 0) kd_ratio = total_kills;
            
            if (total_kills > 0) hs_percent = (total_headshots / total_kills) * 100;

            // Fetch recent matches
            const recentMatchesResult = await pool.query(`
                SELECT m.id, m.map_name, m.team_ct_score, m.team_t_score, m.match_date, player
                FROM matches m, jsonb_array_elements(m.stats) as player
                WHERE player->>'steam_id' = $1
                ORDER BY m.match_date DESC
                LIMIT 30
            `, [req.user.steam_id]);

            const recentMatches = recentMatchesResult.rows;

            // Calculate win rate
            let wins = 0;
            recentMatches.forEach(rm => {
                const pTeam = rm.player.team;
                if (pTeam === 'CT' && rm.team_ct_score > rm.team_t_score) wins++;
                if (pTeam === 'T' && rm.team_t_score > rm.team_ct_score) wins++;
            });
            const win_rate = recentMatches.length > 0 ? (wins / recentMatches.length) * 100 : 0;

            const extendedUser = {
                ...req.user,
                cs2_stats: {
                    total_kills,
                    total_deaths,
                    total_assists: parseInt(aggr.total_assists || 0),
                    total_headshots,
                    total_mvps: parseInt(aggr.total_mvps || 0),
                    total_damage: parseInt(aggr.total_damage || 0),
                    matches_played: parseInt(aggr.matches_played || 0),
                    kd_ratio,
                    hs_percent,
                    win_rate
                },
                recent_matches: recentMatches.map(rm => {
                    const kr = (rm.team_ct_score + rm.team_t_score) > 0 ? (rm.player.kills / (rm.team_ct_score + rm.team_t_score)) : 0;
                    const kd = rm.player.deaths > 0 ? (rm.player.kills / rm.player.deaths) : rm.player.kills;
                    const rating = rm.player.rating || (kd * 0.7 + kr * 0.3).toFixed(2);
                    
                    let won = false;
                    if (rm.player.team === 'CT' && rm.team_ct_score > rm.team_t_score) won = true;
                    if (rm.player.team === 'T' && rm.team_t_score > rm.team_ct_score) won = true;

                    return {
                        id: rm.id,
                        map_name: rm.map_name,
                        date: rm.match_date,
                        score_ct: rm.team_ct_score,
                        score_t: rm.team_t_score,
                        won: won,
                        player_team: rm.player.team,
                        kills: rm.player.kills,
                        deaths: rm.player.deaths,
                        assists: rm.player.assists,
                        rating: parseFloat(rating).toFixed(2)
                    };
                })
            };
            res.json(extendedUser);
        } catch (error) {
            console.error('Error fetching user stats:', error);
            res.json(req.user);
        }
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

// Helper function to calculate user stats (to reuse for any user)
async function calculateUserStats(steam_id) {
    const statsResult = await pool.query(`
        SELECT
            SUM((player->>'kills')::int) as total_kills,
            SUM((player->>'deaths')::int) as total_deaths,
            SUM((player->>'assists')::int) as total_assists,
            SUM((player->>'headshots')::int) as total_headshots,
            SUM((player->>'mvps')::int) as total_mvps,
            SUM((player->>'damage')::int) as total_damage,
            COUNT(m.id) as matches_played
        FROM matches m, jsonb_array_elements(m.stats) as player
        WHERE player->>'steam_id' = $1
    `, [steam_id]);

    const aggr = statsResult.rows[0];
    let kd_ratio = 0;
    let hs_percent = 0;
    let total_kills = parseInt(aggr.total_kills || 0);
    let total_deaths = parseInt(aggr.total_deaths || 0);
    let total_headshots = parseInt(aggr.total_headshots || 0);
    
    if (total_deaths > 0) kd_ratio = total_kills / total_deaths;
    else if (total_kills > 0) kd_ratio = total_kills;
    
    if (total_kills > 0) hs_percent = (total_headshots / total_kills) * 100;

    const recentMatchesResult = await pool.query(`
        SELECT m.id, m.map_name, m.team_ct_score, m.team_t_score, m.match_date, player
        FROM matches m, jsonb_array_elements(m.stats) as player
        WHERE player->>'steam_id' = $1
        ORDER BY m.match_date DESC
        LIMIT 30
    `, [steam_id]);

    const recentMatches = recentMatchesResult.rows;
    let wins = 0;
    recentMatches.forEach(rm => {
        const pTeam = rm.player.team;
        if (pTeam === 'CT' && rm.team_ct_score > rm.team_t_score) wins++;
        if (pTeam === 'T' && rm.team_t_score > rm.team_ct_score) wins++;
    });
    const win_rate = recentMatches.length > 0 ? (wins / recentMatches.length) * 100 : 0;

    return {
        cs2_stats: {
            total_kills,
            total_deaths,
            total_assists: parseInt(aggr.total_assists || 0),
            total_headshots,
            total_mvps: parseInt(aggr.total_mvps || 0),
            total_damage: parseInt(aggr.total_damage || 0),
            matches_played: parseInt(aggr.matches_played || 0),
            kd_ratio,
            hs_percent,
            win_rate
        },
        recent_matches: recentMatches.map(rm => {
            const kr = (rm.team_ct_score + rm.team_t_score) > 0 ? (rm.player.kills / (rm.team_ct_score + rm.team_t_score)) : 0;
            const kd = rm.player.deaths > 0 ? (rm.player.kills / rm.player.deaths) : rm.player.kills;
            const rating = rm.player.rating || (kd * 0.7 + kr * 0.3).toFixed(2);
            let won = false;
            if (rm.player.team === 'CT' && rm.team_ct_score > rm.team_t_score) won = true;
            if (rm.player.team === 'T' && rm.team_t_score > rm.team_ct_score) won = true;

            return {
                id: rm.id,
                map_name: rm.map_name,
                date: rm.match_date,
                score_ct: rm.team_ct_score,
                score_t: rm.team_t_score,
                won: won,
                player_team: rm.player.team,
                kills: rm.player.kills,
                deaths: rm.player.deaths,
                assists: rm.player.assists,
                rating: parseFloat(rating).toFixed(2)
            };
        })
    };
}

// API: Search users
app.get('/api/users/search', async (req, res) => {
    const query = req.query.q || '';
    try {
        const result = await pool.query(`
            SELECT id, steam_id, display_name, avatar_url 
            FROM users 
            WHERE display_name ILIKE $1 
            ORDER BY display_name ASC 
            LIMIT 50
        `, [`%${query}%`]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({error: 'Error searching users'});
    }
});

// API: Get specific user profile
app.get('/api/users/:steam_id', async (req, res) => {
    try {
        const userResult = await pool.query('SELECT id, steam_id, display_name, avatar_url, profile_url, is_admin FROM users WHERE steam_id = $1', [req.params.steam_id]);
        if (userResult.rows.length === 0) return res.status(404).json({error: 'Usuario no encontrado'});
        
        const userObj = userResult.rows[0];
        const stats = await calculateUserStats(userObj.steam_id);
        
        // Include friend status if logged in
        if (req.isAuthenticated()) {
            const friendQuery = await pool.query(`
                SELECT status, user_id1, user_id2 FROM friends 
                WHERE (user_id1 = $1 AND user_id2 = $2) OR (user_id1 = $2 AND user_id2 = $1)
            `, [req.user.id, userObj.id]);
            
            if (friendQuery.rows.length > 0) {
                userObj.friend_status = friendQuery.rows[0].status;
                // 'pending_sent' if current user sent it, 'pending_received' if the other user sent it
                if (userObj.friend_status === 'pending') {
                    userObj.friend_status = friendQuery.rows[0].user_id1 === req.user.id ? 'pending_sent' : 'pending_received';
                }
            } else {
                userObj.friend_status = 'none';
            }
        }
        
        res.json({ ...userObj, ...stats });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({error: 'Error de servidor'});
    }
});

// API: Friend requests
app.post('/api/friends/add/:steam_id', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({error: 'Not authenticated'});
    try {
        const targetResult = await pool.query('SELECT id FROM users WHERE steam_id = $1', [req.params.steam_id]);
        if (targetResult.rows.length === 0) return res.status(404).json({error: 'Usuario no encontrado'});
        const targetId = targetResult.rows[0].id;
        
        if (targetId === req.user.id) return res.status(400).json({error: 'No te podés agregar a vos mismo'});

        // Check if already exists
        const exists = await pool.query('SELECT * FROM friends WHERE (user_id1 = $1 AND user_id2 = $2) OR (user_id1 = $2 AND user_id2 = $1)', [req.user.id, targetId]);
        if (exists.rows.length > 0) return res.status(400).json({error: 'Ya existe una solicitud o son amigos'});

        await pool.query('INSERT INTO friends (user_id1, user_id2, status) VALUES ($1, $2, $3)', [req.user.id, targetId, 'pending']);
        res.json({success: true, status: 'pending_sent'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error interno'});
    }
});

app.post('/api/friends/accept/:steam_id', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({error: 'Not authenticated'});
    try {
        const targetResult = await pool.query('SELECT id FROM users WHERE steam_id = $1', [req.params.steam_id]);
        if (targetResult.rows.length === 0) return res.status(404).json({error: 'Usuario no encontrado'});
        const targetId = targetResult.rows[0].id;

        // user_id2 must be req.user.id since they are the one receiving the request
        await pool.query('UPDATE friends SET status = $1 WHERE user_id1 = $2 AND user_id2 = $3', ['accepted', targetId, req.user.id]);
        res.json({success: true});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error interno'});
    }
});

app.get('/api/friends', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({error: 'Not authenticated'});
    try {
        // Pending requests received
        const pending = await pool.query(`
            SELECT u.steam_id, u.display_name, u.avatar_url 
            FROM friends f
            JOIN users u ON u.id = f.user_id1
            WHERE f.user_id2 = $1 AND f.status = 'pending'
        `, [req.user.id]);

        // Friends
        const friends = await pool.query(`
            SELECT u.steam_id, u.display_name, u.avatar_url 
            FROM friends f
            JOIN users u ON (u.id = f.user_id1 OR u.id = f.user_id2)
            WHERE (f.user_id1 = $1 OR f.user_id2 = $1) AND f.status = 'accepted' AND u.id != $1
        `, [req.user.id]);

        res.json({ pending: pending.rows, friends: friends.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error interno'});
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

// --- Admin Middleware ---
const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.is_admin) {
        return next();
    }
    return res.status(403).json({ error: 'Acceso denegado: Se requieren permisos de administrador' });
};

// --- User Management API ---
app.get('/api/users', isAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, steam_id, display_name, avatar_url, is_admin FROM users ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.put('/api/users/:id/admin', isAdmin, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { is_admin } = req.body;
        
        await pool.query('UPDATE users SET is_admin = $1 WHERE id = $2', [is_admin, id]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user role' });
    }
});

// ==========================================
// --- TOURNAMENT REGISTRATIONS API ---
// ==========================================
const tournamentUploadsPath = path.join(__dirname, 'assets', 'tournaments');
if (!fs.existsSync(tournamentUploadsPath)) fs.mkdirSync(tournamentUploadsPath, { recursive: true });

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const tournamentJsonFile = path.join(dataDir, 'tournament_registrations.json');

const getLocalRegistrations = () => {
    if (!fs.existsSync(tournamentJsonFile)) return [];
    try {
        return JSON.parse(fs.readFileSync(tournamentJsonFile, 'utf8'));
    } catch (e) {
        return [];
    }
};

const saveLocalRegistrations = (list) => {
    try {
        fs.writeFileSync(tournamentJsonFile, JSON.stringify(list, null, 2), 'utf8');
    } catch (e) {
        console.error('Error saving local registrations:', e);
    }
};

// Database table initialization for tournament
const initTournamentDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tournament_registrations (
                id SERIAL PRIMARY KEY,
                team_name VARCHAR(255) NOT NULL,
                team_tag VARCHAR(50) NOT NULL,
                origin_city VARCHAR(255) NOT NULL,
                instagram VARCHAR(255),
                logo_url TEXT,
                captain_name VARCHAR(255) NOT NULL,
                captain_nick VARCHAR(255) NOT NULL,
                captain_phone VARCHAR(100) NOT NULL,
                captain_email VARCHAR(255),
                captain_steam VARCHAR(500) NOT NULL,
                captain_faceit VARCHAR(500) NOT NULL,
                captain_discord VARCHAR(255),
                roster JSONB NOT NULL,
                has_substitutes VARCHAR(50) NOT NULL,
                substitutes JSONB,
                can_attend_lan VARCHAR(10) NOT NULL,
                travel_from VARCHAR(255) NOT NULL,
                payment_holder_name VARCHAR(255) NOT NULL,
                payment_receipt_url TEXT NOT NULL,
                payment_amount VARCHAR(50) DEFAULT 'AR$ 150.000',
                payment_method VARCHAR(50) DEFAULT 'TRANSFERENCIA',
                status VARCHAR(50) DEFAULT 'pendiente',
                accepted_rules BOOLEAN DEFAULT false,
                accepted_identity BOOLEAN DEFAULT false,
                accepted_fairplay BOOLEAN DEFAULT false,
                accepted_commitment BOOLEAN DEFAULT false,
                accepted_data_public BOOLEAN DEFAULT false,
                accepted_image_promo VARCHAR(50),
                comments TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Tournament database tables ready.');
    } catch (err) {
        console.warn('Note: PostgreSQL tournament_registrations table setup skipped or offline (JSON backup active):', err.message);
    }
};
initTournamentDb();

// Multer storage for tournament logo and payment receipt
const tournamentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tournamentUploadsPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const prefix = file.fieldname === 'logo' ? 'logo' : 'comprobante';
        cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const uploadTournament = multer({
    storage: tournamentStorage,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
    fileFilter: (req, file, cb) => {
        const allowedExts = ['.png', '.jpg', '.jpeg', '.pdf', '.webp'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedExts.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Formato de archivo no soportado. Se permiten PNG, JPG, JPEG o PDF.'));
        }
    }
});

// Public: Submit tournament registration
app.post('/api/tournament/register', uploadTournament.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'receipt', maxCount: 1 }
]), async (req, res) => {
    try {
        const body = req.body;
        const logoFile = req.files && req.files.logo ? req.files.logo[0] : null;
        const receiptFile = req.files && req.files.receipt ? req.files.receipt[0] : null;

        if (!receiptFile) {
            return res.status(400).json({ error: 'El comprobante de pago es obligatorio.' });
        }

        const logo_url = logoFile ? `/assets/tournaments/${logoFile.filename}` : null;
        const payment_receipt_url = `/assets/tournaments/${receiptFile.filename}`;

        let roster = [];
        try {
            roster = typeof body.roster === 'string' ? JSON.parse(body.roster) : body.roster || [];
        } catch (e) {
            roster = [];
        }

        let substitutes = [];
        try {
            substitutes = typeof body.substitutes === 'string' ? JSON.parse(body.substitutes) : body.substitutes || [];
        } catch (e) {
            substitutes = [];
        }

        const registrationData = {
            team_name: body.team_name || '',
            team_tag: body.team_tag || '',
            origin_city: body.origin_city || '',
            instagram: body.instagram || null,
            logo_url,
            captain_name: body.captain_name || '',
            captain_nick: body.captain_nick || '',
            captain_phone: body.captain_phone || '',
            captain_email: body.captain_email || null,
            captain_steam: body.captain_steam || '',
            captain_faceit: body.captain_faceit || '',
            captain_discord: body.captain_discord || null,
            roster,
            has_substitutes: body.has_substitutes || 'No',
            substitutes,
            can_attend_lan: body.can_attend_lan || 'Sí',
            travel_from: body.travel_from || '',
            payment_holder_name: body.payment_holder_name || '',
            payment_receipt_url,
            payment_amount: 'AR$ 150.000',
            payment_method: 'TRANSFERENCIA',
            status: 'pendiente',
            accepted_rules: body.accepted_rules === 'true' || body.accepted_rules === true,
            accepted_identity: body.accepted_identity === 'true' || body.accepted_identity === true,
            accepted_fairplay: body.accepted_fairplay === 'true' || body.accepted_fairplay === true,
            accepted_commitment: body.accepted_commitment === 'true' || body.accepted_commitment === true,
            accepted_data_public: body.accepted_data_public === 'true' || body.accepted_data_public === true,
            accepted_image_promo: body.accepted_image_promo || 'Autorizo',
            comments: body.comments || null,
            created_at: new Date().toISOString()
        };

        let insertedId = null;
        try {
            const query = `
                INSERT INTO tournament_registrations (
                    team_name, team_tag, origin_city, instagram, logo_url,
                    captain_name, captain_nick, captain_phone, captain_email, captain_steam, captain_faceit, captain_discord,
                    roster, has_substitutes, substitutes, can_attend_lan, travel_from,
                    payment_holder_name, payment_receipt_url, payment_amount, payment_method, status,
                    accepted_rules, accepted_identity, accepted_fairplay, accepted_commitment, accepted_data_public, accepted_image_promo,
                    comments
                ) VALUES (
                    $1, $2, $3, $4, $5,
                    $6, $7, $8, $9, $10, $11, $12,
                    $13, $14, $15, $16, $17,
                    $18, $19, $20, $21, $22,
                    $23, $24, $25, $26, $27, $28,
                    $29
                ) RETURNING id;
            `;
            const values = [
                registrationData.team_name,
                registrationData.team_tag,
                registrationData.origin_city,
                registrationData.instagram,
                registrationData.logo_url,
                registrationData.captain_name,
                registrationData.captain_nick,
                registrationData.captain_phone,
                registrationData.captain_email,
                registrationData.captain_steam,
                registrationData.captain_faceit,
                registrationData.captain_discord,
                JSON.stringify(registrationData.roster),
                registrationData.has_substitutes,
                JSON.stringify(registrationData.substitutes),
                registrationData.can_attend_lan,
                registrationData.travel_from,
                registrationData.payment_holder_name,
                registrationData.payment_receipt_url,
                registrationData.payment_amount,
                registrationData.payment_method,
                registrationData.status,
                registrationData.accepted_rules,
                registrationData.accepted_identity,
                registrationData.accepted_fairplay,
                registrationData.accepted_commitment,
                registrationData.accepted_data_public,
                registrationData.accepted_image_promo,
                registrationData.comments
            ];
            const result = await pool.query(query, values);
            insertedId = result.rows[0].id;
            registrationData.id = insertedId;
        } catch (dbErr) {
            console.warn('DB Insert failed, saving into fallback JSON store:', dbErr.message);
            insertedId = Date.now();
            registrationData.id = insertedId;
        }

        // Always sync with local backup JSON
        const localList = getLocalRegistrations();
        localList.unshift(registrationData);
        saveLocalRegistrations(localList);

        res.json({
            success: true,
            id: insertedId,
            message: 'Inscripción registrada con éxito'
        });
    } catch (err) {
        console.error('Error registering tournament team:', err);
        res.status(500).json({ error: 'Ocurrió un error al procesar la inscripción.' });
    }
});

// Admin: Get all registrations
app.get('/api/admin/tournament/registrations', isAdmin, async (req, res) => {
    try {
        let rows = [];
        try {
            const result = await pool.query('SELECT * FROM tournament_registrations ORDER BY created_at DESC');
            rows = result.rows;
        } catch (dbErr) {
            console.warn('DB select failed, reading from local JSON backup:', dbErr.message);
            rows = getLocalRegistrations();
        }
        res.json(rows);
    } catch (err) {
        console.error('Error fetching tournament registrations:', err);
        res.status(500).json({ error: 'Error al obtener inscripciones.' });
    }
});

// Admin: Update registration status (e.g., 'confirmado', 'pendiente', 'rechazado')
app.put('/api/admin/tournament/registrations/:id/status', isAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        
        try {
            await pool.query('UPDATE tournament_registrations SET status = $1 WHERE id = $2', [status, id]);
        } catch (dbErr) {
            console.warn('DB update failed, updating local JSON backup:', dbErr.message);
        }

        const localList = getLocalRegistrations();
        const item = localList.find(r => String(r.id) === String(id));
        if (item) {
            item.status = status;
            saveLocalRegistrations(localList);
        }

        res.json({ success: true, status });
    } catch (err) {
        console.error('Error updating status:', err);
        res.status(500).json({ error: 'Error al actualizar estado.' });
    }
});

// Admin: Delete registration
app.delete('/api/admin/tournament/registrations/:id', isAdmin, async (req, res) => {
    try {
        const id = req.params.id;

        try {
            await pool.query('DELETE FROM tournament_registrations WHERE id = $1', [id]);
        } catch (dbErr) {
            console.warn('DB delete failed, deleting from local JSON backup:', dbErr.message);
        }

        const localList = getLocalRegistrations();
        const filtered = localList.filter(r => String(r.id) !== String(id));
        saveLocalRegistrations(filtered);

        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting registration:', err);
        res.status(500).json({ error: 'Error al eliminar inscripción.' });
    }
});

// --- Album and Gallery API ---

app.get('/api/albums', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT a.*, 
            (SELECT url FROM gallery_media m WHERE m.album_id = a.id AND m.type = 'image' LIMIT 1) as cover_url
            FROM gallery_albums a
            ORDER BY a.event_date DESC, a.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch albums' });
    }
});

app.post('/api/albums', isAdmin, async (req, res) => {
    try {
        const { title, event_date } = req.body;
        const result = await pool.query(
            'INSERT INTO gallery_albums (title, event_date) VALUES ($1, $2) RETURNING *',
            [title, event_date]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create album' });
    }
});

app.delete('/api/albums/:id', isAdmin, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        // Delete physical files first
        const media = await pool.query('SELECT url FROM gallery_media WHERE album_id = $1', [id]);
        media.rows.forEach(item => {
            const filePath = path.join(__dirname, item.url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });
        
        // cascade delete should handle db records, but let's be explicit just in case
        await pool.query('DELETE FROM gallery_media WHERE album_id = $1', [id]);
        await pool.query('DELETE FROM gallery_albums WHERE id = $1', [id]);
        
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete album' });
    }
});

app.get('/api/gallery/:album_id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM gallery_media WHERE album_id = $1 ORDER BY created_at DESC', [req.params.album_id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch gallery' });
    }
});

// API: Upload to gallery (multiple files)
app.post('/api/upload', isAdmin, upload.array('media', 50), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    const album_id = req.body.album_id;
    if (!album_id) {
        // cleanup files if album_id is missing
        req.files.forEach(file => fs.unlinkSync(file.path));
        return res.status(400).json({ error: 'Album ID is required' });
    }

    try {
        const uploaderSteamId = req.user.steam_id;
        const insertedMedia = [];

        for (const file of req.files) {
            const filename = file.filename;
            const type = file.mimetype.startsWith('video') ? 'video' : 'image';
            const url = `assets/gallery/${filename}`;

            const result = await pool.query(
                'INSERT INTO gallery_media (filename, type, url, uploader_steam_id, album_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [filename, type, url, uploaderSteamId, album_id]
            );
            insertedMedia.push(result.rows[0]);
        }

        res.json({ success: true, media: insertedMedia });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save media data' });
    }
});

// API: Delete from gallery (individual item)
app.delete('/api/gallery/item/:id', isAdmin, async (req, res) => {
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

// --- Matches API (CS2 Integration) ---

// Plugin sends match data here
app.post('/api/matches', express.json(), async (req, res) => {
    // API Key protection so only the CS2 server can send data
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== (process.env.CS2_API_KEY || 'viejo_cs2_secret')) {
        return res.status(401).json({ error: 'Unauthorized plugin key' });
    }

    try {
        const { map_name, team_ct_score, team_t_score, duration, stats } = req.body;
        const result = await pool.query(
            'INSERT INTO matches (map_name, team_ct_score, team_t_score, duration, stats) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [map_name || 'Unknown', team_ct_score || 0, team_t_score || 0, duration || '00:00', JSON.stringify(stats || [])]
        );
        res.json({ success: true, match: result.rows[0] });
    } catch (error) {
        console.error('Error saving match:', error);
        res.status(500).json({ error: 'Failed to save match data' });
    }
});

app.get('/api/matches', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, map_name, team_ct_score, team_t_score, match_date, duration FROM matches ORDER BY match_date DESC LIMIT 50');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).json({ error: 'Failed to fetch matches' });
    }
});

app.get('/api/matches/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query('SELECT * FROM matches WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Match not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching match:', error);
        res.status(500).json({ error: 'Failed to fetch match' });
    }
});

// Dynamic Meta Tags for Albums
app.get('/galeria/:id', async (req, res, next) => {
    // If it's a static asset request, let it fall through
    if (req.params.id.includes('.')) return next();
    
    try {
        const albumId = parseInt(req.params.id);
        if (isNaN(albumId)) return next();

        const result = await pool.query(`
            SELECT a.title, 
            (SELECT url FROM gallery_media m WHERE m.album_id = a.id AND m.type = 'image' LIMIT 1) as cover_url
            FROM gallery_albums a WHERE a.id = $1
        `, [albumId]);
        
        let html = fs.readFileSync(path.join(frontendDistPath, 'index.html'), 'utf8');

        if (result.rows.length > 0) {
            const album = result.rows[0];
            const title = `El Viejo Gamer | ${album.title}`;
            const coverUrl = album.cover_url ? `https://elviejogamer.ngamers.net/${album.cover_url}` : 'https://elviejogamer.ngamers.net/assets/hero_bg.jpg';
            
            html = html.replace(/<title>.*<\/title>/, `<title>${title}</title>`);
            html = html.replace(/<meta property="og:title" content="[^"]*"/g, `<meta property="og:title" content="${title}"`);
            html = html.replace(/<meta property="twitter:title" content="[^"]*"/g, `<meta property="twitter:title" content="${title}"`);
            html = html.replace(/<meta property="og:image" content="[^"]*"/g, `<meta property="og:image" content="${coverUrl}"`);
            html = html.replace(/<meta property="twitter:image" content="[^"]*"/g, `<meta property="twitter:image" content="${coverUrl}"`);
        }
        res.send(html);
    } catch (err) {
        console.error('Error dynamic meta:', err);
        res.sendFile(path.join(frontendDistPath, 'index.html'));
    }
});

// React Router fallback (MUST BE THE LAST ROUTE)
app.get(/.*$/, (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`El Viejo Gamer Server running on http://localhost:${PORT}`);
});
